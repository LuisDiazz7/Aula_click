import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getTema } from '../services/contentService'
import EjercitacionPanel from '../components/EjercitacionPanel'
import Loading from '../components/Loading'

export default function Ejercitacion() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [tema, setTema] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    ;(async () => {
      const { data } = await getTema(id)
      setTema(data || null)
      setCargando(false)
    })()
  }, [id])

  if (cargando) return <Loading text="Preparando tu evaluación..." />

  return (
    <div className="page quiz-page">
      <nav className="breadcrumbs">
        <Link to="/asignaturas">Asignaturas</Link>
        <span>›</span>
        <Link to={`/rama/${tema?.ramas?.id}`}>Rama</Link>
        <span>›</span>
        <Link to={`/tema/${id}`}>Tema</Link>
        <span>›</span>
        <span>Ejercitación</span>
      </nav>

      <div className="page-header">
        <span className="page-eyebrow">{tema?.ramas?.nombre}</span>
        <h1>Ejercitación · {tema?.nombre}</h1>
        <p>Responde las preguntas y al final conocerás tu puntaje, las respuestas correctas y tu tiempo.</p>
      </div>

      <EjercitacionPanel idTema={id} onVolver={() => navigate(`/tema/${id}`)} />
    </div>
  )
}