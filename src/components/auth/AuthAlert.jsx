import { IconAlert, IconCheck } from '../../utils/icons'

export default function AuthAlert({ tone = 'error', children }) {
  if (!children) return null

  const Icon = tone === 'ok' ? IconCheck : IconAlert

  return (
    <p
      className={`auth-alert auth-alert--${tone}`}
      role={tone === 'ok' ? 'status' : 'alert'}
    >
      <Icon className="auth-alert-icon" aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}
