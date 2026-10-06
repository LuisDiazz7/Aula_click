import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { updatePassword, signOut, getSession } from '../services/authService'
import AuthShell from '../components/auth/AuthShell'
import AuthField from '../components/auth/AuthField'
import AuthAlert from '../components/auth/AuthAlert'
import AuthSubmit from '../components/auth/AuthSubmit'
import { IconLock } from '../utils/icons'

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
      <AuthShell
        title="Enlace no válido"
        subtitle="El enlace de recuperación no es válido o ya fue utilizado."
        footer={
          <Link className="auth-back" to="/recuperar-password">
            Solicitar un nuevo enlace
          </Link>
        }
      />
    )
  }

  return (
    <AuthShell
      title="Nueva contraseña"
      subtitle={`Elige una nueva contraseña para ${correo}.`}
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <AuthField
          id="contrasena"
          label="Nueva contraseña"
          type="password"
          icon={IconLock}
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          placeholder="Mínimo 6 caracteres"
          autoComplete="new-password"
        />

        <AuthField
          id="confirmacion"
          label="Repetir contraseña"
          type="password"
          icon={IconLock}
          value={confirmacion}
          onChange={(e) => setConfirmacion(e.target.value)}
          placeholder="Repite tu nueva contraseña"
          autoComplete="new-password"
        />

        <AuthAlert>{error}</AuthAlert>

        <AuthSubmit loading={cargando} loadingText="Guardando...">
          Guardar nueva contraseña
        </AuthSubmit>
      </form>
    </AuthShell>
  )
}
