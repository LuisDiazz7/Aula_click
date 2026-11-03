import { Link } from 'react-router-dom'
import { IconPlay, IconDoc, IconQuiz } from '../utils/icons'

const conteo = (relacion) => relacion?.[0]?.count ?? 0
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`

export default function TemaCard({ tema, indice, progreso }) {
  const videos = conteo(tema.videos)
  const pdfs = conteo(tema.pdfs)
  const preguntas = conteo(tema.ejercicios)
  const practicado = progreso?.intentos > 0

  return (
    <Link to={`/tema/${tema.id}`} className={`tema-card${practicado ? ' is-practicado' : ''}`}>
      <span className="tema-card-num" aria-hidden="true">{String(indice + 1).padStart(2, '0')}</span>

      <div className="tema-card-body">
        <h3>{tema.nombre}</h3>

        <ul className="tema-card-recursos" aria-label="Recursos del tema">
          <li><IconPlay /> {plural(videos, 'video', 'videos')}</li>
          <li><IconDoc /> {plural(pdfs, 'PDF', 'PDFs')}</li>
          <li><IconQuiz /> {plural(preguntas, 'pregunta', 'preguntas')}</li>
        </ul>

        {practicado ? (
          <div className="tema-card-progreso">
            <div className="tema-card-barra" aria-hidden="true">
              <span style={{ width: `${progreso.mejor}%` }} />
            </div>
            <small>
              Mejor puntaje <strong>{progreso.mejor}%</strong> · {plural(progreso.intentos, 'intento', 'intentos')}
            </small>
          </div>
        ) : (
          <small className="tema-card-estado">Aún no lo practicas</small>
        )}
      </div>

      <span className="tema-card-cta">
        {practicado ? 'Repasar' : 'Estudiar'} <span aria-hidden="true">→</span>
      </span>
    </Link>
  )
}
