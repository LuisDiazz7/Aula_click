// ============================================================================
// tutorService.js — TUTOR IA (llama a la Edge Function "tutor" de Supabase)
// La clave de Gemini vive como secreto del servidor, nunca en el frontend.
// ============================================================================

import { supabase } from './supabase'
import {
  FunctionsHttpError,
  FunctionsFetchError,
  FunctionsRelayError,
} from '@supabase/supabase-js'

const DEFAULT_ACTIONS = ['Dame una pista', 'Explícalo más fácil', 'Practiquemos']

function conAcciones(respuesta) {
  const text =
    typeof respuesta?.text === 'string' && respuesta.text.trim()
      ? respuesta.text
      : 'Te ayudo paso a paso. ¿Por dónde quieres empezar?'

  const acciones = Array.isArray(respuesta?.actions)
    ? respuesta.actions.map((a) => String(a).trim()).filter(Boolean).slice(0, 3)
    : []

  return { text, actions: acciones.length ? acciones : DEFAULT_ACTIONS }
}

async function leerMensajeDeError(error) {
  if (error instanceof FunctionsHttpError || error instanceof FunctionsRelayError) {
    try {
      const cuerpo = await error.context.json()
      if (cuerpo && typeof cuerpo.message === 'string' && cuerpo.message.trim()) {
        return cuerpo.message
      }
    } catch {
      // sin cuerpo JSON legible
    }
  }
  return null
}

export async function tutorResponse(message, context = {}) {
  const limpio = String(message || '').trim()
  if (!limpio) {
    return {
      text: 'Escribe tu duda y te ayudo paso a paso.',
      actions: ['Explícame un concepto', 'Dame un ejemplo', 'Practiquemos'],
    }
  }

  try {
    const { data, error } = await supabase.functions.invoke('tutor', {
      body: {
        message: limpio,
        context: {
          curso: String(context?.curso ?? ''),
          asignatura: String(context?.asignatura ?? ''),
        },
      },
    })

    if (error) {
      console.error('Error al invocar la función tutor:', error)
      if (error instanceof FunctionsFetchError) {
        return {
          text: 'No pudimos conectar con el Tutor IA. Revisa tu conexión e inténtalo de nuevo.',
          actions: ['Reintentar', 'Dame una pista'],
        }
      }
      const mensaje = await leerMensajeDeError(error)
      return {
        text: mensaje || 'El Tutor IA no está disponible en este momento. Inténtalo de nuevo.',
        actions: ['Reintentar', 'Dame una pista'],
      }
    }

    if (!data?.ok) {
      return {
        text: data?.message || 'El Tutor IA no está disponible en este momento. Inténtalo de nuevo.',
        actions: data?.retryable ? ['Reintentar', 'Dame una pista'] : DEFAULT_ACTIONS,
      }
    }

    return conAcciones(data)
  } catch (error) {
    console.error('Error inesperado en tutorResponse:', error)
    return {
      text: 'Ocurrió un error inesperado. Inténtalo de nuevo en unos segundos.',
      actions: ['Reintentar', 'Dame una pista'],
    }
  }
}
