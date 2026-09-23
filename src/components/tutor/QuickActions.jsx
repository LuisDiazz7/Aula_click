export default function QuickActions({ actions = [], onAction }) {
  if (!actions.length) return null

  return (
    <div className="tutor-actions" role="group" aria-label="Acciones sugeridas del Tutor IA">
      {actions.map((accion) => (
        <button
          key={accion}
          type="button"
          className="tutor-action"
          onClick={() => onAction(accion)}
        >
          {accion}
        </button>
      ))}
    </div>
  )
}