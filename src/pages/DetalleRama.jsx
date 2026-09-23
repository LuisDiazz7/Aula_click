import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getRama } from '../services/contentService'
import TemaCard from '../components/TemaCard'
import Loading from '../components/Loading'

export default function DetalleRama() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [rama, setRama] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    ;(async () => {
      const { data, error } = await getRama(id)
      if (error || !data) {
        navigate('/asignaturas', { replace: true })
        return
      }
      setRama(data)
      setCargando(false)
    })()
  }, [id, navigate])

  if (cargando) return <Loading text="Cargando rama..." />

  return (
    <div className="page">
      <nav className="breadcrumbs">
        <Link to="/asignaturas">Asignaturas</Link>
        <span>›</span>
        <Link to={`/asignatura/${rama.id_asignatura}`}>Asignatura</Link>
        <span>›</span>
        <span>{rama.nombre}</span>
      </nav>

      <div className="page-header">
        <span className="page-eyebrow">Rama de estudio</span>
        <h1>{rama.nombre}</h1>
        <p>Elige un tema para ver videos, material de estudio y ejercitación.</p>
      </div>

      {rama.temas?.length === 0 ? (
        <p className="empty-state">Esta rama aún no tiene temas disponibles.</p>
      ) : (
        <div className="grid">
          {rama.temas?.map((t) => (
            <TemaCard key={t.id} tema={t} />
          ))}
        </div>
      )}
    </div>
  )
}