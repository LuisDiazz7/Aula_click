import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getRama } from '../services/contentService'
import { getResumenPorTemas } from '../services/quizService'
import { useAuth } from '../hooks/useAuth'
import TemaCard from '../components/TemaCard'
import Loading from '../components/Loading'

const conteo = (relacion) => relacion?.[0]?.count ?? 0

export default function DetalleRama() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { usuarioDb } = useAuth()
  const [rama, setRama] = useState(null)
  const [progreso, setProgreso] = useState({})
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    ;(async () => {
      setCargando(true)
      const { data, error } = await getRama(id)
      if (error || !data) {
        navigate('/asignaturas', { replace: true })
        return
      }
      setRama(data)

      if (usuarioDb?.id) {
        const { data: resumen } = await getResumenPorTemas(usuarioDb.id, (data.temas || []).map((t) => t.id))
        setProgreso(resumen || {})
      }
      setCargando(false)
    })()
  }, [id, navigate, usuarioDb])

  if (cargando) return <Loading text="Cargando rama..." />

  const temas = rama.temas || []
  const asignatura = rama.asignaturas?.nombre || 'Asignatura'
  const totalVideos = temas.reduce((s, t) => s + conteo(t.videos), 0)
  const totalPreguntas = temas.reduce((s, t) => s + conteo(t.ejercicios), 0)
  const practicados = temas.filter((t) => progreso[t.id]?.intentos > 0).length
  const avance = temas.length ? Math.round((practicados / temas.length) * 100) : 0

  return (
    <div className="page rama-page" data-subject={asignatura.toLowerCase()}>
      <nav className="breadcrumbs">
        <Link to="/asignaturas">Asignaturas</Link>
        <span>›</span>
        <Link to={`/asignatura/${rama.id_asignatura}`}>{asignatura}</Link>
        <span>›</span>
        <span>{rama.nombre}</span>
      </nav>

      <header className="rama-hero">
        <span className="page-eyebrow">{asignatura} · Rama de estudio</span>
        <h1>{rama.nombre}</h1>
        <p>Elige un tema para ver sus videos, descargar el material en PDF y poner a prueba lo aprendido.</p>

        <dl className="rama-stats">
          <div><dt>Temas</dt><dd>{temas.length}</dd></div>
          <div><dt>Videos</dt><dd>{totalVideos}</dd></div>
          <div><dt>Preguntas</dt><dd>{totalPreguntas}</dd></div>
          <div><dt>Practicados</dt><dd>{practicados}/{temas.length}</dd></div>
        </dl>

        {temas.length > 0 && (
          <div className="rama-avance">
            <div className="rama-avance-barra" aria-hidden="true">
              <span style={{ width: `${avance}%` }} />
            </div>
            <small>{avance}% de los temas de esta rama practicados</small>
          </div>
        )}
      </header>

      <section aria-labelledby="temas-titulo">
        <div className="ramas-head">
          <h2 id="temas-titulo">Temas</h2>
          {temas.length > 0 && <p>Te recomendamos seguirlos en orden</p>}
        </div>

        {temas.length === 0 ? (
          <p className="empty-state">Esta rama aún no tiene temas disponibles.</p>
        ) : (
          <div className="temas-lista">
            {temas.map((t, i) => (
              <TemaCard key={t.id} tema={t} indice={i} progreso={progreso[t.id]} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
