import { Link } from 'react-router-dom'

const TEMAS_VISIBLES = 3

export default function RamaCard({ rama, indice }) {
  const temas = rama.temas ?? []
  const totalTemas = temas.length
  const restantes = totalTemas - TEMAS_VISIBLES

  return (
    <Link to={`/rama/${rama.id}`} className="rama-card">
      <div className="rama-card-head">
        <span className="rama-card-num">{String(indice + 1).padStart(2, '0')}</span>
        <span className="rama-card-count">
          {totalTemas} tema{totalTemas === 1 ? '' : 's'}
        </span>
      </div>

      <h3>{rama.nombre}</h3>

      {totalTemas > 0 ? (
        <ul className="rama-card-temas">
          {temas.slice(0, TEMAS_VISIBLES).map((t) => (
            <li key={t.id}>{t.nombre}</li>
          ))}
          {restantes > 0 && <li className="rama-card-mas">y {restantes} más</li>}
        </ul>
      ) : (
        <p className="rama-card-vacia">Sin temas por ahora</p>
      )}

      <span className="rama-card-link">
        Ver temas <span aria-hidden="true">→</span>
      </span>
    </Link>
  )
}
