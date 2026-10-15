import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") ?? "";
const PRIMARY_MODEL = Deno.env.get("GEMINI_MODEL") ?? "gemini-3.5-flash-lite";
const FALLBACK_MODEL = "gemini-flash-lite-latest";
const REQUEST_TIMEOUT_MS = 30000;
const MAX_MESSAGE_LENGTH = 4000;

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const DEFAULT_ACTIONS = ["Dame una pista", "Explícalo más fácil", "Practiquemos"];

const SYSTEM_PROMPT = `Eres un tutor IA educativo para estudiantes de secundaria/chile o español general.

Tu objetivo PRINCIPAL: AYUDAR A QUE EL ESTUDIANTE APRENDA, NO darle la respuesta directa.

Reglas obligatorias:
- Explica paso a paso, siempre descomponiendo en partes pequeñas.
- Usa lenguaje claro, sencillo y motivador.
- Nunca des la solución completa de un ejercicio a menos que el estudiante te lo pida explícitamente después de haber intentado y tú lo hayas guiado.
- Haz preguntas para guiar su razonamiento.
- Sé empático y paciente.
- Responde SIEMPRE en español neutro y correcto.

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
- Siempre termina invitando al estudiante a continuar o decir por dónde quiere partir.

Contexto que recibirás: { message, context: { curso, asignatura } }
Usa el contexto (curso/asignatura) para adaptar tu explicación al nivel adecuado.`;

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

function buildUserPrompt(
  message: string,
  context: { curso: string; asignatura: string },
): string {
  return `Mensaje del estudiante: "${message}"

Contexto:
- Curso: ${context.curso || "No especificado"}
- Asignatura: ${context.asignatura || "No especificada"}

Responde siguiendo estrictamente el formato JSON indicado.`;
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
    context?: { curso?: unknown; asignatura?: unknown };
  };
  try {
    body = await req.json();
  } catch {
    return fail("bad_request", "No pudimos leer tu mensaje. Inténtalo de nuevo.", 400);
  }

  const message = String(body?.message ?? "").trim().slice(0, MAX_MESSAGE_LENGTH);
  const context = {
    curso: String(body?.context?.curso ?? "").trim().slice(0, 120),
    asignatura: String(body?.context?.asignatura ?? "").trim().slice(0, 120),
  };

  if (!message) {
    return fail("empty_message", "Escribe tu duda y te ayudo paso a paso.", 400);
  }

  const payload = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [
      { role: "user", parts: [{ text: buildUserPrompt(message, context) }] },
    ],
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
