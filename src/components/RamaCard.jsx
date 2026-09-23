import { Link } from 'react-router-dom'

export default function RamaCard({ rama }) {
  const totalTemas = rama.temas?.length ?? 0

  return (
    <div className="card group-card">
      <div className="group-head">
        <span className="group-badge">{totalTemas}</span>
        <h3>{rama.nombre}</h3>
      </div>
      <p className="group-sub">
        {totalTemas > 0
          ? `${totalTemas} tema${totalTemas === 1 ? '' : 's'} para estudiar`
          : 'Sin temas por ahora'}
      </p>
      <Link to={`/rama/${rama.id}`} className="card-link">
        Ver temas →
      </Link>
    </div>
  )
}