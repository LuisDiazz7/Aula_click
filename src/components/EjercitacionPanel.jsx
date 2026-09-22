import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getEjerciciosDeTema, guardarResultado } from '../services/quizService'
import Loading from './Loading'
import { IconCheck, IconQuiz, IconX } from '../utils/icons'

const TOTAL_PREGUNTAS = 5

const LETRAS = ['A', 'B', 'C', 'D']

function formatoTiempo(segundos) {
  const m = Math.floor(segundos / 60)
  const s = segundos % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function QuestionView({ pregunta, indice, seleccion, onSeleccionar }) {
  const contestada = seleccion !== null

  function className(letter) {
    if (!contestada) return 'option'
    return seleccion === letter ? 'option selected' : 'option'
  }

  return (
    <div className="question">
      <div className="question-head">
        <span className="question-number">Pregunta {indice + 1}</span>
        <span className="question-stars">
          {'★'.repeat(indice + 1)}
          <span className="muted">{'★'.repeat(TOTAL_PREGUNTAS - indice - 1)}</span>
        </span>
      </div>
      <h3>{pregunta.enunciado}</h3>

      <div className="options">
        {LETRAS.map((letter) => (
          <button
            key={letter}
            type="button"
            className={className(letter)}
            onClick={() => onSeleccionar(letter)}
            disabled={contestada}
          >
            <span className="option-letter">{letter}</span>
            <span className="option-text">{pregunta[`alt_${letter.toLowerCase()}`]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ResultView({ respuestas, preguntas, puntaje, total, tiempoSegundos, onReintentar, onVolver }) {
  const correctas = respuestas.filter((r) => r !== null).reduce(
    (acc, r, i) => acc + (r === preguntas[i].respuesta_correcta ? 1 : 0),
    0,
  )

  return (
    <div className="quiz-result">
      <div className={`result-circle ${correctas === total ? 'perfect' : 'normal'}`}>
        <span className="result-number">{correctas}/{total}</span>
        <span className="result-label">correctas</span>
      </div>

      <h2>{puntaje} puntos</h2>
      <p className="result-message">
        {correctas === total
          ? '¡Perfecto! Dominas este tema. A seguir avanzando.'
          : correctas / total >= 0.6
            ? '¡Buen trabajo! Repasa los detalles que fallaste.'
            : 'Sigue practicando. Revisa el material y vuelve a intentarlo.'}
      </p>

      <div className="result-time">
        <strong>Tiempo utilizado:</strong> {formatoTiempo(tiempoSegundos)}
      </div>

      <div className="result-detail">
        {preguntas.map((p, i) => {
          const ok = respuestas[i] === p.respuesta_correcta
          return (
            <div key={p.id} className={`result-row ${ok ? 'ok' : 'bad'}`}>
              <span className="result-status">
                {ok ? <IconCheck /> : <IconX />}
              </span>
              <p>
                <strong>{i + 1}.</strong> {p.enunciado}
                {!ok && (
                  <small>
                    → La respuesta correcta era {p.respuesta_correcta}: {p[`alt_${p.respuesta_correcta.toLowerCase()}`]}
                  </small>
                )}
                {p.retroalimentacion && <small className="result-feedback">{p.retroalimentacion}</small>}
              </p>
            </div>
          )
        })}
      </div>

      <div className="quiz-actions">
        <button className="btn btn-secondary" onClick={onReintentar}>Reintentar</button>
        {onVolver && <button className="btn btn-primary" onClick={onVolver}>Volver al tema</button>}
      </div>
    </div>
  )
}

export default function EjercitacionPanel({ idTema, onVolver }) {
  const { usuarioDb } = useAuth()

  const [preguntas, setPreguntas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [fallo, setFallo] = useState('')

  const [etapa, setEtapa] = useState('inicio')
  const [indice, setIndice] = useState(0)
  const [respuestas, setRespuestas] = useState([])
  const [seleccion, setSeleccion] = useState(null)
  const [segundos, setSegundos] = useState(0)
  const [guardado, setGuardado] = useState(false)
  const [errorGuardado, setErrorGuardado] = useState('')

  const timerRef = useRef(null)

  const puntaje = useMemo(() => {
    const total = respuestas.filter((r) => r !== null).length
    if (total === 0) return 0
    const correctas = respuestas.slice(0, total).reduce(
      (acc, r, i) => acc + (r === preguntas[i]?.respuesta_correcta ? 1 : 0),
      0,
    )
    return Math.round((correctas / total) * 100)
  }, [respuestas, preguntas])

  const cargar = useCallback(async () => {
    setCargando(true)
    setFallo('')
    const { data, error } = await getEjerciciosDeTema(idTema)
    setEtapa('inicio')
    setSegundos(0)

    if (error) {
      setFallo(error)
      setCargando(false)
      return
    }

    const cinco = (data || []).slice(0, TOTAL_PREGUNTAS)
    if (cinco.length === 0) {
      setFallo('Este tema aún no tiene preguntas de ejercitación.')
      setCargando(false)
      return
    }

    setPreguntas(cinco)
    setCargando(false)
  }, [idTema])

  useEffect(() => { cargar() }, [cargar])

  useEffect(() => {
    if (etapa !== 'jugando') return
    timerRef.current = setInterval(() => setSegundos((s) => s + 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [etapa])

  function comenzar() {
    setSegundos(0)
    setIndice(0)
    setRespuestas(new Array(preguntas.length).fill(null))
    setSeleccion(null)
    setGuardado(false)
    setErrorGuardado('')
    setEtapa('jugando')
  }

  function seleccionarAlternativa(letter) {
    if (seleccion !== null) return
    setSeleccion(letter)
    setRespuestas((prev) => {
      const next = [...prev]
      next[indice] = letter
      return next
    })
  }

  async function siguiente() {
    const esUltima = indice === preguntas.length - 1
    if (!esUltima) {
      setIndice((i) => i + 1)
      setSeleccion(null)
      return
    }

    const tiempo = segundos
    setEtapa('resultado')

    if (!guardado && usuarioDb?.id) {
      const correctas = respuestas.reduce(
        (acc, r, i) => acc + (r === preguntas[i]?.respuesta_correcta ? 1 : 0),
        0,
      )
      const res = await guardarResultado({
        idUsuario: usuarioDb.id,
        idTema: Number(idTema),
        puntaje,
        correctas,
        total: preguntas.length,
        tiempoSegundos: tiempo,
      })
      if (res?.error) setErrorGuardado(res.error)
      else setGuardado(true)
    }
  }

  if (cargando) return <Loading text="Preparando tu evaluación..." />

  if (fallo) return <p className="empty-state">{fallo}</p>

  if (etapa === 'inicio') {
    return (
      <div className="quiz-start">
        <div className="quiz-entry-icon"><IconQuiz /></div>
        <div>
          <h3>Evaluación de {preguntas.length} preguntas</h3>
          <p>
            Responde las {preguntas.length} preguntas de este tema y al final conocerás tu
            puntaje, las respuestas correctas y el tiempo utilizado.
          </p>
        </div>
        <button className="btn btn-primary" onClick={comenzar}>Comenzar</button>
      </div>
    )
  }

  if (etapa === 'resultado') {
    return (
      <div className="quiz-result-wrap">
        {errorGuardado && <p className="form-error">{errorGuardado}</p>}
        <ResultView
          respuestas={respuestas}
          preguntas={preguntas}
          puntaje={puntaje}
          total={preguntas.length}
          tiempoSegundos={segundos}
          onReintentar={comenzar}
          onVolver={onVolver}
        />
      </div>
    )
  }

  return (
    <div className="quiz-card">
      <div className="quiz-toolbar">
        <span className="question-number">
          Pregunta {indice + 1} de {preguntas.length}
        </span>
        <span className="quiz-timer">⏱ {formatoTiempo(segundos)}</span>
      </div>
      <div className="quiz-progress">
        <div
          className="quiz-progress-bar"
          style={{ width: `${((indice + (seleccion !== null ? 1 : 0)) / preguntas.length) * 100}%` }}
        ></div>
      </div>
      <QuestionView
        pregunta={preguntas[indice]}
        indice={indice}
        seleccion={seleccion}
        onSeleccionar={seleccionarAlternativa}
      />
      <div className="quiz-nav">
        {seleccion !== null && (
          <button className="btn btn-primary" onClick={siguiente}>
            {indice === preguntas.length - 1 ? 'Ver resultado' : 'Siguiente →'}
          </button>
        )}
      </div>
    </div>
  )
}