import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { IconBot } from '../utils/icons'
import { mockTutorResponse } from '../services/mockTutor'
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
  const [pensando, setPensando] = useState(false)
  const [asignatura, setAsignatura] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const finRef = useRef(null)

  const curso = perfil?.cursos?.nombre || 'Sin curso'
  const vacio = mensajes.length === 0 && !pensando

  async function enviar(texto) {
    const limpio = texto.trim()
    if (!limpio || pensando) return

    setMensajes((actual) => [...actual, { id: siguienteId++, rol: 'user', texto: limpio }])
    setPensando(true)

    // MOCK: respuesta simulada. Se reemplazará por Gemini desde mockTutor.js
    const respuesta = await mockTutorResponse(limpio, { curso, asignatura })

    setMensajes((actual) => [
      ...actual,
      { id: siguienteId++, rol: 'tutor', texto: respuesta.text, acciones: respuesta.actions },
    ])
    setPensando(false)
  }

  function nuevaConversacion() {
    setMensajes([])
    setPensando(false)
    setSidebarOpen(false)
  }

  useEffect(() => {
    const el = finRef.current
    if (!el) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'end' })
  }, [mensajes, pensando])

  return (
    <div className="tutor-wrap">
      <div className="tutor-layout">
        <TutorSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNueva={nuevaConversacion}
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
            {vacio ? (
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
                <p className="tutor-note">Respuestas simuladas temporalmente · Pronto conectaremos Gemini</p>
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

          <ChatInput onSend={enviar} disabled={pensando} />
        </section>
      </div>
    </div>
  )
}