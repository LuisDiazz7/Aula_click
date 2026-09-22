import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getCursos, crearPerfilEstudiante, getUsuarioPorCorreo } from '../services/profileService'
import Loading from '../components/Loading'

export default function CrearPerfil() {
  const navigate = useNavigate()
  const { user, usuarioDb, cargarPerfil } = useAuth()

  const [cursos, setCursos] = useState([])
  const [nombre, setNombre] = useState('')
  const [idCurso, setIdCurso] = useState('')
  const [area, setArea] = useState('Científico Humanista')
  const [usuarioId, setUsuarioId] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [inicializando, setInicializando] = useState(true)

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const { data: cursosData } = await getCursos()
      setCursos(cursosData || [])

      let id = usuarioDb?.id
      if (!id) {
        const { data } = await getUsuarioPorCorreo(user.email)
        id = data?.id
      }
      setUsuarioId(id)
      setInicializando(false)
    })()
  }, [user, usuarioDb])

  if (inicializando) return <Loading text="Preparando tu perfil..." />
  if (!user || !usuarioId) {
    return (
      <div className="page">
        <p>Hubo un problema con tu sesión. Intenta <button className="btn btn-link" onClick={() => navigate('/login')}>iniciar sesión</button> nuevamente.</p>
      </div>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!nombre.trim()) return setError('Ingresa tu nombre.')
    if (!idCurso) return setError('Selecciona tu curso.')

    setCargando(true)
    const result = await crearPerfilEstudiante({
      idUsuario: usuarioId,
      nombre: nombre.trim(),
      idCurso: Number(idCurso),
      area,
    })

    if (result.error) {
      setError(result.error)
      setCargando(false)
      return
    }

    await cargarPerfil(usuarioId)
    navigate('/inicio', { replace: true })
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Crear tu perfil</h1>
        <p>Cuéntanos un poco sobre ti para personalizar tu experiencia.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-card profile-form">
        <div className="field">
          <label htmlFor="nombre">Nombre completo</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: María González Pérez"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="curso">Curso</label>
          <select
            id="curso"
            value={idCurso}
            onChange={(e) => setIdCurso(e.target.value)}
            required
          >
            <option value="">Selecciona tu curso</option>
            {cursos.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="area">Área / Mención</label>
          <select
            id="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
          >
            <option value="Científico Humanista">Científico Humanista</option>
            <option value="Técnico Profesional">Técnico Profesional</option>
          </select>
          <small>Define el plan de estudios que seguirás en la plataforma.</small>
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn btn-primary btn-block" disabled={cargando}>
          {cargando ? 'Guardando...' : 'Guardar perfil'}
        </button>
      </form>
    </div>
  )
}