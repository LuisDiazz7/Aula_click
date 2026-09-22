import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { updatePassword, signOut, getSession } from '../services/authService'

export default function RestablecerPassword() {
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [lista, setLista] = useState(false)
  const [contrasena, setContrasena] = useState('')
  const [confirmacion, setConfirmacion] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    ;(async () => {
      const session = await getSession()
      if (session?.user) {
        setCorreo(session.user.email)
        setLista(true)
      }
    })()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (contrasena.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.')
    if (contrasena !== confirmacion) return setError('Las contraseñas no coinciden.')

    setCargando(true)
    const result = await updatePassword(contrasena)
    if (result.error) {
      setError(result.error)
      setCargando(false)
      return
    }

    await signOut()
    navigate('/login', { replace: true })
  }

  if (!lista) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-brand">
            <span className="brand-logo">A</span>
            <h1>Restablecer contraseña</h1>
            <p>El enlace de recuperación no es válido o ya fue utilizado.</p>
          </div>
          <p className="auth-alt">
            <Link to="/recuperar-password">Solicitar un nuevo enlace</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-logo">A</span>
          <h1>Nueva contraseña</h1>
          <p>Para {correo}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label htmlFor="contrasena">Nueva contraseña</label>
            <input
              id="contrasena"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              autoComplete="new-password"
            />
          </div>

          <div className="field">
            <label htmlFor="confirmacion">Repetir contraseña</label>
            <input
              id="confirmacion"
              type="password"
              value={confirmacion}
              onChange={(e) => setConfirmacion(e.target.value)}
              placeholder="Repite tu nueva contraseña"
              required
              autoComplete="new-password"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={cargando}>
            {cargando ? 'Guardando...' : 'Guardar nueva contraseña'}
          </button>
        </form>
      </div>
    </div>
  )
}