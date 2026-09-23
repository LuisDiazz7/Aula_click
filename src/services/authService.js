import { supabase } from './supabase'

export async function signUp(correo, contrasena) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: correo,
    password: contrasena,
  })

  if (authError) return { error: authError.message }
  if (!authData?.user) return { error: 'No se pudo crear la cuenta. Revisa la información.' }

  return { success: true, user: authData.user }
}

export async function signIn(correo, contrasena) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: correo,
    password: contrasena,
  })

  if (error) return { error: error.message }
  await asegurarUsuarioEnBase(correo)
  return { success: true, user: data.user }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) return { error: error.message }
  return { success: true }
}

export async function resetPasswordForEmail(correo) {
  const { error } = await supabase.auth.resetPasswordForEmail(correo, {
    redirectTo: `${window.location.origin}/restablecer-password`,
  })

  if (error) return { error: error.message }
  return { success: true }
}

export async function updatePassword(nuevaContrasena) {
  const { error } = await supabase.auth.updateUser({ password: nuevaContrasena })
  if (error) return { error: error.message }
  return { success: true }
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((_event, session) => callback(session))
}

// Crea (si no existe) la fila de la tabla `usuario` relacionada con el correo.
// Solo se invoca cuando ya hay una sesión autenticada (RLS lo permite).
export async function asegurarUsuarioEnBase(correo) {
  if (!correo) return null

  const { data: existente } = await supabase
    .from('usuario')
    .select('id')
    .eq('correo', correo.toLowerCase())
    .maybeSingle()

  if (existente) return existente

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: insertado, error } = await supabase
    .from('usuario')
    .insert({ correo: correo.toLowerCase(), contrasena: null, auth_uid: user.id })
    .select('id')
    .single()

  if (error) return null
  return insertado
}