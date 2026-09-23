import { useEffect, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { iconMap, IconPlay, IconDoc, IconQuiz } from '../utils/icons'
import Loading from '../components/Loading'
import Reveal from '../components/Reveal'
import AnimatedCounter from '../components/AnimatedCounter'

const ASIGNATURAS = [
  { icon: 'lenguaje', nombre: 'Lenguaje y Comunicación' },
  { icon: 'matemática', nombre: 'Matemática' },
  { icon: 'inglés', nombre: 'Inglés' },
  { icon: 'ciencias', nombre: 'Ciencias Naturales' },
  { icon: 'historia', nombre: 'Historia y Geografía' },
]

const PASOS = [
  {
    numero: '1',
    titulo: 'Crea tu cuenta',
    texto: 'Regístrate con tu correo en menos de un minuto.',
  },
  {
    numero: '2',
    titulo: 'Elige tu curso',
    texto: 'Indica tu curso (3° o 4° Medio) y guarda tu perfil.',
  },
  {
    numero: '3',
    titulo: 'Estudia por tema',
    texto: 'Explora las ramas de cada asignatura con videos y material PDF.',
  },
  {
    numero: '4',
    titulo: 'Mide tu avance',
    texto: 'Resuelve ejercitaciones y revisa al final tus respuestas y puntaje.',
  },
]

export default function Landing() {
  const { user, perfil, loading } = useAuth()
  const heroCopyRef = useRef(null)
  const heroVisualRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const useParallax = !reduced && window.innerWidth > 900

    let raf = null
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = null
        const y = window.scrollY
        setScrolled(y > 8)
        if (!useParallax) return
        if (y < window.innerHeight * 1.25) {
          if (heroCopyRef.current) {
            heroCopyRef.current.style.transform = `translateY(${Math.round(y * 0.07)}px)`
          }
          if (heroVisualRef.current) {
            heroVisualRef.current.style.transform = `translateY(${Math.round(y * -0.045)}px)`
          }
        } else {
          if (heroCopyRef.current) heroCopyRef.current.style.transform = ''
          if (heroVisualRef.current) heroVisualRef.current.style.transform = ''
        }
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  if (loading) return <Loading text="Cargando..." />
  if (user) return <Navigate to={perfil ? '/inicio' : '/crear-perfil'} replace />

  return (
    <div className="landing">
      <header className={`landing-header${scrolled ? ' landing-header--scrolled' : ''}`}>
        <div className="container landing-nav">
          <Link to="/" className="brand">
            <span className="brand-logo">A</span>
            <span className="brand-name">Aula Click</span>
          </Link>

          <nav className="landing-links">
            <a href="#funciones">Funciones</a>
            <a href="#cursos">Cursos</a>
            <a href="#como-funciona">Cómo funciona</a>
          </nav>

          <div className="landing-actions">
            <Link to="/login" className="btn btn-ghost btn-sm">Iniciar sesión</Link>
            <Link to="/registro" className="btn btn-primary btn-sm">Regístrate gratis</Link>
          </div>
        </div>
      </header>

      <section className="landing-hero">
        <div className="container landing-hero-inner">
          <div className="landing-hero-copy" ref={heroCopyRef}>
            <span className="hero-chip">Enseñanza media · Científico Humanista</span>
            <h1>Aprende a tu ritmo con <span className="grad">Aula Click</span></h1>
            <p>
              Tu plataforma de estudio con asignaturas organizadas por ramas y temas,
              videos, material PDF y ejercitaciones con corrección al final.
            </p>
            <div className="hero-actions">
              <Link to="/registro" className="btn btn-primary btn-lg">Comenzar gratis</Link>
              <Link to="/login" className="btn btn-ghost btn-lg">Ya tengo cuenta</Link>
            </div>
            <p className="landing-note">
              Planificado para estudiantes de 3° y 4° Medio de enseñanza media.
            </p>
          </div>

          <div className="landing-hero-visual" ref={heroVisualRef}>
            <div className="preview-float">
              <div className="preview-window">
              <div className="preview-bar">
                <span></span><span></span><span></span>
              </div>
              <div className="preview-body">
                <p className="preview-eyebrow">Dashboard · 4° Medio</p>
                <p className="preview-title">Mis asignaturas</p>
                <div className="preview-grid">
                  {ASIGNATURAS.map((s) => {
                    const Icon = iconMap[s.icon]
                    return (
                      <div className="preview-subject" key={s.icon}>
                        <span className="subject-icon sm"><Icon /></span>
                        <strong>{s.nombre}</strong>
                      </div>
                    )
                  })}
                </div>
                <div className="preview-theme">
                  <span className="theme-icon"><IconPlay /></span>
                  <div>
                    <strong>Tema 3 · Funciones</strong>
                    <p>Matemática → Álgebra y funciones</p>
                  </div>
                  <span className="preview-score">80%</span>
                </div>
                <div className="preview-resources">
                  <span><IconDoc /> PDF de apoyo</span>
                  <span><IconQuiz /> Ejercitación</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      <section className="landing-stats">
        <Reveal variant="up" className="container landing-stats-inner">
          <div className="stat"><AnimatedCounter end={31} /><span>temas de estudio</span></div>
          <div className="stat"><AnimatedCounter end={62} suffix="+" /><span>videos y materiales</span></div>
          <div className="stat"><AnimatedCounter end={155} /><span>preguntas de práctica</span></div>
          <div className="stat"><AnimatedCounter end={100} suffix="%" /><span>enfocado en la PAES</span></div>
        </Reveal>
      </section>

      <section id="funciones" className="container landing-section">
        <Reveal variant="up" className="section-head center">
          <h2>Todo lo que necesitas para estudiar</h2>
          <p>Una sola plataforma para organizar tu repaso de la enseñanza media.</p>
        </Reveal>
        <div className="grid grid-3">
          <Reveal variant="up">
            <div className="card feature-card">
              <span className="theme-icon"><IconPlay /></span>
              <h3>Videos explicativos</h3>
              <p>Contenido guiado por tema para entender los conceptos antes de practicar.</p>
            </div>
          </Reveal>
          <Reveal variant="up" delay={110}>
            <div className="card feature-card">
              <span className="theme-icon"><IconDoc /></span>
              <h3>Material PDF</h3>
              <p>Guías de estudio descargables para repasar cuando y donde quieras.</p>
            </div>
          </Reveal>
          <Reveal variant="up" delay={220}>
            <div className="card feature-card">
              <span className="theme-icon"><IconQuiz /></span>
              <h3>Ejercitación inteligente</h3>
              <p>Evaluaciones de 5 preguntas con puntaje y corrección al terminar, por tema.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="cursos" className="container landing-section">
        <Reveal variant="up" className="section-head center">
          <h2>Diseñado para tu curso</h2>
          <p>Contenido ordenado curso → asignatura → rama → tema.</p>
        </Reveal>
        <div className="grid grid-2">
          <Reveal variant="left">
            <div className="card course-card">
              <span className="course-card-badge">3°</span>
              <h3>Tercero Medio</h3>
              <p>Plan Común y Electivos de la mención Científico Humanista.</p>
              <div className="chip-row">
                {ASIGNATURAS.slice(0, 3).map((s) => (
                  <span className="chip-chip" key={s.icon}>{s.nombre}</span>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal variant="right" delay={120}>
            <div className="card course-card">
              <span className="course-card-badge alt">4°</span>
              <h3>Cuarto Medio</h3>
              <p>Último tramo de la enseñanza media, preparación para la PAES.</p>
              <div className="chip-row">
                {ASIGNATURAS.slice(1).map((s) => (
                  <span className="chip-chip alt" key={s.icon}>{s.nombre}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="como-funciona" className="container landing-section">
        <Reveal variant="up" className="section-head center">
          <h2>¿Cómo funciona?</h2>
          <p>En 4 pasos ya estás estudiando.</p>
        </Reveal>
        <div className="steps">
          {PASOS.map((paso, index) => (
            <Reveal variant="up" delay={index * 100} key={paso.numero}>
              <div className="step">
                <span className="step-num">{paso.numero}</span>
                <h3>{paso.titulo}</h3>
                <p>{paso.texto}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <Reveal variant="up" className="container landing-cta-inner">
          <h2>Empieza hoy a preparar tu futuro</h2>
          <p>Regístrate gratis y encuentra tu asignatura favorita a un clic.</p>
          <div className="hero-actions">
            <Link to="/registro" className="btn btn-primary btn-lg">Crear mi cuenta</Link>
            <Link to="/login" className="btn btn-ghost btn-lg">Iniciar sesión</Link>
          </div>
        </Reveal>
      </section>

      <footer className="landing-footer">
        <Reveal variant="fade" className="container landing-footer-inner">
          <div className="brand">
            <span className="brand-logo">A</span>
            <span className="brand-name">Aula Click</span>
          </div>
          <p>Plataforma educativa para estudiantes de enseñanza media.</p>
          <p className="muted">© {new Date().getFullYear()} Aula Click. Todos los derechos reservados.</p>
        </Reveal>
      </footer>
    </div>
  )
}