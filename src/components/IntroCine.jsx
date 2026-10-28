import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import introHtml from './intro-cine.html?raw'

gsap.registerPlugin(ScrollTrigger)

// Intro cinemática de la landing: es la animación original (plano cenital →
// idea → Google → aulaclick.com) con scroll, pin y scrub. Sale cada vez que
// se carga la página.
export default function IntroCine({ onFinalizar }) {
  const raizRef = useRef(null)
  const lenisRef = useRef(null)
  const triggerRef = useRef(null)

  const reduce = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  ).current

  useEffect(() => {
    if (reduce) return

    const root = raizRef.current
    let ac = null
    const tick = () => {
      if (!ac) return
      try {
        const n = ac.sampleRate * 0.04
        const b = ac.createBuffer(1, n, ac.sampleRate)
        const d = b.getChannelData(0)
        for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 5)
        const s = ac.createBufferSource()
        const f = ac.createBiquadFilter()
        const g = ac.createGain()
        s.buffer = b
        f.type = 'bandpass'
        f.frequency.value = 1800 + Math.random() * 2200
        g.gain.value = 0.7
        s.connect(f)
        f.connect(g)
        g.connect(ac.destination)
        s.start()
      } catch {
        // audio no disponible
      }
    }

    const sndBtn = root.querySelector('#snd')
    const onSnd = () => {
      try {
        ac = ac || new (window.AudioContext || window.webkitAudioContext)()
        ac.resume()
        sndBtn.textContent = '🔊 Sonido activo'
      } catch {
        // audio no disponible
      }
    }
    sndBtn?.addEventListener('click', onSnd)

    /* Scroll suave (Lenis) conectado a ScrollTrigger, igual que el original */
    const lenis = new Lenis({ lerp: 0.09 })
    lenisRef.current = lenis
    const onLenisScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onLenisScroll)
    const raf = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    const ctx = gsap.context(() => {
      gsap.set('.mon', { xPercent: -50 })
      gsap.set('#kb', { xPercent: -50 })
      gsap.set('#wipe', { xPercent: -135, skewX: -14 })
      gsap.set('#bulb', { scale: 0, svgOrigin: '500 270' })
      gsap.set('#plat', { scale: 0.92 })
      gsap.to('#s1,#s3', {
        x: 3,
        y: 2,
        rotation: 0.15,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      const st = { n: 0, k: 0 }
      const Q = 'aulaclick.com'

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '#stage',
          start: 'top top',
          end: '+=8000',
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
      triggerRef.current = tl.scrollTrigger

      /* 0–5: plano cenital, frustración y preguntas (parallax por capas) */
      tl.to('#hint', { opacity: 0, duration: 0.4 }, 0.2)
        .to('#s1c', { scale: 1.18, transformOrigin: '50% 55%', duration: 6 }, 0)
        .to('#desk', { y: -20, duration: 6 }, 0)
        .to('#stuff', { y: -45, duration: 6 }, 0)
        .to('#kidTop', { y: 25, duration: 6 }, 0)
        .to('.qb', { opacity: 1, stagger: 0.45, duration: 0.5 }, 0.5)
        .to('.qb', { y: -70, duration: 5, stagger: 0.2 }, 0.5)
        .to('#headT', { rotation: -4, svgOrigin: '500 500', duration: 0.7, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 0.4)
        .to('#armRg', { rotation: -24, svgOrigin: '624 484', duration: 0.6, ease: 'power2.out' }, 1.2)
        .to('#armRg', { rotation: -10, svgOrigin: '624 484', duration: 0.18, yoyo: true, repeat: 15, ease: 'sine.inOut' }, 1.8)
        .to('#armRg', { rotation: 0, svgOrigin: '624 484', duration: 0.4 }, 4.7)
        /* 4.7–5.3: se le ocurre la idea */
        .to('.qb', { opacity: 0, duration: 0.4 }, 4.5)
        .to('#bulb', { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, 4.7)
        .to('#flash', { opacity: 0.75, duration: 0.15, yoyo: true, repeat: 1 }, 4.8)
        /* 5.4–6.6: se para de la silla */
        .to('#chair', { y: 90, rotation: 12, svgOrigin: '500 480', duration: 1, ease: 'power2.in' }, 5.4)
        .to('#kidTop', { y: 520, scale: 1.15, svgOrigin: '500 470', duration: 1.1, ease: 'power2.in' }, 5.4)
        .to('#bulb', { opacity: 0, duration: 0.3 }, 5.5)
        /* 6.4–7.4: whip pan hacia la escena del computador */
        .to('#s1', { filter: 'blur(14px)', duration: 0.6 }, 6.2)
        .to('#wipe', { xPercent: 0, duration: 0.6, ease: 'power3.in' }, 6.3)
        .set('#s1', { opacity: 0 }, 6.95)
        .set('#s3', { opacity: 1 }, 6.95)
        .to('#wipe', { xPercent: 135, duration: 0.6, ease: 'power3.out' }, 6.95)
        .fromTo('#s3', { scale: 1.14 }, { scale: 1, duration: 1.4, ease: 'power2.out', transformOrigin: '50% 40%' }, 6.95)
        .fromTo('#bgw', { yPercent: -5 }, { yPercent: 5, duration: 5 }, 6.9)
        .fromTo('#kb', { y: 30 }, { y: 0, duration: 1.2, ease: 'power2.out' }, 7)
        /* 7.8–9.4: escribe aulaclick.com (con sonido de teclado) */
        .to(st, {
          n: 13,
          duration: 1.7,
          onUpdate() {
            const k = Math.round(st.n)
            if (k !== st.k) {
              st.k = k
              const t = Q.slice(0, k)
              root.querySelector('#typed').textContent = t
              root.querySelector('#typed2').textContent = t
              root.querySelector('#sug').style.opacity = k > 2 ? 1 : 0
              tick()
            }
          },
        }, 7.8)
        .to('#kb', { y: -4, duration: 0.12, yoyo: true, repeat: 13 }, 7.8)
        /* 9.6: Enter → resultados */
        .call(tick, null, 9.6)
        .to('#g1', { opacity: 0, duration: 0.3 }, 9.6)
        .to('#g2', { opacity: 1, duration: 0.3 }, 9.7)
        /* 10–10.9: mueve el cursor y hace clic en el resultado */
        .fromTo('#cur', { left: '78%', top: '82%' }, { left: '16%', top: '34%', duration: 0.9, ease: 'power2.inOut' }, 10)
        .to('#cur', { scale: 0.78, duration: 0.1, yoyo: true, repeat: 1 }, 10.95)
        .call(tick, null, 10.95)
        .to('#res', { backgroundColor: '#eef2ff', duration: 0.2 }, 10.95)
        .to('#ld', { width: '100%', duration: 0.8 }, 11)
        /* 11–12.5: la pantalla se expande y carga la página */
        .to('#mon', {
          scale: () => {
            const scr = root.querySelector('.scr')
            const r = scr.getBoundingClientRect()
            return Math.max(window.innerWidth / r.width, window.innerHeight / r.height) * 1.06
          },
          transformOrigin: '50% 50%',
          duration: 1.5,
          ease: 'power2.in',
        }, 11.2)
        /* La pantalla del computador ya llenó el viewport: se sale de la intro
           y aparece la página real con sus animaciones de entrada. */
        .add(() => {
          if (onFinalizar) onFinalizar()
          else document.querySelector('.landing-header')?.scrollIntoView({ block: 'start' })
        }, 12.8)
    }, raizRef)

    return () => {
      sndBtn?.removeEventListener('click', onSnd)
      gsap.ticker.remove(raf)
      lenis.off('scroll', onLenisScroll)
      lenis.destroy()
      lenisRef.current = null
      triggerRef.current = null
      ctx.revert()
      ScrollTrigger.refresh()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function saltar() {
    // Salta al final del pin: a partir de ahí se ve el landing real.
    const target = (triggerRef.current?.end ?? window.innerHeight) + 2
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { immediate: true })
    } else {
      window.scrollTo({ top: target })
    }
  }

  if (reduce) return null

  return (
    <div id="intro-cine" className="intro-cine" ref={raizRef}>
      <div className="intro-cine-host" dangerouslySetInnerHTML={{ __html: introHtml }} />
      <button type="button" className="intro-cine-saltar" onClick={saltar}>
        Saltar intro
      </button>
    </div>
  )
}
