import { IconPlus, IconClock } from '../../utils/icons'

const CONVERSACIONES_MOCK = [
  'Funciones cuadráticas',
  'Distribución normal',
  'Revolución Industrial',
]

const ASIGNATURAS = ['Matemáticas', 'Lenguaje', 'Inglés', 'Ciencias', 'Historia']

export default function TutorSidebar({ open, onClose, onNueva, curso, asignatura, onAsignatura }) {
  return (
    <>
      <div
        className={`tutor-backdrop ${open ? 'show' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <aside className={`tutor-side ${open ? 'open' : ''}`} aria-label="Historial de conversaciones del Tutor IA">
        <button type="button" className="tutor-new" onClick={onNueva}>
          <IconPlus aria-hidden="true" />
          Nueva conversación
        </button>

        <div className="tutor-side-block">
          <h2 className="tutor-side-title">Conversaciones</h2>
          <ul className="tutor-history">
            {CONVERSACIONES_MOCK.map((c) => (
              <li key={c} className="tutor-history-item" title="Próximamente">
                <IconClock aria-hidden="true" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
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
            Esta información se enviará automáticamente al Tutor IA cuando conectemos Gemini.
          </p>
        </div>
      </aside>
    </>
  )
}