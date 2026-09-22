import { supabase } from './supabase'

export async function getAsignatura(idAsignatura) {
  const { data, error } = await supabase
    .from('asignaturas')
    .select('id, nombre, descripcion')
    .eq('id', idAsignatura)
    .single()

  if (error) return { error: error.message }
  return { data }
}

export async function getAsignaturasPorCurso(idCurso) {
  const { data, error } = await supabase
    .from('asignatura_curso')
    .select(`
      id,
      asignaturas ( id, nombre, descripcion )
    `)
    .eq('id_curso', idCurso)
    .order('id')

  if (error) return { error: error.message }

  const asignaturas = data.map((item) => item.asignaturas)
  return { data: asignaturas }
}

export async function getRamasPorAsignatura(idAsignatura) {
  const { data, error } = await supabase
    .from('ramas')
    .select(`
      id,
      nombre,
      temas ( id, nombre )
    `)
    .eq('id_asignatura', idAsignatura)
    .order('id')

  if (error) return { error: error.message }
  return { data }
}

export async function getRama(idRama) {
  const { data, error } = await supabase
    .from('ramas')
    .select(`
      id,
      nombre,
      id_asignatura,
      temas ( id, nombre )
    `)
    .eq('id', idRama)
    .single()

  if (error) return { error: error.message }
  return { data }
}

export async function getTema(idTema) {
  const { data, error } = await supabase
    .from('temas')
    .select(`
      id,
      nombre,
      ramas ( id, nombre, id_asignatura ),
      videos ( id, titulo, descripcion, url, id_youtube, canal ),
      pdfs ( id, titulo, descripcion, url ),
      ejercicios ( id )
    `)
    .eq('id', idTema)
    .single()

  if (error) return { error: error.message }
  return { data }
}