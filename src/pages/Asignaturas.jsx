import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getAsignaturasPorCurso } from '../services/contentService'
import SubjectCard from '../components/SubjectCard'
import Loading from '../components/Loading'

export default function Asignaturas() {
  const { perfil } = useAuth()
  const [asignaturas, setAsignaturas] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!perfil?.id_curso) {
      setCargando(false)
      return
    }
    ;(async () => {
      const { data } = await getAsignaturasPorCurso(perfil.id_curso)
      setAsignaturas(data || [])
      setCargando(false)
    })()
  }, [perfil])

  if (cargando) return <Loading text="Cargando asignaturas..." />

  return (
    <div className="page">
      <div className="page-header">
        <span className="page-eyebrow">{perfil?.cursos?.nombre}</span>
        <h1>Mis asignaturas</h1>
        <p>Selecciona una asignatura para ver sus unidades y ramas.</p>
      </div>

      {asignaturas.length === 0 ? (
        <p className="empty-state">No hay asignaturas disponibles para tu curso.</p>
      ) : (
        <div className="grid">
          {asignaturas.map((a) => (
            <SubjectCard key={a.id} asignatura={a} cursoNombre={perfil?.cursos?.nombre} />
          ))}
        </div>
      )}
    </div>
  )
}