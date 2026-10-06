import { useState } from 'react'
import { IconEye, IconEyeOff } from '../../utils/icons'

export default function AuthField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  icon: Icon,
  placeholder,
  autoComplete,
}) {
  const [visible, setVisible] = useState(false)
  const esPassword = type === 'password'
  const tipoVisible = esPassword && visible ? 'text' : type

  return (
    <div className="auth-field">
      <label className="auth-label" htmlFor={id}>
        {label}
      </label>

      <div className={`auth-control${esPassword ? ' auth-control--action' : ''}`}>
        {Icon && <Icon className="auth-control-icon" aria-hidden="true" />}

        <input
          id={id}
          className="auth-input"
          type={tipoVisible}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
        />

        {esPassword && (
          <button
            type="button"
            className="auth-eye"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-pressed={visible}
            title={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {visible ? <IconEyeOff /> : <IconEye />}
          </button>
        )}
      </div>
    </div>
  )
}
