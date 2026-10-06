import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../services/authService'
import AuthShell from '../components/auth/AuthShell'
import AuthField from '../components/auth/AuthField'
import AuthAlert from '../components/auth/AuthAlert'
import AuthSubmit from '../components/auth/AuthSubmit'
import { IconUser, IconMail, IconLock } from '../utils/icons'

export default function Registro() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [confirmacion, setConfirmacion] = useState('')
  const [aceptado, setAceptado] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  function validar() {
    if (!nombre.trim()) return 'Ingresa tu nombre.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) return 'Ingresa un correo válido.'
    if (contrasena.length < 6) return 'La contraseña debe tener al menos 6 caracteres.'
    if (contrasena !== confirmacion) return 'Las contraseñas no coinciden.'
    if (!aceptado) return 'Debes aceptar los Términos de Servicio y la Política de Privacidad.'
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
    <AuthShell
      title="Crea tu cuenta"
      subtitle="Empieza a aprender a tu ritmo con Aula Click."
      footer={
        <p className="auth-foot-alt">
          ¿Ya tienes cuenta?{' '}
          <Link className="auth-link" to="/login">
            Iniciar sesión
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <AuthField
          id="nombre"
          label="Nombre"
          icon={IconUser}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: María González"
          autoComplete="name"
        />

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
          placeholder="Repite tu contraseña"
          autoComplete="new-password"
        />

        <div className="auth-terms">
          <input
            id="terminos"
            type="checkbox"
            checked={aceptado}
            onChange={(e) => setAceptado(e.target.checked)}
            aria-labelledby="terminos-texto"
          />
          <span id="terminos-texto">
            <label htmlFor="terminos">Acepto los</label>{' '}
            <a href="/terminos">Términos de Servicio</a> y la{' '}
            <a href="/privacidad">Política de Privacidad</a> de Aula Click.
          </span>
        </div>

        <AuthAlert>{error}</AuthAlert>

        <AuthSubmit loading={cargando} loadingText="Creando cuenta...">
          Crear cuenta
        </AuthSubmit>
      </form>
    </AuthShell>
  )
}
