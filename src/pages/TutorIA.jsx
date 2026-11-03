import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { IconBot } from '../utils/icons'
import { tutorResponse } from '../services/tutorService'
import {
  asegurarConversacionActiva,
  cargarMensajes,
  listarConversaciones,
  eliminarConversacion as eliminarConversacionDB,
} from '../services/conversacionService'
import TutorSidebar from '../components/tutor/TutorSidebar'
import ChatMessage from '../components/tutor/ChatMessage'
import ChatInput from '../components/tutor/ChatInput'

const SUGERENCIAS = [
  'Explícame un ejercicio',
  'No entiendo un concepto',
  'Ayúdame con Matemáticas',
  'Quiero estudiar para una prueba',
]

let siguienteId = 1

export default function TutorIA() {
  const { perfil } = useAuth()
  const [mensajes, setMensajes] = useState([])
  const [conversaciones, setConversaciones] = useState([])
  const [pensando, setPensando] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [cargandoLista, setCargandoLista] = useState(true)
  const [errorChat, setErrorChat] = useState('')
  const [conversacion, setConversacion] = useState(null)
  const [asignatura, setAsignatura] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const finRef = useRef(null)

  const nivel = perfil?.cursos?.nombre || ''
  const curso = nivel || 'Sin curso'
  const vacio = mensajes.length === 0 && !pensando && !cargando

  const refrescarLista = useCallback(async () => {
    setCargandoLista(true)
    const { data, error } = await listarConversaciones()
    if (error) console.error('Error al listar conversaciones:', error)
    setConversaciones(data || [])
    setCargandoLista(false)
  }, [])

  const inicializar = useCallback(
    async (forzarNueva = false) => {
      setCargando(true)
      setErrorChat('')

      const { data: conv, error } = await asegurarConversacionActiva({ nivel, forzarNueva })
      if (error) {
        setErrorChat(error)
        setConversacion(null)
        setMensajes([])
        setCargando(false)
        refrescarLista()
        return
      }

      setConversacion(conv)

      const { data: guardados, error: errorMensajes } = await cargarMensajes(conv.id)
      if (errorMensajes) {
        console.error('Error al cargar los mensajes:', errorMensajes)
        setMensajes([])
      } else {
        setMensajes(guardados || [])
      }

      setAsignatura(conv.asignatura || '')
      setCargando(false)
      refrescarLista()
    },
    [nivel, refrescarLista],
  )

  useEffect(() => {
    if (!perfil) return
    inicializar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfil?.id])

  async function abrirConversacion(conv) {
    if (pensando || conv.id === conversacion?.id) {
      setSidebarOpen(false)
      return
    }

    setCargando(true)
    setErrorChat('')
    setPensando(false)
    setConversacion(conv)
    setAsignatura(conv.asignatura || '')
    setSidebarOpen(false)

    const { data: guardados, error } = await cargarMensajes(conv.id)
    if (error) {
      console.error('Error al cargar los mensajes:', error)
      setMensajes([])
    } else {
      setMensajes(guardados || [])
    }
    setCargando(false)
  }

  async function eliminarConversacion(conv) {
    const titulo = conv.titulo || 'esta conversación'
    const confirmado = window.confirm(
      `¿Eliminar "${titulo}"? Se borrarán también sus mensajes y esta acción no se puede deshacer.`,
    )
    if (!confirmado) return

    const { error } = await eliminarConversacionDB(conv.id)
    if (error) {
      window.alert(`No pude eliminar la conversación: ${error}`)
      return
    }

    if (conversacion?.id === conv.id) {
      await inicializar(true)
    } else {
      await refrescarLista()
    }
  }

  async function enviar(texto) {
    const limpio = texto.trim()
    if (!limpio || pensando || !conversacion) return

    const idConv = conversacion.id

    // Título optimista en el sidebar (el servidor lo confirma).
    if (!conversacion.titulo) {
      setConversacion((actual) =>
        actual?.id === idConv ? { ...actual, titulo: limpio.slice(0, 40) } : actual,
      )
      setConversaciones((actual) =>
        actual.map((c) =>
          c.id === idConv && !c.titulo ? { ...c, titulo: limpio.slice(0, 40) } : c,
        ),
      )
    }

    setMensajes((actual) => [...actual, { id: siguienteId++, rol: 'user', texto: limpio }])
    setPensando(true)

    const respuesta = await tutorResponse(limpio, {
      conversacionId: idConv,
      curso,
      asignatura,
      nivel,
    })

    setMensajes((actual) => [
      ...actual,
      { id: siguienteId++, rol: 'tutor', texto: respuesta.text, acciones: respuesta.actions },
    ])
    setPensando(false)
    refrescarLista()
  }

  function nuevaConversacion() {
    setMensajes([])
    setPensando(false)
    setConversacion(null)
    setSidebarOpen(false)
    inicializar(true)
  }

  useEffect(() => {
    const el = finRef.current
    if (!el) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'end' })
  }, [mensajes, pensando, cargando])

  return (
    <div className="tutor-wrap">
      <div className="tutor-layout">
        <TutorSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNueva={nuevaConversacion}
          onSeleccionar={abrirConversacion}
          onEliminar={eliminarConversacion}
          conversaciones={conversaciones}
          activaId={conversacion?.id || null}
          cargando={cargandoLista}
          curso={curso}
          asignatura={asignatura}
          onAsignatura={setAsignatura}
        />

        <section className="tutor-chat" aria-label="Chat con el Tutor IA">
          <header className="tutor-chat-head">
            <button
              type="button"
              className="tutor-burger"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir historial de conversaciones"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <div className="tutor-chat-title">
              <span className="tutor-chat-avatar" aria-hidden="true">
                <IconBot />
              </span>
              <div>
                <h1>Tutor IA</h1>
                <p>{asignatura ? `Ayudando con ${asignatura}` : 'Tu tutor personal de estudio'}</p>
              </div>
            </div>

            <span className="tutor-chat-chip">{curso}</span>
          </header>

          <div className="tutor-messages">
            {errorChat ? (
              <div className="tutor-welcome">
                <h2>No pude abrir tu conversación</h2>
                <p>{errorChat}</p>
              </div>
            ) : cargando ? (
              <p className="tutor-note" role="status">
                Cargando tu conversación…
              </p>
            ) : vacio ? (
              <div className="tutor-welcome">
                <span className="tutor-welcome-icon" aria-hidden="true">
                  <IconBot />
                </span>
                <h2>Hola, ¿qué quieres aprender hoy?</h2>
                <p>
                  Puedo ayudarte a entender conceptos, resolver dudas y guiarte paso a paso en tus
                  ejercicios.
                </p>
                <div className="tutor-suggestions">
                  {SUGERENCIAS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="tutor-suggestion"
                      onClick={() => enviar(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className="tutor-note">Conectado con Gemini 2.5 Flash-Lite</p>
              </div>
            ) : (
              <>
                {mensajes.map((m) => (
                  <ChatMessage key={m.id} message={m} onAction={enviar} />
                ))}
                {pensando && (
                  <div className="tutor-msg tutor">
                    <span className="tutor-msg-avatar" aria-hidden="true">
                      <IconBot />
                    </span>
                    <div className="tutor-msg-body">
                      <span className="tutor-thinking" role="status" aria-label="Tutor IA está pensando">
                        Tutor IA está pensando
                        <span className="tutor-dot"></span>
                        <span className="tutor-dot"></span>
                        <span className="tutor-dot"></span>
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={finRef} />
          </div>

          <ChatInput onSend={enviar} disabled={pensando || cargando || !conversacion} />
        </section>
      </div>
    </div>
  )
}
