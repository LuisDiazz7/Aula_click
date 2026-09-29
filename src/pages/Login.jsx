import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { signIn } from '../services/authService'
import AuthShell from '../components/auth/AuthShell'
import AuthField from '../components/auth/AuthField'
import AuthAlert from '../components/auth/AuthAlert'
import AuthSubmit from '../components/auth/AuthSubmit'
import { IconMail, IconLock } from '../utils/icons'

export default function Login() {
  const navigate = useNavigate()
  const { refrescarSesion } = useAuth()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setCargando(true)

    const result = await signIn(correo.trim(), contrasena)
    if (result.error) {
      setError(result.error)
      setCargando(false)
      return
    }

    await refrescarSesion()
    navigate('/inicio', { replace: true })
  }

  return (
    <AuthShell
      title="Bienvenido de nuevo"
      subtitle="Continúa aprendiendo donde lo dejaste."
      footer={
        <p className="auth-foot-alt">
          ¿No tienes una cuenta?{' '}
          <Link className="auth-link" to="/registro">
            Crear cuenta
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <AuthField
          id="correo"
          label="Correo electrónico"
          type="email"
          icon={IconMail}
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="estudiante@ejemplo.cl"
          autoComplete="email"
        />

        <AuthField
          id="contrasena"
          label="Contraseña"
          type="password"
          icon={IconLock}
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          placeholder="Tu contraseña"
          autoComplete="current-password"
        />

        <p className="auth-foot-right">
          <Link className="auth-link" to="/recuperar-password">
            ¿Olvidaste tu contraseña?
          </Link>
        </p>

        <AuthAlert>{error}</AuthAlert>

        <AuthSubmit loading={cargando} loadingText="Iniciando sesión...">
          Iniciar sesión
        </AuthSubmit>
      </form>
    </AuthShell>
  )
}
