import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getAsignaturasPorCurso } from '../services/contentService'
import { getConteoResultados, getUltimaActividad } from '../services/quizService'
import SubjectCard from '../components/SubjectCard'
import Reveal from '../components/Reveal'
import Loading from '../components/Loading'
import {
  iconMap,
  IconArrowRight,
  IconBell,
  IconCheck,
  IconDoc,
  IconGauge,
  IconLayout,
  IconPen,
  IconPlay,
  IconSpark,
} from '../utils/icons'
import { CONTINUA_MOCK, PROGRESO_GENERAL_MOCK } from '../data/progresoMock'

function HeroArt() {
  return (
    <div className="hero-art" aria-hidden="true">
      <span className="hero-art-blob hero-art-blob-1"></span>
      <span className="hero-art-blob hero-art-blob-2"></span>
      <IconSpark className="hero-art-spark hero-art-spark-1" />
      <IconSpark className="hero-art-spark hero-art-spark-2" />
      <IconSpark className="hero-art-spark hero-art-spark-3" />

      <div className="hero-art-card hero-art-main">
        <div className="hero-art-main-head">
          <span className="hero-art-seal">A</span>
          <span className="hero-art-heading">Hoy toca aprender</span>
        </div>
        <div className="hero-art-ring">
          <svg viewBox="0 0 120 120">
            <circle className="hero-art-ring-bg" cx="60" cy="60" r="52" />
            <circle
              className="hero-art-ring-fg"
              cx="60"
              cy="60"
              r="52"
              pathLength="100"
              strokeDasharray={`${PROGRESO_GENERAL_MOCK} 100`}
            />
          </svg>
          <span className="hero-art-ring-label">
            <strong>{PROGRESO_GENERAL_MOCK}%</strong>
            <small>de tu meta</small>
          </span>
        </div>
        <div className="hero-art-foot">
          <div className="mini-tag">⚛ Álgebra</div>
          <div className="mini-tag strong">+120 pts</div>
        </div>
      </div>

      <div className="hero-art-card hero-art-doc">
        <span className="hero-art-mini-icon"><IconDoc /></span>
        <div>
          <strong>Guías de estudio</strong>
          <small>material por tema</small>
        </div>
      </div>

      <div className="hero-art-chart">
        <span className="hero-art-chart-bar" style={{ height: '48%' }}></span>
        <span className="hero-art-chart-bar" style={{ height: '70%' }}></span>
        <span className="hero-art-chart-bar" style={{ height: '58%' }}></span>
        <span className="hero-art-chart-bar" style={{ height: '88%' }}></span>
        <span className="hero-art-chart-bar" style={{ height: '74%' }}></span>
      </div>

      <div className="hero-art-check">
        <IconCheck />
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, value, label, accent = 'purple', bar }) {
  return (
    <div className={`stat-card stat-${accent}`}>
      <span className="stat-card-icon"><Icon /></span>
      <div className="stat-card-info">
        <strong className="stat-card-value">{value}</strong>
        <span className="stat-card-label">{label}</span>
        {bar != null && (
          <span className="stat-card-track" aria-hidden="true">
            <span className="stat-card-fill" style={{ '--p': `${bar}%` }}></span>
          </span>
        )}
      </div>
    </div>
  )
}

function ContinueCard({ asignatura, rama, tema, descripcion, link, puntaje }) {
  const key = asignatura?.toLowerCase() || 'matemática'
  const Icon = iconMap?.[key] || null

  return (
    <div className="continue-card-feature" data-icon={key}>
      <div className="continue-card-icon">{Icon ? <Icon /> : <IconPlay />}</div>
      <div className="continue-card-body">
        <span className="page-eyebrow">{rama} · {asignatura}</span>
        <h3>{tema}</h3>
        <p>{descripcion}</p>
        {puntaje != null && (
          <span className="continue-card-chip">
            Último intento · {puntaje} pts
          </span>
        )}
      </div>
      <Link to={link} className="btn btn-primary continue-card-btn">
        Continuar
        <IconArrowRight />
      </Link>
    </div>
  )
}

export default function Home() {
  const { perfil, usuarioDb } = useAuth()
  const [asignaturas, setAsignaturas] = useState([])
  const [ultimaActividad, setUltimaActividad] = useState(null)
  const [conteo, setConteo] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!perfil?.id_curso) return
    ;(async () => {
      const [{ data }, { data: actividad }, { count }] = await Promise.all([
        getAsignaturasPorCurso(perfil.id_curso),
        usuarioDb?.id ? getUltimaActividad(usuarioDb.id) : Promise.resolve({ data: null }),
        usuarioDb?.id ? getConteoResultados(usuarioDb.id) : Promise.resolve({ count: null }),
      ])
      setAsignaturas(data || [])
      setUltimaActividad(actividad || null)
      setConteo(count)
      setCargando(false)
    })()
  }, [perfil, usuarioDb])

  const nombre = perfil?.nombre?.split(' ')[0] || 'Estudiante'
  const curso = perfil?.cursos?.nombre || ''
  const area = perfil?.area || ''

  const ultimoTema = ultimaActividad?.temas
  const continua = ultimoTema
    ? {
        asignatura: asignaturas.find((a) => a.id === ultimoTema.ramas?.id_asignatura)?.nombre,
        rama: ultimoTema.ramas?.nombre,
        tema: ultimoTema.nombre,
        link: `/tema/${ultimoTema.id}`,
        puntaje: ultimaActividad.puntaje,
      }
    : CONTINUA_MOCK
  const descripcion = ultimoTema ? '' : CONTINUA_MOCK.descripcion

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero-grid">
          <div className="home-hero-copy">
            <span className="home-hero-chip">Hola, {nombre} 👋</span>
            <h1>¿Qué quieres <span className="home-hero-accent">aprender</span> hoy?</h1>
            <p>Continúa donde quedaste y sigue avanzando.</p>

            <div className="home-hero-actions">
              <Link to={continua.link} className="btn btn-primary">
                Continuar estudiando
                <IconArrowRight />
              </Link>
              <Link to="/asignaturas" className="btn btn-ghost">
                Ver asignaturas
              </Link>
            </div>

            <p className="home-hero-extra">
              {curso}
              {area ? ` · ${area}` : ''}
            </p>
          </div>

          <HeroArt />
        </div>
      </section>

      <div className="home-body">
        <Reveal variant="up">
          <section className="home-section">
            <div className="section-head">
              <h2>Tu progreso</h2>
              <Link to="/perfil" className="btn-link">Ver mi perfil →</Link>
            </div>
            <div className="stats-grid">
              <StatCard
                icon={IconLayout}
                value={asignaturas.length}
                label="Asignaturas activas"
                accent="purple"
              />
              <StatCard
                icon={IconPen}
                value={conteo ?? 0}
                label="Ejercicios completados"
                accent="amber"
              />
              <StatCard
                icon={IconGauge}
                value={`${PROGRESO_GENERAL_MOCK}%`}
                label="Progreso general"
                accent="green"
                bar={PROGRESO_GENERAL_MOCK}
              />
            </div>
          </section>
        </Reveal>

        <Reveal variant="up" delay={80}>
          <section className="home-section">
            <div className="section-head">
              <h2>Mis asignaturas</h2>
              <Link to="/asignaturas" className="btn-link">Ver todas →</Link>
            </div>

            {cargando ? (
              <Loading text="Cargando asignaturas..." />
            ) : asignaturas.length === 0 ? (
              <p className="empty-state">No hay asignaturas disponibles para tu curso.</p>
            ) : (
              <div className="grid subjects-grid">
                {asignaturas.map((a, i) => (
                  <Reveal key={a.id} variant="up" delay={i * 70} className="subject-reveal">
                    <SubjectCard asignatura={a} />
                  </Reveal>
                ))}
              </div>
            )}
          </section>
        </Reveal>

        <Reveal variant="up" delay={100}>
          <section className="home-section">
            <div className="section-head">
              <h2>Continúa estudiando</h2>
            </div>
            <ContinueCard
              asignatura={continua.asignatura}
              rama={continua.rama}
              tema={continua.tema}
              descripcion={descripcion || 'Continúa desde donde quedaste.'}
              link={continua.link}
              puntaje={continua.puntaje}
            />
          </section>
        </Reveal>

        <Reveal variant="up" delay={120}>
          <section className="home-section">
            <div className="section-head">
              <h2>Accesos rápidos</h2>
            </div>
            <div className="quick-grid">
              <Link to="/asignaturas" className="quick-item">
                <span className="quick-item-icon quick-purple"><IconLayout /></span>
                <span>
                  <strong>Mis asignaturas</strong>
                  <small>Explora tus ramas y temas</small>
                </span>
              </Link>
              <Link to={ultimoTema ? `/tema/${ultimoTema.id}/ejercitacion` : '/asignaturas'} className="quick-item">
                <span className="quick-item-icon quick-amber"><IconPen /></span>
                <span>
                  <strong>Ejercitación</strong>
                  <small>Practica y suma puntos</small>
                </span>
              </Link>
              <div className="quick-item" title="Próximamente">
                <span className="quick-item-icon quick-green"><IconBell /></span>
                <span>
                  <strong>Notificaciones</strong>
                  <small>Sin novedades por ahora</small>
                </span>
                <span className="quick-soon">Pronto</span>
              </div>
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  )
}