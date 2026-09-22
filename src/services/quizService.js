import { supabase } from './supabase'

export async function getEjerciciosDeTema(idTema) {
  const { data, error } = await supabase
    .from('ejercicios')
    .select('id, enunciado, alt_a, alt_b, alt_c, alt_d, respuesta_correcta, retroalimentacion')
    .eq('id_tema', idTema)
    .order('id')

  if (error) return { error: error.message }
  return { data }
}

export async function getHistorialRespuestas(idUsuario, idTema) {
  const { data, error } = await supabase
    .from('respuestas_estudiante')
    .select('id, puntaje, respuestas_correctas, total_preguntas, tiempo_segundos, fecha')
    .eq('id_usuario', idUsuario)
    .eq('id_tema', idTema)
    .order('fecha', { ascending: false })

  if (error) return { error: error.message }
  return { data }
}

export async function getUltimaActividad(idUsuario) {
  const { data, error } = await supabase
    .from('respuestas_estudiante')
    .select(`
      id,
      puntaje,
      respuestas_correctas,
      total_preguntas,
      fecha,
      temas ( id, nombre, ramas ( id, nombre, id_asignatura ) )
    `)
    .eq('id_usuario', idUsuario)
    .order('fecha', { ascending: false })
    .limit(1)

  if (error) return { error: error.message }
  return { data: data?.[0] || null }
}

export async function getConteoResultados(idUsuario) {
  const { count, error } = await supabase
    .from('respuestas_estudiante')
    .select('id', { count: 'exact', head: true })
    .eq('id_usuario', idUsuario)

  if (error) return { count: 0, error: error.message }
  return { count: count ?? 0 }
}

export async function guardarResultado({ idUsuario, idTema, puntaje, correctas, total, tiempoSegundos }) {
  const { error } = await supabase.from('respuestas_estudiante').insert({
    id_usuario: idUsuario,
    id_tema: idTema,
    puntaje,
    respuestas_correctas: correctas,
    total_preguntas: total,
    tiempo_segundos: tiempoSegundos,
  })

  if (error) return { error: error.message }
  return { success: true }
}