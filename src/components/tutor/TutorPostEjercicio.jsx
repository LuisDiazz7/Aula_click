import { useEffect, useRef, useState } from 'react'
import { IconBot } from '../../utils/icons'
import { tutorResponse } from '../../services/tutorService'
import ChatMessage from './ChatMessage'

let siguienteId = 1

function armarContexto({ preguntas, respuestas, temaNombre }) {
  const fallos = []
  preguntas.forEach((p, i) => {
    const resp = respuestas[i]
    if (resp && resp !== p.respuesta_correcta) {
      fallos.push({
        numero: i + 1,
        enunciado: p.enunciado,
        tuRespuesta: resp,
        correcta: p.respuesta_correcta,
        alternativaTuya: p[`alt_${resp.toLowerCase()}`],
        alternativaCorrecta: p[`alt_${p.respuesta_correcta.toLowerCase()}`],
        retroalimentacion: p.retroalimentacion || '',
      })
    }
  })

  return { fallos, temaNombre }
}

function generarExplicacionLocal(fallo, temaNombre) {
  if (!fallo) return null
  const descartar = ['A', 'B', 'C', 'D'].filter((l) => l !== fallo.correcta)
  const lineasDescartar = descartar
    .map((l) => {
      const txt = fallo[`alt_${l.toLowerCase()}`] || ''
      if (!txt) return `- ${l}) descartar (no encaja con el enunciado)`
      return `- ${l}) "${txt}" — descartar, no responde lo que pide el ejercicio`
    })
    .join('\n')

  return `**Ejercicio ${fallo.numero} — ${temaNombre || 'Repaso'}**

**Enunciado**
${fallo.enunciado}

**Tu respuesta**
${fallo.tuRespuesta}) ${fallo.alternativaTuya || ''}

**¿Por qué era incorrecta?**
Mirando el enunciado, esa opción no cumple lo que se pide. Hay que ir descartando.

**Descartando opciones**
${lineasDescartar}

**Respuesta correcta**
**${fallo.correcta})** ${fallo.alternativaCorrecta || ''}

**Explicación paso a paso**
1) Leé bien qué te preguntan (no qué parece).
2) Buscá la clave en el enunciado que conecta con la opción correcta.
3) Compará con lo que elegiste: ¿Dónde se te fue la pista?

${fallo.retroalimentacion ? `**Dato del ejercicio:** ${fallo.retroalimentacion}\n\n` : ''}
**Ejercicio para confirmar que entendiste**
Imaginá una versión parecida: ¿Por qué descartaste las otras? Decime tu razonamiento y te ayudo a pulirlo.

**¿Con qué querés seguir?** Podés decirme otro número de ejercicio o "siguiente".`
}

export default function TutorPostEjercicio({ preguntas = [], respuestas = [], tema = null }) {
  const [abierto, setAbierto] = useState(false)
  const [mensajes, setMensajes] = useState([])
  const [pensando, setPensando] = useState(false)
  const [yaIniciado, setYaIniciado] = useState(false)
  const [modoRapido, setModoRapido] = useState(true)
  const finRef = useRef(null)

  const contexto = armarContexto({ preguntas, respuestas, temaNombre: tema?.nombre || '' })
  const hayFallos = contexto.fallos.length > 0

  useEffect(() => {
    const el = finRef.current
    if (!el) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'end' })
  }, [mensajes, pensando])

  function iniciar() {
    if (yaIniciado) {
      setAbierto(true)
      return
    }
    setYaIniciado(true)
    setAbierto(true)

    const textoInicial = hayFallos
      ? `Hola. Vi que fallaste **${contexto.fallos.length}** ejercicio${contexto.fallos.length === 1 ? '' : 's'}. Te ayudo uno por uno, paso a paso.\n\n**¿Con qué ejercicio querés empezar?** Elegí uno de los botones o decime el número.`
      : `Hola. No hubo fallos, pero te ayudo a repasar igual.\n\n**¿Qué ejercicio querés repasar?** Decime el número o el enunciado.`

    setMensajes([{ id: siguienteId++, rol: 'tutor', texto: textoInicial, acciones: [] }])
  }

  function explicarFalloLocal(num) {
    const fallo = contexto.fallos.find((f) => f.numero === Number(num))
    if (!fallo) return false
    const exp = generarExplicacionLocal(fallo, contexto.temaNombre)
    if (!exp) return false
    setMensajes((actual) => [...actual, { id: siguienteId++, rol: 'tutor', texto: exp, acciones: [] }])
    return true
  }

  async function enviar(texto) {
    const limpio = texto.trim()
    if (!limpio || pensando) return

    setMensajes((actual) => [...actual, { id: siguienteId++, rol: 'user', texto: limpio }])
    setPensando(true)

    const matchNum = limpio.match(/ejercicio\s*(\d+)/i) || limpio.match(/^(\d+)$/)
    if (matchNum && modoRapido) {
      const ok = explicarFalloLocal(matchNum[1])
      if (ok) {
        setPensando(false)
        return
      }
    }

    if (modoRapido && hayFallos) {
      const fallo = contexto.fallos[0]
      const exp = generarExplicacionLocal(fallo, contexto.temaNombre)
      if (exp && /empez|primer|ayuda/i.test(limpio)) {
        setMensajes((actual) => [...actual, { id: siguienteId++, rol: 'tutor', texto: exp, acciones: [] }])
        setPensando(false)
        return
      }
    }

    try {
      const contextoCompleto = `Repasar ejercitación post-resultado. Responder conciso y útil.
Tema: ${contexto.temaNombre || 'Sin tema'}
Errores:
${contexto.fallos
  .map((f) => `#${f.numero}: "${f.enunciado}" | tu=${f.tuRespuesta} (${f.alternativaTuya}) | ok=${f.correcta} (${f.alternativaCorrecta})`)
  .join('\n')}

Alumno: ${limpio}

Regla: Si pide un ejercicio por número, explicalo ÚNICAMENTE ese. Paso a paso, por qué descartar, por qué correcto, ejercicio similar corto. Preguntar si entendió.`

      const respuesta = await tutorResponse(contextoCompleto, { contextoPostEjercicio: contexto, modo: 'breve' })
      setMensajes((actual) => [...actual, { id: siguienteId++, rol: 'tutor', texto: respuesta.text, acciones: respuesta.actions || [] }])
    } catch (e) {
      setMensajes((actual) => [
        ...actual,
        { id: siguienteId++, rol: 'tutor', texto: 'Error al conectar. Probá con el botón del ejercicio que querés repasar.', acciones: [] },
      ])
    } finally {
      setPensando(false)
    }
  }

  function toggle() {
    if (!abierto) iniciar()
    else setAbierto(false)
  }

  return (
    <section className="tutor-post-quiz">
      <button type="button" className="tutor-post-quiz-toggle" onClick={toggle}>
        <span className="tutor-post-quiz-avatar">
          <IconBot />
        </span>
        <div className="tutor-post-quiz-text">
          <strong>¿No entendiste algún ejercicio?</strong>
          <span>
            {hayFallos
              ? `Te ayudo con ${contexto.fallos.length} que fallaste`
              : 'Te ayudo a repasar'}
          </span>
        </div>
        <span className={`tutor-post-quiz-chevron ${abierto ? 'open' : ''}`}>▾</span>
      </button>

      {abierto && (
        <div className="tutor-post-quiz-panel">
          {hayFallos && (
            <div className="tutor-post-quiz-fallos">
              <div className="tutor-post-quiz-chips">
                {contexto.fallos.map((f) => (
                  <button
                    key={f.numero}
                    type="button"
                    className="tutor-post-quiz-chip"
                    onClick={() => {
                      setMensajes((actual) => [...actual, { id: siguienteId++, rol: 'user', texto: `Explicame el ejercicio ${f.numero}` }])
                      const exp = generarExplicacionLocal(f, contexto.temaNombre)
                      if (exp) {
                        setTimeout(() => {
                          setMensajes((actual) => [...actual, { id: siguienteId++, rol: 'tutor', texto: exp, acciones: [] }])
                        }, 150)
                      } else {
                        enviar(`Explicame el ejercicio ${f.numero} paso a paso.`)
                      }
                    }}
                    disabled={pensando}
                  >
                    Ejercicio {f.numero}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="tutor-post-quiz-messages">
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
            <div ref={finRef} />
          </div>

          <div className="tutor-post-quiz-input">
            <input
              type="text"
              placeholder={hayFallos ? '¿Con qué ejercicio querés empezar?' : '¿Qué querés repasar?'}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = e.currentTarget.value
                  enviar(val)
                  e.currentTarget.value = ''
                }
              }}
              disabled={pensando}
            />
            <button
              type="button"
              disabled={pensando}
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling
                if (input?.value) {
                  enviar(input.value)
                  input.value = ''
                }
              }}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

