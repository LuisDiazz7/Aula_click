// ============================================================================
// conversacionService.js — Historial del Tutor IA en Supabase
// Tablas: conversaciones (id, usuario_id, nivel, asignatura, titulo, creada_en)
//         mensajes (id, conversacion_id, rol, contenido, creado_en)
// RLS: el alumno solo ve/edita sus propias filas (usuario_id = auth.uid()).
// ============================================================================

import { supabase } from './supabase'

export const LIMITE_HISTORIAL = 20

async function usuarioActual() {
  const { data, error } = await supabase.auth.getUser()
  if (error) return null
  return data?.user ?? null
}

// Conversación activa = la más reciente del alumno.
// - Si no existe, se crea una nueva con su nivel (3° o 4° Medio).
// - Si la última está vacía, se reutiliza (evita filas basura).
// - Si cambió de nivel, se abre una conversación nueva.
// - withForzarNueva=true ("Nueva conversación"): solo reutiliza la última si está vacía.
export async function asegurarConversacionActiva({ nivel, forzarNueva = false } = {}) {
  const user = await usuarioActual()
  if (!user) {
    return { error: 'Tu sesión expiró. Cierra sesión y vuelve a entrar.' }
  }

  const nivelLimpio = String(nivel || '').trim()

  const { data: ultima, error: errorLectura } = await supabase
    .from('conversaciones')
    .select('id, titulo, nivel, asignatura')
    .eq('usuario_id', user.id)
    .order('creada_en', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (errorLectura) {
    return { error: errorLectura.message }
  }

  if (!forzarNueva && ultima && String(ultima.nivel || '') === nivelLimpio) {
    return { data: ultima }
  }

  if (ultima) {
    const { count, error: errorCount } = await supabase
      .from('mensajes')
      .select('id', { count: 'exact', head: true })
      .eq('conversacion_id', ultima.id)

    if (errorCount) return { error: errorCount.message }

    if ((count ?? 0) === 0) {
      if (String(ultima.nivel || '') !== nivelLimpio && nivelLimpio) {
        await supabase.from('conversaciones').update({ nivel: nivelLimpio }).eq('id', ultima.id)
      }
      return { data: { ...ultima, nivel: nivelLimpio || ultima.nivel } }
    }
  }

  const { data: nueva, error: errorInsert } = await supabase
    .from('conversaciones')
    .insert({
      usuario_id: user.id,
      nivel: nivelLimpio || null,
      asignatura: null,
    })
    .select('id, titulo, nivel, asignatura')
    .single()

  if (errorInsert) return { error: errorInsert.message }
  return { data: nueva }
}

// Lista todas las conversaciones del alumno (de la más reciente a la más antigua).
export async function listarConversaciones() {
  const user = await usuarioActual()
  if (!user) return { error: 'Tu sesión expiró. Cierra sesión y vuelve a entrar.' }

  const { data, error } = await supabase
    .from('conversaciones')
    .select('id, titulo, nivel, asignatura, creada_en')
    .eq('usuario_id', user.id)
    .order('creada_en', { ascending: false })

  if (error) return { error: error.message }
  return { data: data || [] }
}

// Elimina una conversación y todos sus mensajes.
export async function eliminarConversacion(conversacionId) {
  const { error: errorMensajes } = await supabase
    .from('mensajes')
    .delete()
    .eq('conversacion_id', conversacionId)

  if (errorMensajes) return { error: errorMensajes.message }

  const { error } = await supabase.from('conversaciones').delete().eq('id', conversacionId)

  if (error) return { error: error.message }
  return { success: true }
}

// Guarda el título (~40 caracteres de la primera pregunta) solo si aún no existe.
export async function asignarTituloSiVacio(conversacionId, texto) {
  const titulo = String(texto || '').trim().slice(0, 40)
  if (!titulo) return { data: null }

  const { data, error } = await supabase
    .from('conversaciones')
    .update({ titulo })
    .eq('id', conversacionId)
    .is('titulo', null)
    .select('id, titulo')

  if (error) return { error: error.message }
  return { data: data?.[0] ?? null }
}

// Carga todos los mensajes guardados de una conversación (para mostrarlos al abrir el chat).
export async function cargarMensajes(conversacionId) {
  const { data, error } = await supabase
    .from('mensajes')
    .select('id, rol, contenido, creado_en')
    .eq('conversacion_id', conversacionId)
    .order('creado_en', { ascending: true })

  if (error) return { error: error.message }

  return {
    data: (data || []).map((m) => ({
      id: m.id,
      rol: m.rol === 'user' ? 'user' : 'tutor',
      texto: String(m.contenido || ''),
    })),
  }
}

// Guarda un mensaje del alumno o del tutor.
export async function guardarMensaje(conversacionId, rol, contenido) {
  const { data, error } = await supabase
    .from('mensajes')
    .insert({
      conversacion_id: conversacionId,
      rol,
      contenido: String(contenido || ''),
    })
    .select('id, rol, contenido, creado_en')
    .single()

  if (error) return { error: error.message }
  return { data }
}

// Últimos N mensajes (en orden cronológico) para mandarlos como historial al modelo.
export async function obtenerHistorial(conversacionId, limite = LIMITE_HISTORIAL) {
  const { data, error } = await supabase
    .from('mensajes')
    .select('rol, contenido')
    .eq('conversacion_id', conversacionId)
    .order('creado_en', { ascending: false })
    .limit(limite)

  if (error) return { error: error.message }

  return {
    data: (data || [])
      .map((m) => ({ rol: m.rol, contenido: String(m.contenido || '') }))
      .reverse(),
  }
}
