// ============================================================================
// mockTutor.js — RESPUESTAS SIMULADAS DEL TUTOR IA (MOCK)
// ============================================================================
//
// ⚠️ IMPORTANTE
// ----------------------------------------------------------------------------
// Este archivo es TEMPORAL. NO hace llamadas a ninguna API, NO usa Gemini,
// NO usa API keys ni variables de entorno.
//
// Cuando conectemos el Tutor IA real, SOLO hay que reemplazar el cuerpo de la
// función `mockTutorResponse` por una llamada a nuestro backend (que a su vez
// consultará Gemini). La firma `(message, context)` y el formato de retorno
// `{ text, actions }` ya están preparados para ese reemplazo.
//
// --- TODO(GEMINI): reemplazar este archivo por el cliente real del modelo. ---
// ============================================================================

const RETARDO_MIN = 600
const RETARDO_MAX = 1000

function esperar() {
  const ms = RETARDO_MIN + Math.random() * (RETARDO_MAX - RETARDO_MIN)
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function detectarAsignatura(texto) {
  if (/(matem|algebra|álgebra|ecuaci|función|funcio|raíz|raiz|número|numero|geometr|trigon)/.test(texto)) return 'matemáticas'
  if (/(lenguaje|escritur|lectur|gramá|grama|ortograf|comunicación|comunicacion|oración|oracion|poema|narrativ)/.test(texto)) return 'lenguaje'
  if (/(historia|históri|historic|revolución|revolucion|guer|antigu|imperio|civilización|civilizacion|medieval)/.test(texto)) return 'historia'
  if (/(inglés|ingles|english|verb|vocabulario|pronombre|pasado simple)/.test(texto)) return 'inglés'
  if (/(ciencia|ciencias|física|fisica|químic|quimic|biol|clorofila|célula|celula|átomo|atomo|fotosíntesis|fotosintesis|fuerza|energí|energi)/.test(texto)) return 'ciencias'
  return ''
}

function respuestaPorAccion(texto, asignatura) {
  const materia = asignatura || 'esta asignatura'
  if (/(da?me una pista|pista)/.test(texto)) {
    return {
      text: `Claro, aquí va una pista sobre ${materia}:\n\nDivide el problema en pasos pequeños y anota los datos que te dan antes de intentar resolverlo. Muchas veces la solución aparece sola cuando escribes lo que sabes en lugar de pensarlo "de memoria". ¿Quieres que la siga desarrollando?`,
      actions: ['Sigo sin saber por dónde partir', 'Dame otra pista'],
    }
  }
  if (/(explíca?lo más fácil|explicalo mas facil|más fácil|mas facil|fácil|facil)/.test(texto)) {
    return {
      text: `Te lo explico sin tecnicismos.\n\nImagina ${materia} como una receta de cocina: primero lees los ingredientes (los datos), luego sigues los pasos uno por uno y al final revisas el resultado. No hay atajos, solo orden. ¿Prefieres que lo veamos con un ejemplo concreto?`,
      actions: ['Dame un ejemplo'],
    }
  }
  if (/(un ejemplo|ejemplo)/.test(texto)) {
    return {
      text: `Perfecto, veamos un ejemplo aplicado.\n\nPiensa en un problema real: por ejemplo, calcular cuánto tiempo te demoras en llegar al colegio si caminas a cierta velocidad. Ese mismo razonamiento de "datos → fórmula → resultado" se usa en ${materia}. ¿Lo aplicamos tú y yo paso a paso?`,
      actions: ['Dame una pista', 'Practiquemos'],
    }
  }
  if (/(practiquemos|practicar|ejercicio)/.test(texto)) {
    return {
      text: `¡Bien, a practicar!\n\nTe propongo este ejercicio: escribe el enunciado con tus propias palabras, identifica qué te están preguntando y luego resuelve el primer paso. Cuando lo tengas, dímelo y yo reviso tu razonamiento paso a paso. ¿Partimos?`,
      actions: ['Ya lo resolví', 'Explícalo más fácil', 'Dame una pista'],
    }
  }
  return ''
}

function respuestaPorMateria(materia, texto, context) {
  const curso = context?.curso || 'tu curso'

  if (materia === 'matemáticas') {
    return {
      text: `Vamos paso a paso.\n\nUna función cuadrática normalmente tiene la forma:\n\nf(x) = ax² + bx + c\n\nEn ${curso} el concepto se entiende mejor si separamos qué hace cada parte (a, b y c). ¿Quieres que primero te explique qué representa cada una o prefieres verlo con un ejemplo?`,
      actions: ['Dame una pista', 'Explícalo más fácil', 'Dame un ejemplo'],
    }
  }

  if (materia === 'lenguaje') {
    return {
      text: `Buena pregunta de lenguaje. Lo más importante es no memorizar definiciones, sino ver cómo funciona en un texto real.\n\nTe propongo lo siguiente: escribimos una oración corta y la analizamos juntos parte por parte (qué cumple cada palabra). ¿Partimos por un ejemplo sencillo?`,
      actions: ['Dame un ejemplo', 'Explícalo más fácil'],
    }
  }

  if (materia === 'historia') {
    return {
      text: `Buen tema de historia. Para entender los procesos históricos conviene ordenarlos en tres momentos: antes (causas), durante (hechos) y después (consecuencias).\n\nPensemos en la Revolución Industrial así y verás que todo encaja. ¿Empezamos por las causas?`,
      actions: ['Dame una pista', 'Explícalo más fácil', 'Dame un ejemplo'],
    }
  }

  if (materia === 'inglés') {
    return {
      text: `¡Good question! En inglés lo clave es ver el patrón, no memorizar de todo.\n\nPor ejemplo, el pasado de los verbos regulares termina en "-ed", pero hay verbos irregulares que cambian por completo. ¿Quieres que te arme una mini lista con tus verbos más usados y practiquemos con frases?`,
      actions: ['Dame un ejemplo', 'Practiquemos', 'Explícalo más fácil'],
    }
  }

  if (materia === 'ciencias') {
    return {
      text: `Buena pregunta de ciencias. Acá lo importante es relacionar la teoría con algo que puedas observar. Vamos a hacerlo así: primero definimos el fenómeno con tus palabras, y después lo conectamos con un ejemplo de la vida diaria.\n\n¿Empezamos por el ejemplo?`,
      actions: ['Dame un ejemplo', 'Dame una pista', 'Explícalo más fácil'],
    }
  }

  return {
    text: `Entiendo, ${texto}.\n\nMi rol es ayudarte a APRENDER, no solo darte la respuesta. Te propongo:\n\n1. Que me cuentes qué parte no te queda clara.\n2. Lo desglosamos en pasos pequeños.\n3. Resolvemos juntos hasta que tú puedas hacerlo solo.\n\n¿Por dónde partimos?`,
    actions: ['Dame una pista', 'Explícalo más fácil', 'Practiquemos'],
  }
}

export async function mockTutorResponse(message, context = {}) {
  // Latencia mínima para simular que el tutor "está pensando".
  await esperar()

  const texto = String(message || '').trim().toLowerCase()
  const asignaturaContexto = context?.asignatura || ''

  const porAccion = respuestaPorAccion(texto, asignaturaContexto.toLowerCase())
  if (porAccion) return porAccion

  const materia = detectarAsignatura(texto) || asignaturaContexto.toLowerCase()
  if (materia) return respuestaPorMateria(materia, message, context)

  return respuestaPorMateria('', message, context)
}