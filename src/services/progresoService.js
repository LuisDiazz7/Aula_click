import { supabase } from './supabase'

// Evento en window para que /inicio y /asignaturas se refresquen
// en cuanto se guarda un resultado, sin recargar la pagina.
const EVENTO_PROGRESO = 'aulaclick:progreso-actualizado'

export function notificarProgresoActualizado() {
  window.dispatchEvent(new Event(EVENTO_PROGRESO))
}

export function onProgresoActualizado(handler) {
  window.addEventListener(EVENTO_PROGRESO, handler)
  return () => window.removeEventListener(EVENTO_PROGRESO, handler)
}

function calcularPorcentaje(completados, total) {
  if (!total) return 0
  return Math.round((completados / total) * 100)
}

/**
 * Calcula el progreso real del estudiante a partir de sus ejercitaciones.
 *
 * - Una asignatura cuenta solo los temas que tienen ejercicios publicados.
 * - Un tema se considera completado si el alumno respondio su evaluacion
 *   al menos una vez. Repetir el mismo tema NO vuelve a contarlo.
 * - El progreso general es el promedio de los porcentajes por asignatura.
 * - "Ejercicios completados" es el numero de temas distintos evaluados.
 *
 * El aislamiento por usuario lo garantiza RLS: la politica
 * `lectura_respuestas_propias` solo deja leer filas cuyo id_usuario
 * corresponde al usuario autenticado.
 */
export async function getProgresoPorAsignatura(idUsuario) {
  const vacio = { porAsignatura: {}, general: 0, ejerciciosCompletados: 0 }
  if (!idUsuario) return vacio

  const [temasRes, intentosRes] = await Promise.all([
    supabase
      .from('temas')
      .select('id, ramas ( id_asignatura ), ejercicios ( id )'),
    supabase
      .from('respuestas_estudiante')
      .select('id_tema')
      .eq('id_usuario', idUsuario),
  ])

  if (temasRes.error) return { ...vacio, error: temasRes.error.message }
  if (intentosRes.error) return { ...vacio, error: intentosRes.error.message }

  const temasEvaluados = new Set(
    (intentosRes.data || []).map((fila) => fila.id_tema).filter((id) => id != null),
  )

  const porAsignatura = {}
  const temasCompletados = new Set()

  for (const tema of temasRes.data || []) {
    const idAsignatura = tema.ramas?.id_asignatura
    if (!idAsignatura) continue
    if ((tema.ejercicios?.length ?? 0) === 0) continue

    if (!porAsignatura[idAsignatura]) {
      porAsignatura[idAsignatura] = { total: 0, completados: 0, porcentaje: 0 }
    }
    porAsignatura[idAsignatura].total += 1

    if (temasEvaluados.has(tema.id)) {
      porAsignatura[idAsignatura].completados += 1
      temasCompletados.add(tema.id)
    }
  }

  let suma = 0
  for (const datos of Object.values(porAsignatura)) {
    datos.porcentaje = calcularPorcentaje(datos.completados, datos.total)
    suma += datos.porcentaje
  }

  const totalAsignaturas = Object.keys(porAsignatura).length

  return {
    porAsignatura,
    general: totalAsignaturas ? Math.round(suma / totalAsignaturas) : 0,
    ejerciciosCompletados: temasCompletados.size,
  }
}
