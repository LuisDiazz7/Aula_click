import { supabase } from './supabase'

export async function getUsuarioPorCorreo(correo) {
  const { data, error } = await supabase
    .from('usuario')
    .select('id, correo')
    .eq('correo', correo.toLowerCase())
    .maybeSingle()

  if (error) return { error: error.message }
  return { data }
}

export async function getCursos() {
  const { data, error } = await supabase
    .from('cursos')
    .select('id, nombre')
    .order('id')

  if (error) return { error: error.message }
  return { data }
}

export async function getPerfilEstudiante(idUsuario) {
  const { data, error } = await supabase
    .from('perfil_estudiante')
    .select(`
      id,
      nombre,
      id_curso,
      area,
      cursos ( id, nombre )
    `)
    .eq('id_usuario', idUsuario)
    .maybeSingle()

  if (error) return { error: error.message }
  return { data }
}

export async function crearPerfilEstudiante({ idUsuario, nombre, idCurso, area }) {
  const { data, error } = await supabase
    .from('perfil_estudiante')
    .insert({
      id_usuario: idUsuario,
      nombre,
      id_curso: idCurso,
      area,
    })
    .select('id, nombre, id_curso, area, cursos ( id, nombre )')
    .single()

  if (error) return { error: error.message }
  return { data }
}

export async function actualizarPerfilEstudiante(idPerfil, { nombre, idCurso, area }) {
  const { data, error } = await supabase
    .from('perfil_estudiante')
    .update({ nombre, id_curso: idCurso, area })
    .eq('id', idPerfil)
    .select('id, nombre, id_curso, area, cursos ( id, nombre )')
    .single()

  if (error) return { error: error.message }
  return { data }
}