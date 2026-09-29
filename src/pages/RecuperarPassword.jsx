import { useState } from 'react'
import { Link } from 'react-router-dom'
import { resetPasswordForEmail } from '../services/authService'
import AuthShell from '../components/auth/AuthShell'
import AuthField from '../components/auth/AuthField'
import AuthAlert from '../components/auth/AuthAlert'
import AuthSubmit from '../components/auth/AuthSubmit'
import { IconMail, IconArrowLeft } from '../utils/icons'

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
    <AuthShell
      title="Recuperar contraseña"
      subtitle="Te enviaremos un enlace para restablecerla."
      footer={
        <Link className="auth-back" to="/login">
          <IconArrowLeft aria-hidden="true" />
          Volver a iniciar sesión
        </Link>
      }
    >
      {enviado ? (
        <AuthAlert tone="ok">
          Si el correo está registrado, te llegó un enlace para restablecer tu contraseña.
          Revisa tu bandeja de entrada (y también la carpeta de spam).
        </AuthAlert>
      ) : (
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

          <AuthAlert>{error}</AuthAlert>

          <AuthSubmit loading={cargando} loadingText="Enviando...">
            Enviar enlace
          </AuthSubmit>
        </form>
      )}
    </AuthShell>
  )
}
