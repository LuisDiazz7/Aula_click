import { useEffect, useState } from 'react'
import useInView from '../hooks/useInView'

export default function AnimatedCounter({ end, suffix = '', duration = 1400 }) {
  const { ref, inView } = useInView({ threshold: 0.5 })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(end)
      return
    }

    let raf
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(end * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, end, duration])

  return (
    <strong ref={ref}>
      {value}
      {suffix}
    </strong>
  )
}