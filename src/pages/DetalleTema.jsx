import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTema } from '../services/contentService'
import { getHistorialRespuestas } from '../services/quizService'
import { useAuth } from '../hooks/useAuth'
import Loading from '../components/Loading'
import EjercitacionPanel from '../components/EjercitacionPanel'
import { IconDoc, IconPlay, IconQuiz, IconCheck } from '../utils/icons'

function VideoCard({ video }) {
  const idYoutube = video.id_youtube
  const esEmbed = /youtube\.com\/embed|youtu\.be|(?:=|%3F)v=/.test(video.url || '')

  if (idYoutube) {
    return (
      <div className="resource-card">
        <a
          className="resource-thumb video-thumb video-thumb-img"
          href={`https://www.youtube.com/watch?v=${idYoutube}`}
          target="_blank"
          rel="noreferrer"
          aria-label={`Ver ${video.titulo}`}
        >
          <img
            src={`https://img.youtube.com/vi/${idYoutube}/hqdefault.jpg`}
            alt={video.titulo}
            loading="lazy"
          />
          <span className="video-play"><IconPlay /></span>
        </a>
        <div className="resource-body">
          <h4>{video.titulo}</h4>
          {video.canal && <p className="video-channel">{video.canal}</p>}
          {video.descripcion && <p>{video.descripcion}</p>}
          <a
            className="btn-link"
            href={`https://www.youtube.com/watch?v=${idYoutube}`}
            target="_blank"
            rel="noreferrer"
          >
            Ver en YouTube →
          </a>
        </div>
      </div>
    )
  }

  const url = esEmbed ? video.url : null
  return (
    <div className="resource-card">
      <div className="resource-thumb video-thumb">
        {url ? (
          <iframe
            src={url}
            title={video.titulo}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          ></iframe>
        ) : (
          <a href={video.url} target="_blank" rel="noreferrer">
            <IconPlay /> Ver video
          </a>
        )}
      </div>
      <div className="resource-body">
        <h4>{video.titulo}</h4>
        {video.descripcion && <p>{video.descripcion}</p>}
        <a className="btn-link" href={video.url} target="_blank" rel="noreferrer">
          Abrir recurso →
        </a>
      </div>
    </div>
  )
}

function PdfCard({ pdf }) {
  return (
    <div className="resource-card pdf-resource">
      <div className="resource-thumb pdf-thumb">
        <IconDoc />
      </div>
      <div className="resource-body">
        <h4>{pdf.titulo}</h4>
        {pdf.descripcion && <p>{pdf.descripcion}</p>}
        <a className="btn btn-secondary btn-sm" href={pdf.url} target="_blank" rel="noreferrer">
          Abrir PDF ↗
        </a>
      </div>
    </div>
  )
}

const PESTANAS = [
  { id: 'videos', label: 'Videos explicativos', Icon: IconPlay },
  { id: 'material', label: 'Material (PDFs)', Icon: IconDoc },
  { id: 'ejercitacion', label: 'Ejercitación', Icon: IconQuiz },
]

export default function DetalleTema() {
  const { id } = useParams()
  const { usuarioDb } = useAuth()
  const [tema, setTema] = useState(null)
  const [historial, setHistorial] = useState([])
  const [pestana, setPestana] = useState('videos')
  const [cargando, setCargando] = useState(true)
  const [fallo, setFallo] = useState('')

  useEffect(() => {
    ;(async () => {
      setCargando(true)
      setFallo('')
      const { data, error } = await getTema(id)
      if (error || !data) {
        setFallo(error || 'No se pudo cargar este tema.')
        setCargando(false)
        return
      }
      setTema(data)

      if (usuarioDb?.id) {
        const { data: hist } = await getHistorialRespuestas(usuarioDb.id, id)
        setHistorial(hist || [])
      }
      setCargando(false)
    })()
  }, [id, usuarioDb])

  if (cargando) return <Loading text="Cargando tema..." />

  if (fallo) {
    return (
      <div className="page">
        <div className="page-header"><h1>Tema</h1></div>
        <p className="empty-state">{fallo}</p>
      </div>
    )
  }

  const rama = tema?.ramas
  const totalEjercicios = tema?.ejercicios?.length ?? 0
  const mejorResultado = historial[0]

  return (
    <div className="page">
      <nav className="breadcrumbs">
        <Link to="/asignaturas">Asignaturas</Link>
        <span>›</span>
        <Link to={`/asignatura/${rama?.id_asignatura}`}>Asignatura</Link>
        <span>›</span>
        <Link to={`/rama/${rama?.id}`}>Rama</Link>
        <span>›</span>
        <span>{tema?.nombre}</span>
      </nav>

      <div className="page-header tema-header">
        <span className="page-eyebrow">{rama?.nombre}</span>
        <h1>{tema?.nombre}</h1>
        <p>Videos, material de estudio y ejercitación para dominar este tema.</p>
      </div>

      {mejorResultado && (
        <div className="result-banner">
          <IconCheck />
          <div>
            <strong>Tu último resultado:</strong>{' '}
            {mejorResultado.respuestas_correctas} de {mejorResultado.total_preguntas} correctas (
            {mejorResultado.puntaje} pts)
            {mejorResultado.tiempo_segundos != null && (
              <> · {Math.floor(mejorResultado.tiempo_segundos / 60)}:{String(mejorResultado.tiempo_segundos % 60).padStart(2, '0')} min</>
            )}
          </div>
        </div>
      )}

      <section className="section">
        <div className="tabs" role="tablist" aria-label="Secciones del tema">
          {PESTANAS.map(({ id: pest, label, Icon }) => (
            <button
              key={pest}
              type="button"
              role="tab"
              aria-selected={pestana === pest}
              className={`tabs-btn ${pestana === pest ? 'active' : ''}`}
              onClick={() => setPestana(pest)}
            >
              <Icon />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </section>

      {pestana === 'videos' && (
        <section className="section">
          <div className="section-head">
            <h2>🎬 Videos educativos</h2>
          </div>
          {tema?.videos?.length === 0 ? (
            <p className="empty-state">Este tema aún no tiene videos.</p>
          ) : (
            <div className="grid grid-2">
              {tema?.videos?.map((v) => <VideoCard key={v.id} video={v} />)}
            </div>
          )}
        </section>
      )}

      {pestana === 'material' && (
        <section className="section">
          <div className="section-head">
            <h2>📄 Material de estudio</h2>
          </div>
          {tema?.pdfs?.length === 0 ? (
            <p className="empty-state">Este tema aún no tiene material descargable.</p>
          ) : (
            <div className="grid grid-2">
              {tema?.pdfs?.map((p) => <PdfCard key={p.id} pdf={p} />)}
            </div>
          )}
        </section>
      )}

      {pestana === 'ejercitacion' && (
        <section className="section">
          <div className="section-head">
            <h2>✏️ Ejercitación</h2>
          </div>
          {totalEjercicios === 0 ? (
            <p className="empty-state">Este tema aún no tiene preguntas de ejercitación.</p>
          ) : (
            <EjercitacionPanel idTema={id} onVolver={() => setPestana('videos')} />
          )}
        </section>
      )}
    </div>
  )
}