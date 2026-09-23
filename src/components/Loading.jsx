export default function Loading({ text = 'Cargando...' }) {
  return (
    <div className="loading">
      <div className="spinner" aria-hidden="true"></div>
      <p>{text}</p>
    </div>
  )
}