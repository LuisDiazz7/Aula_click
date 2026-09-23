import { useEffect, useRef, useState } from 'react'
import { IconSend } from '../../utils/icons'

const ALTURA_MAXIMA = 150

export default function ChatInput({ onSend, disabled = false }) {
  const [texto, setTexto] = useState('')
  const ref = useRef(null)

  function ajustarAltura() {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, ALTURA_MAXIMA)}px`
  }

  useEffect(ajustarAltura, [texto])
  useEffect(() => {
    ref.current?.focus()
  }, [])

  function enviar() {
    const limpio = texto.trim()
    if (!limpio || disabled) return
    onSend(limpio)
    setTexto('')
    requestAnimationFrame(ajustarAltura)
  }

  function manejarTecla(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviar()
    }
  }

  return (
    <div className="tutor-input">
      <textarea
        ref={ref}
        className="tutor-textarea"
        rows={1}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={manejarTecla}
        placeholder="Pregúntale algo al Tutor IA..."
        aria-label="Pregúntale algo al Tutor IA..."
        disabled={disabled}
      />
      <button
        type="button"
        className="tutor-send"
        onClick={enviar}
        disabled={disabled || !texto.trim()}
        aria-label="Enviar mensaje al Tutor IA"
      >
        <IconSend aria-hidden="true" />
      </button>
    </div>
  )
}