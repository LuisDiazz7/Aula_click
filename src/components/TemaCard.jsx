import { Link } from 'react-router-dom'
import { IconQuiz } from '../utils/icons'

export default function TemaCard({ tema }) {
  return (
    <div className="card theme-card">
      <div className="theme-icon">
        <IconQuiz />
      </div>
      <div className="theme-body">
        <h3>{tema.nombre}</h3>
        <p>Videos, material y ejercitación</p>
      </div>
      <Link to={`/tema/${tema.id}`} className="card-link">
        Estudiar →
      </Link>
    </div>
  )
}