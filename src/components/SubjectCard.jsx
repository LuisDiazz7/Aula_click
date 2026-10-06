import { Link } from 'react-router-dom'
import { iconMap, IconArrowRight } from '../utils/icons'

export default function SubjectCard({ asignatura, cursoNombre, progreso }) {
  const key = asignatura.nombre?.toLowerCase() || ''
  const Icon = iconMap[key] || null
  // Sin datos reales la asignatura parte en 0%, nunca en un valor de ejemplo.
  const pct = Number.isFinite(progreso) ? progreso : 0

  return (
    <div className="card subject-card" data-icon={key}>
      <div className="subject-card-top">
        <div className="subject-icon">{Icon ? <Icon /> : '✎'}</div>
        <div className="subject-body">
          <h3>{asignatura.nombre}</h3>
          {cursoNombre && <span className="subject-course">{cursoNombre}</span>}
        </div>
      </div>
      <p className="subject-desc">{asignatura.descripcion}</p>

      <div className="subject-progress">
        <div className="subject-progress-track">
          <div className="subject-progress-bar" style={{ '--p': `${pct}%` }}></div>
        </div>
        <span className="subject-progress-pct">{pct}%</span>
      </div>

      <Link to={`/asignatura/${asignatura.id}`} className="subject-cta">
        Continuar
        <IconArrowRight />
      </Link>
    </div>
  )
}