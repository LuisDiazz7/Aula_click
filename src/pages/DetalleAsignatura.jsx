import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getRamasPorAsignatura, getAsignatura } from '../services/contentService'
import RamaCard from '../components/RamaCard'
import TemarioPaes from '../components/TemarioPaes'
import Loading from '../components/Loading'
import { iconMap } from '../utils/icons'

export default function DetalleAsignatura() {
  const { id } = useParams()
  const [ramas, setRamas] = useState([])
  const [asignatura, setAsignatura] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [fallo, setFallo] = useState('')

  useEffect(() => {
    ;(async () => {
      setCargando(true)
      setFallo('')
      const [{ data: ramasData, error }, { data: asig, error: errorAsig }] = await Promise.all([
        getRamasPorAsignatura(id),
        getAsignatura(id),
      ])
      if (error || errorAsig) {
        setFallo(error || errorAsig || 'No se pudo cargar la asignatura.')
        setCargando(false)
        return
      }
      setRamas(ramasData || [])
      setAsignatura(asig || null)
      setCargando(false)
    })()
  }, [id])

  if (cargando) return <Loading text="Cargando asignatura..." />

  if (fallo) {
    return (
      <div className="page">
        <div className="page-header"><h1>Asignatura</h1></div>
        <p className="empty-state">{fallo}</p>
      </div>
    )
  }

  const nombre = asignatura?.nombre || ''
  const Icon = nombre ? iconMap[nombre.toLowerCase()] : null
  const totalTemas = ramas.reduce((suma, r) => suma + (r.temas?.length ?? 0), 0)

  return (
    <div className="page">
      <nav className="breadcrumbs">
        <Link to="/asignaturas">Asignaturas</Link>
        <span>›</span>
        <span>{nombre}</span>
      </nav>

      <div className={`page-header asignatura-header has-${nombre.toLowerCase()}`}>
        <span className="page-eyebrow">Unidades y ramas</span>
        <h1>{nombre}</h1>
        <p>{asignatura?.descripcion}</p>
        {Icon && <div className="subject-icon lg"><Icon /></div>}
      </div>

      <section className="ramas" data-subject={nombre.toLowerCase()} aria-labelledby="ramas-titulo">
        <div className="ramas-head">
          <h2 id="ramas-titulo">Ramas de estudio</h2>
          {ramas.length > 0 && (
            <p>
              {ramas.length} rama{ramas.length === 1 ? '' : 's'} · {totalTemas} tema{totalTemas === 1 ? '' : 's'} para
              estudiar
            </p>
          )}
        </div>

        {ramas.length === 0 ? (
          <p className="empty-state">Esta asignatura aún no tiene ramas.</p>
        ) : (
          <div className="ramas-grid">
            {ramas.map((r, i) => (
              <RamaCard key={r.id} rama={r} indice={i} />
            ))}
          </div>
        )}
      </section>

      <TemarioPaes asignatura={nombre} />
    </div>
  )
}