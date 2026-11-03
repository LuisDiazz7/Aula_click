import { IconPlus, IconClock, IconTrash } from '../../utils/icons'

const ASIGNATURAS = ['Matemáticas', 'Lenguaje', 'Inglés', 'Ciencias', 'Historia']

export default function TutorSidebar({
  open,
  onClose,
  onNueva,
  onSeleccionar,
  onEliminar,
  conversaciones = [],
  activaId = null,
  cargando = false,
  curso,
  asignatura,
  onAsignatura,
}) {
  return (
    <>
      <div
        className={`tutor-backdrop ${open ? 'show' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <aside
        className={`tutor-side ${open ? 'open' : ''}`}
        aria-label="Historial de conversaciones del Tutor IA"
      >
        <button type="button" className="tutor-new" onClick={onNueva}>
          <IconPlus aria-hidden="true" />
          Nueva conversación
        </button>

        <div className="tutor-side-block tutor-side-history">
          <h2 className="tutor-side-title">Conversaciones</h2>
          {cargando && conversaciones.length === 0 ? (
            <p className="tutor-side-empty">Cargando…</p>
          ) : conversaciones.length === 0 ? (
            <p className="tutor-side-empty">Tus chats aparecerán aquí.</p>
          ) : (
            <ul className="tutor-history">
              {conversaciones.map((c) => {
                const titulo = c.titulo || 'Nueva conversación'
                const activa = c.id === activaId
                return (
                  <li
                    key={c.id}
                    className={`tutor-history-item ${activa ? 'active' : ''}`}
                  >
                    <button
                      type="button"
                      className="tutor-history-btn"
                      onClick={() => onSeleccionar(c)}
                      aria-current={activa ? 'true' : undefined}
                      title={titulo}
                    >
                      <IconClock aria-hidden="true" />
                      <span>{titulo}</span>
                    </button>
                    <button
                      type="button"
                      className="tutor-history-delete"
                      onClick={() => onEliminar(c)}
                      aria-label={`Eliminar conversación: ${titulo}`}
                      title="Eliminar conversación"
                    >
                      <IconTrash aria-hidden="true" />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="tutor-side-block tutor-side-context">
          <h2 className="tutor-side-title">Contexto de estudio</h2>
          <p className="tutor-context-row">
            <span>Curso</span>
            <strong>{curso}</strong>
          </p>
          <label htmlFor="tutor-asignatura" className="tutor-context-label">
            Asignatura
          </label>
          <select
            id="tutor-asignatura"
            className="tutor-context-select"
            value={asignatura}
            onChange={(e) => onAsignatura(e.target.value)}
          >
            <option value="">Selecciona una</option>
            {ASIGNATURAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <p className="tutor-context-note">
            Esta información se enviará automáticamente al Tutor IA para adaptar sus explicaciones.
          </p>
        </div>
      </aside>
    </>
  )
}
