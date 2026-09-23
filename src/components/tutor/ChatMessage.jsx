import QuickActions from './QuickActions'
import { IconBot } from '../../utils/icons'

export default function ChatMessage({ message, onAction }) {
  const esUsuario = message.rol === 'user'

  return (
    <div className={`tutor-msg ${esUsuario ? 'user' : 'tutor'}`}>
      {!esUsuario && (
        <span className="tutor-msg-avatar" aria-hidden="true">
          <IconBot />
        </span>
      )}
      <div className="tutor-msg-body">
        <p className="tutor-msg-text">{message.texto}</p>
        {!esUsuario && message.acciones?.length > 0 && (
          <QuickActions actions={message.acciones} onAction={onAction} />
        )}
      </div>
    </div>
  )
}