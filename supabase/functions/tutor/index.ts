import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") ?? "";
const PRIMARY_MODEL = Deno.env.get("GEMINI_MODEL") ?? "gemini-3.5-flash-lite";
const FALLBACK_MODEL = "gemini-flash-lite-latest";
const REQUEST_TIMEOUT_MS = 30000;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_HISTORY_TURNS = 20;

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const DEFAULT_ACTIONS = ["Dame una pista", "Explícalo más fácil", "Practiquemos"];

const SYSTEM_PROMPT_BASE = `Eres un tutor IA educativo para estudiantes de secundaria chilena, enfocado en la preparación de la PAES.

Tu objetivo PRINCIPAL: AYUDAR A QUE EL ESTUDIANTE APRENDA, NO darle la respuesta directa.

Reglas obligatorias:
- Explica paso a paso, siempre descomponiendo en partes pequeñas.
- Usa lenguaje claro, sencillo y motivador.
- Nunca des la solución completa de un ejercicio a menos que el estudiante te lo pida explícitamente después de haber intentado y tú lo hayas guiado.
- Haz preguntas para guiar su razonamiento.
- Sé empático y paciente.
- Responde SIEMPRE en español neutro y correcto.
- Usa el lenguaje y la profundidad propios del nivel del estudiante.
- Conecta los temas con el estilo de preguntas PAES cuando tenga sentido.

Formato de respuesta OBLIGATORIO (JSON estricto):
Debes responder ÚNICAMENTE con un objeto JSON válido con esta estructura exacta:

{
  "text": "Explicación o respuesta detallada en español, con saltos de línea cuando corresponda.",
  "actions": ["Acción sugerida 1", "Acción sugerida 2", "Acción sugerida 3"]
}

Requisitos para actions:
- Debe ser un array con 1 a 3 acciones como máximo.
- Usa frases cortas, naturales y útiles para guiar al estudiante (ej.: "Dame una pista", "Dame un ejemplo", "Practiquemos", "Ya lo resolví", "Sigo sin entender").
- No uses emojis, markdown enriquecido innecesario o texto fuera del JSON.

Instrucciones de enseñanza:
- Si pide pista: dale una pista, NO la respuesta.
- Si pide que lo expliques más fácil: usa analogías simples de la vida diaria.
- Si pide ejemplo: pon un ejemplo concreto y pequeño.
- Si pide practicar: propón un mini ejercicio para practicar paso a paso.
- Continúa siempre el hilo de la conversación; nunca ignores lo que ya se habló.`;

type ChatTurn = { rol?: unknown; role?: unknown; contenido?: unknown; content?: unknown };

// Saludo solo al inicio: nunca en mitad de la conversación.
function buildGreetingInstruction(tieneHistorial: boolean): string {
  if (tieneHistorial) {
    return `CONVERSACIÓN EN CURSO (ya hay mensajes previos):
- Empieza tu respuesta DIRECTAMENTE con el contenido. NO saludes.
- Prohibido empezar con "Hola", "¡Hola!", "Buenas", "Claro que sí", "Por supuesto", "¡Genial!", "Entiendo" ni cualquier otra frase de relleno o presentación.
- NO vuelvas a presentarte ni repitas el mensaje de bienvenida.
- Continúa el hilo de forma natural, usando lo que ya se habló.
- Acciones (botones): INCLUYE sugerencias SOLO si el estudiante aún no dice el tema (por ejemplo, solo mandó un saludo o "hola"). Si ya explicó su duda, las acciones deben ser pasos de seguimiento concretos sobre ese tema; nunca saludos ni presentación.`;
  }
  return `PRIMER MENSAJE de la conversación:
- Puedes saludar UNA sola vez (una línea breve) antes de ayudar.
- Puedes incluir 1 a 3 acciones de bienvenida para sugerir por dónde partir.`;
}

// Cómo adaptar la respuesta al nivel del alumno (PAES).
function buildNivelInstruction(nivel: string): string {
  if (!nivel) {
    return "- Nivel: no especificado (usa un lenguaje de secundaria general).";
  }
  return `- El estudiante cursa ${nivel} y se está preparando para la PAES de esa asignatura.`;
}

type GeminiTurn = { role: "user" | "model"; text: string };

// Convierte el historial guardado en turns de Gemini (sin saltos de rol consecutivo).
function buildContents(history: ChatTurn[], message: string): GeminiTurn[] {
  const turns: GeminiTurn[] = [];

  for (const item of history) {
    const rol = String(item?.rol ?? item?.role ?? "").trim();
    const texto = String(item?.contenido ?? item?.content ?? "").trim();
    if (!texto) continue;
    const role: "user" | "model" = rol === "assistant" ? "model" : "user";
    const last = turns[turns.length - 1];
    if (last && last.role === role) {
      last.text += "\n" + texto;
    } else {
      turns.push({ role, text: texto });
    }
  }

  const ultimo = turns[turns.length - 1];
  if (ultimo && ultimo.role === "user") {
    ultimo.text += "\n\n" + message;
  } else {
    turns.push({ role: "user", text: message });
  }

  return turns;
}

type TutorContext = { curso: string; asignatura: string; nivel: string };

// Contexto del alumno (nivel/curso/asignatura) para adaptar la respuesta a la PAES.
function buildContextBlock(context: TutorContext): string {
  return `Contexto del estudiante:
${buildNivelInstruction(context.nivel)}
- Curso: ${context.curso || "No especificado"}
- Asignatura: ${context.asignatura || "No especificada"}`;
}

type GeminiResult = { ok: boolean; status: number; data: unknown; raw: string };

function jsonResponse(payload: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" },
  });
}

function fail(
  error: string,
  message: string,
  status: number,
  retryable = false,
): Response {
  return jsonResponse({ ok: false, error, message, retryable }, status);
}

function normalizeReply(parsed: unknown) {
  const obj = parsed && typeof parsed === "object"
    ? (parsed as Record<string, unknown>)
    : {};
  let text = typeof obj.text === "string" ? obj.text.trim() : "";
  const rawActions = Array.isArray(obj.actions) ? obj.actions : [];

  if (!text) text = "Te ayudo paso a paso. ¿Por dónde quieres empezar?";

  let actions = rawActions
    .map((a) => String(a).trim())
    .filter(Boolean)
    .slice(0, 3);
  if (actions.length === 0) actions = DEFAULT_ACTIONS;

  return { text, actions };
}

async function geminiFetch(
  model: string,
  payload: unknown,
  signal: AbortSignal,
): Promise<GeminiResult> {
  const url = "https://generativelanguage.googleapis.com/v1beta/models/" +
    model +
    ":generateContent?key=" +
    encodeURIComponent(GEMINI_API_KEY);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify(payload),
  });

  let raw = "";
  let data: unknown = null;
  try {
    raw = await res.text();
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = null;
  }

  return { ok: res.ok, status: res.status, data, raw };
}

function errorInfo(result: GeminiResult): { status: string; message: string } {
  const err = (result?.data as { error?: { status?: unknown; message?: unknown } })
    ?.error;
  return {
    status: String(err?.status ?? ""),
    message: String(err?.message ?? result?.raw ?? "").slice(0, 400),
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return fail("method_not_allowed", "Método no permitido.", 405);
  }

  if (!GEMINI_API_KEY) {
    console.error("[tutor] GEMINI_API_KEY no está configurada en el servidor");
    return fail(
      "server_misconfigured",
      "El Tutor IA todavía no está configurado. Avisa a tu profesor o administrador.",
      500,
    );
  }

  let body: {
    message?: unknown;
    history?: ChatTurn[];
    context?: { curso?: unknown; asignatura?: unknown; nivel?: unknown };
  };
  try {
    body = await req.json();
  } catch {
    return fail("bad_request", "No pudimos leer tu mensaje. Inténtalo de nuevo.", 400);
  }

  const message = String(body?.message ?? "").trim().slice(0, MAX_MESSAGE_LENGTH);
  const context: TutorContext = {
    curso: String(body?.context?.curso ?? "").trim().slice(0, 120),
    asignatura: String(body?.context?.asignatura ?? "").trim().slice(0, 120),
    nivel: String(body?.context?.nivel ?? "").trim().slice(0, 120),
  };

  const rawHistory = Array.isArray(body?.history) ? body.history : [];
  const history = rawHistory
    .slice(-MAX_HISTORY_TURNS)
    .map((item) => ({
      rol: String(item?.rol ?? item?.role ?? "").trim(),
      contenido: String(item?.contenido ?? item?.content ?? "").trim().slice(
        0,
        MAX_MESSAGE_LENGTH,
      ),
    }))
    .filter((item) => item.contenido);

  if (!message) {
    return fail("empty_message", "Escribe tu duda y te ayudo paso a paso.", 400);
  }

  const systemPrompt = [
    SYSTEM_PROMPT_BASE,
    buildContextBlock(context),
    buildGreetingInstruction(history.length > 0),
  ].join("\n\n");

  const contents = buildContents(history, message).map((turn) => ({
    role: turn.role,
    parts: [{ text: turn.text }],
  }));

  const payload = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: {
      temperature: 0.2,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 1024,
      responseMimeType: "application/json",
    },
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let result: GeminiResult;
  try {
    result = await geminiFetch(PRIMARY_MODEL, payload, controller.signal);
  } catch (err) {
    clearTimeout(timeoutId);
    const aborted = (err as Error)?.name === "AbortError";
    console.error(
      "[tutor] fallo de red hacia Gemini:",
      aborted ? "timeout" : (err as Error)?.message,
    );
    if (aborted) {
      return fail(
        "timeout",
        "El tutor tardó demasiado en responder. Inténtalo de nuevo.",
        504,
        true,
      );
    }
    return fail(
      "network",
      "No pudimos conectar con el Tutor IA. Revisa tu conexión e inténtalo de nuevo.",
      502,
      true,
    );
  }

  if (result.status === 404) {
    const info = errorInfo(result);
    console.error(
      `[tutor] modelo "${PRIMARY_MODEL}" no disponible (${info.status || result.status}): ${info.message}. Probando "${FALLBACK_MODEL}"…`,
    );
    try {
      result = await geminiFetch(FALLBACK_MODEL, payload, controller.signal);
    } catch (err) {
      clearTimeout(timeoutId);
      const aborted = (err as Error)?.name === "AbortError";
      console.error(
        "[tutor] fallo de red hacia Gemini (fallback):",
        aborted ? "timeout" : (err as Error)?.message,
      );
      return fail(
        aborted ? "timeout" : "network",
        aborted
          ? "El tutor tardó demasiado en responder. Inténtalo de nuevo."
          : "No pudimos conectar con el Tutor IA. Revisa tu conexión e inténtalo de nuevo.",
        aborted ? 504 : 502,
        true,
      );
    }
  }
  clearTimeout(timeoutId);

  if (!result.ok) {
    const info = errorInfo(result);
    console.error(
      `[tutor] Gemini respondió ${result.status} (${info.status || "sin estado"}): ${info.message}`,
    );

    const authHint = `${info.status} ${info.message}`;
    if (result.status === 400 && /api key not valid|API_KEY_INVALID/i.test(authHint)) {
      return fail(
        "gemini_auth",
        "No pudimos autenticar con el servicio de IA. Avisa a tu profesor o administrador.",
        502,
      );
    }
    if (result.status === 400) {
      return fail(
        "gemini_bad_request",
        "Hubo un problema al procesar tu mensaje. Inténtalo de nuevo.",
        502,
      );
    }
    if (result.status === 401 || result.status === 403) {
      return fail(
        "gemini_forbidden",
        "El Tutor IA no tiene permiso para usar el servicio de IA.",
        502,
      );
    }
    if (result.status === 404) {
      return fail(
        "model_not_found",
        "El modelo de IA configurado no está disponible en este momento.",
        502,
      );
    }
    if (result.status === 429) {
      return fail(
        "quota_exceeded",
        "El Tutor IA está recibiendo muchas solicitudes. Espera un momento e inténtalo de nuevo.",
        429,
        true,
      );
    }
    if (result.status >= 500) {
      return fail(
        "gemini_unavailable",
        "El servicio de IA no está disponible ahora. Inténtalo de nuevo en unos minutos.",
        502,
        true,
      );
    }
    return fail(
      "gemini_error",
      "No se pudo conectar con el Tutor IA. Inténtalo de nuevo.",
      502,
      true,
    );
  }

  const candidate = (result.data as {
    candidates?: {
      finishReason?: string;
      content?: { parts?: { text?: string }[] };
    }[];
  } | null)?.candidates?.[0];
  const finishReason = String(candidate?.finishReason ?? "");
  const partText = candidate?.content?.parts?.[0]?.text;

  if (!partText) {
    console.error(
      `[tutor] Gemini sin texto. finishReason=${finishReason || "desconocido"}`,
    );
    if (
      finishReason === "SAFETY" ||
      finishReason === "PROHIBITED_CONTENT" ||
      finishReason === "RECITATION"
    ) {
      return fail(
        "blocked",
        "No puedo responder a eso. Probemos con otra pregunta de tus materias.",
        200,
      );
    }
    return fail(
      "empty_response",
      "El tutor no pudo generar una respuesta. Inténtalo de nuevo.",
      502,
      true,
    );
  }

  let reply;
  try {
    reply = normalizeReply(JSON.parse(partText));
  } catch {
    reply = normalizeReply({
      text: String(partText).replace(/```json|```/g, "").trim(),
      actions: DEFAULT_ACTIONS,
    });
  }

  return jsonResponse({ ok: true, text: reply.text, actions: reply.actions });
});
