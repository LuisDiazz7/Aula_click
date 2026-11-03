import matematica from './matematica.mjs'
import lenguaje from './lenguaje.mjs'
import ingles from './ingles.mjs'
import ciencias from './ciencias.mjs'
import historia from './historia.mjs'
import matematicaPaes from './matematica-paes.mjs'
import cienciasPaes from './ciencias-paes.mjs'
import historiaPaes from './historia-paes.mjs'

// Temas agregados para completar el temario PAES (se cargan con la migración 0007).
export const TEMAS_PAES = [...matematicaPaes, ...cienciasPaes, ...historiaPaes]

export const ASIGNATURAS = [
  ['Matemática', [...matematica, ...matematicaPaes]],
  ['Lenguaje', lenguaje],
  ['Inglés', ingles],
  ['Ciencias', [...ciencias, ...cienciasPaes]],
  ['Historia', [...historia, ...historiaPaes]],
]
