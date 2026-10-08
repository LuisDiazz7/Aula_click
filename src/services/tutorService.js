// ============================================================================
// tutorService.js — TUTOR IA CON GEMINI
// ============================================================================

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const MODEL = 'gemini-2.5-flash-lite'

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
Usa el contexto (curso/asignatura) para adaptar tu explicación al nivel adecuado.`

function buildUserPrompt(message, context = {}) {
  const { curso = '', asignatura = '' } = context
  return `Mensaje del estudiante: "${message}"

Contexto:
- Curso: ${curso || 'No especificado'}
- Asignatura: ${asignatura || 'No especificada'}

Responde siguiendo estrictamente el formato JSON indicado.`
}

export async function tutorResponse(message, context = {}) {
  if (!GEMINI_API_KEY) {
    throw new Error('Falta VITE_GEMINI_API_KEY en .env')
  }

  const limpio = String(message || '').trim()
  if (!limpio) {
    return {
      text: 'Escribe tu duda y te ayudo paso a paso.',
      actions: ['Explícame un concepto', 'Dame un ejemplo', 'Practiquemos'],
    }
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents: [
            {
              parts: [{ text: buildUserPrompt(limpio, context) }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 1024,
            responseMimeType: 'application/json',
          },
        }),
      }
    )

    if (!res.ok) {
      const err = await res.text()
      console.error('Error Gemini API:', err)
      throw new Error('No se pudo conectar con el Tutor IA')
    }

    const data = await res.json()
    const candidato = data?.candidates?.[0]
    const parte = candidato?.content?.parts?.[0]?.text

    if (!parte) {
      throw new Error('Respuesta vacía de Gemini')
    }

    let parsed
    try {
      parsed = JSON.parse(parte)
    } catch (e) {
      console.error('Respuesta no JSON:', parte)
      parsed = {
        text: parte.replace(/```json|```/g, '').trim(),
        actions: ['Dame una pista', 'Explícalo más fácil', 'Practiquemos'],
      }
    }

    if (!parsed.text || !Array.isArray(parsed.actions)) {
      parsed = {
        text: parsed.text || 'Te ayudo paso a paso. ¿Por dónde quieres empezar?',
        actions: Array.isArray(parsed.actions) ? parsed.actions.slice(0, 3) : ['Dame una pista', 'Explícalo más fácil', 'Practiquemos'],
      }
    }

    parsed.actions = parsed.actions.slice(0, 3).map((a) => String(a).trim())

    return parsed
  } catch (error) {
    console.error('Error en tutorResponse:', error)
    return {
      text: 'Ocurrió un error al conectar con Gemini. Inténtalo de nuevo en unos segundos.',
      actions: ['Reintentar', 'Dame una pista'],
    }
  }
}
