// Mezcla determinista de alternativas: el mismo tema siempre produce el mismo orden,
// así los PDFs y la base de datos coinciden y la respuesta correcta no queda siempre en la misma letra.
function semilla(texto) {
  let h = 2166136261
  for (const c of texto) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

export function mezclarAlternativas(tema) {
  return tema.ejercicios.map(([enunciado, alternativas, letra, explicacion], i) => {
    const azar = semilla(`${tema.slug}-${i}`)
    const correcta = alternativas[letra.charCodeAt(0) - 65]
    const orden = [...alternativas]
    for (let j = orden.length - 1; j > 0; j--) {
      const k = Math.floor(azar() * (j + 1))
      ;[orden[j], orden[k]] = [orden[k], orden[j]]
    }
    return { enunciado, alternativas: orden, letra: String.fromCharCode(65 + orden.indexOf(correcta)), explicacion }
  })
}
