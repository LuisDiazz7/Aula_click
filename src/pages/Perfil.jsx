import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getCursos, actualizarPerfilEstudiante } from '../services/profileService'
import Loading from '../components/Loading'

export default function Perfil() {
  const navigate = useNavigate()
  const { user, usuarioDb, perfil, cargarPerfil } = useAuth()

  const [editando, setEditando] = useState(false)
  const [cursos, setCursos] = useState([])
  const [nombre, setNombre] = useState('')
  const [idCurso, setIdCurso] = useState('')
  const [area, setArea] = useState('Científico Humanista')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (!perfil) return
    setNombre(perfil.nombre)
    setIdCurso(String(perfil.id_curso))
    setArea(perfil.area || 'Científico Humanista')
    ;(async () => {
      const { data } = await getCursos()
      setCursos(data || [])
    })()
  }, [perfil])

  if (!perfil) return <Loading text="Cargando perfil..." />

  async function guardar(e) {
    e.preventDefault()
    setError('')
    if (!nombre.trim()) return setError('El nombre no puede estar vacío.')
    if (!idCurso) return setError('Selecciona un curso.')

    setGuardando(true)
    const result = await actualizarPerfilEstudiante(perfil.id, {
      nombre: nombre.trim(),
      idCurso: Number(idCurso),
      area,
    })

    if (result.error) {
      setError(result.error)
      setGuardando(false)
      return
    }

    await cargarPerfil(usuarioDb.id)
    setEditando(false)
    setGuardando(false)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Mi perfil</h1>
        <p>Revisa y actualiza los datos de tu cuenta de estudiante.</p>
      </div>

      <div className="profile-layout">
        <aside className="profile-avatar-card">
          <div className="avatar">
            {perfil.nombre.charAt(0).toUpperCase()}
          </div>
          <h2>{perfil.nombre}</h2>
          <p className="muted">{user?.email}</p>
          <span className="chip-chip">{perfil.cursos?.nombre}</span>
          <span className="chip-chip alt">{perfil.area}</span>
        </aside>

        <div className="profile-data">
          {!editando ? (
            <>
              <div className="info-row">
                <span>Nombre</span>
                <strong>{perfil.nombre}</strong>
              </div>
              <div className="info-row">
                <span>Curso</span>
                <strong>{perfil.cursos?.nombre}</strong>
              </div>
              <div className="info-row">
                <span>Área / Mención</span>
                <strong>{perfil.area}</strong>
              </div>
              <div className="info-row">
                <span>Correo</span>
                <strong>{user?.email}</strong>
              </div>
              <button className="btn btn-secondary" onClick={() => setEditando(true)}>
                Editar perfil
              </button>
            </>
          ) : (
            <form onSubmit={guardar} className="auth-card profile-form">
              <div className="field">
                <label htmlFor="nombre">Nombre completo</label>
                <input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="curso">Curso</label>
                <select id="curso" value={idCurso} onChange={(e) => setIdCurso(e.target.value)} required>
                  <option value="">Selecciona</option>
                  {cursos.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="area">Área / Mención</label>
                <select id="area" value={area} onChange={(e) => setArea(e.target.value)} required>
                  <option value="Científico Humanista">Científico Humanista</option>
                  <option value="Técnico Profesional">Técnico Profesional</option>
                </select>
              </div>
              {error && <p className="form-error">{error}</p>}
              <div className="btn-row">
                <button type="submit" className="btn btn-primary" disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setEditando(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          )}

          <div className="quick-nav">
            <button className="btn btn-ghost" onClick={() => navigate('/asignaturas')}>
              Ir a asignaturas →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}