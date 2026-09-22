import { useState } from 'react'
import { Link } from 'react-router-dom'
import { resetPasswordForEmail } from '../services/authService'

export default function RecuperarPassword() {
  const [correo, setCorreo] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setCargando(true)

    const result = await resetPasswordForEmail(correo.trim())
    if (result.error) {
      setError(result.error)
      setCargando(false)
      return
    }

    setEnviado(true)
    setCargando(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-logo">A</span>
          <h1>Recuperar contraseña</h1>
          <p>Te enviaremos un enlace para restablecerla</p>
        </div>

        {enviado ? (
          <div>
            <p className="form-ok">
              Si el correo está registrado, te llegó un enlace para restablecer tu
              contraseña. Revisa tu bandeja de entrada (y también la carpeta de spam).
            </p>
            <p className="auth-alt">
              <Link to="/login">Volver a iniciar sesión</Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field">
              <label htmlFor="correo">Correo electrónico</label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="estudiante@ejemplo.cl"
                required
                autoComplete="email"
              />
            </div>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="btn btn-primary btn-block" disabled={cargando}>
              {cargando ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>
        )}

        <p className="auth-alt">
          ¿Recordaste tu contraseña? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}