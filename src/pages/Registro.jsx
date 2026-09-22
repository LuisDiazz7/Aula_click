import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../services/authService'

export default function Registro() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [confirmacion, setConfirmacion] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  function validar() {
    if (!nombre.trim()) return 'Ingresa tu nombre.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) return 'Ingresa un correo válido.'
    if (contrasena.length < 6) return 'La contraseña debe tener al menos 6 caracteres.'
    if (contrasena !== confirmacion) return 'Las contraseñas no coinciden.'
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const msg = validar()
    setError(msg)
    if (msg) return

    setCargando(true)
    const result = await signUp(correo.trim(), contrasena)
    if (result.error) {
      setError(result.error)
      setCargando(false)
      return
    }
    if (result.requiereConfirmacion) {
      setError(
        'Cuenta creada. Revisa tu correo para confirmar tu cuenta y luego inicia sesión.'
      )
      setCargando(false)
      return
    }
    navigate('/crear-perfil', { replace: true })
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-logo">A</span>
          <h1>Crear cuenta</h1>
          <p>Únete a Aula Click y estudia a tu ritmo</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: María González"
              required
            />
          </div>

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

          <div className="field">
            <label htmlFor="contrasena">Contraseña</label>
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
              placeholder="Repite tu contraseña"
              required
              autoComplete="new-password"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={cargando}>
            {cargando ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>

        <p className="auth-alt">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}