const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
}

export const iconMap = {
  lenguaje: (props) => (
    <svg {...base} {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M9 7h7M9 11h5" />
    </svg>
  ),
  inglés: (props) => (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  matemática: (props) => (
    <svg {...base} {...props}>
      <path d="M4 4l16 16M20 4L4 20" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),
  ciencias: (props) => (
    <svg {...base} {...props}>
      <path d="M10 2v6l-6.2 9.3A2 2 0 0 0 5.5 20h13a2 2 0 0 0 1.7-2.7L14 8V2" />
      <path d="M8.5 2h7" />
    </svg>
  ),
  historia: (props) => (
    <svg {...base} {...props}>
      <path d="M12 2l7 3v6c0 4.6-3 8.6-7 10-4-1.4-7-5.4-7-10V5z" />
      <path d="M9.5 11.5l2 2 3.5-4" />
    </svg>
  ),
}

export function IconPlay(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5l5 3.5-5 3.5z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconDoc(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 2h8l4 4v16H6z" />
      <path d="M14 2v5h5M9 11h7M9 15h7M9 19h4" />
    </svg>
  )
}

export function IconQuiz(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M8 9h8M8 13h8M10 17h4" />
    </svg>
  )
}

export function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12.5l2.5 2.5L16 9.5" />
    </svg>
  )
}

export function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </svg>
  )
}

export function IconArrowRight(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  )
}

export function IconLayout(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="8" rx="2" />
      <rect x="3" y="13" width="8" height="8" rx="2" />
      <rect x="13" y="13" width="8" height="8" rx="2" />
    </svg>
  )
}

export function IconPen(props) {
  return (
    <svg {...base} {...props}>
      <path d="M17 3l4 4L8 20l-5 1 1-5z" />
      <path d="M15 5l4 4" />
    </svg>
  )
}

export function IconBell(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10.5 20a2 2 0 0 0 3 0" />
    </svg>
  )
}

export function IconGauge(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 13l3.2-3.2" />
      <path d="M20 19a9 9 0 1 0-16 0" />
      <path d="M4 19h16" />
    </svg>
  )
}

export function IconSpark(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
      <path d="M12 2c.7 4.4 3.1 6.8 7.5 7.5-4.4.7-6.8 3.1-7.5 7.5-.7-4.4-3.1-6.8-7.5-7.5C8.9 8.8 11.3 6.4 12 2z" />
      <path d="M19 15c.3 2 1.4 3.1 3.5 3.5-2.1.4-3.2 1.5-3.5 3.5-.3-2-1.4-3.1-3.5-3.5 2.1-.4 3.2-1.5 3.5-3.5z" />
    </svg>
  )
}

export function IconBot(props) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="7.5" width="16" height="12" rx="4" />
      <path d="M9 7.5V5.5a1.5 1.5 0 0 1 3 0 1.5 1.5 0 0 1 3 0v2" />
      <path d="M8.5 13h.01M12 13h.01M15.5 13h.01" />
      <path d="M8.5 16.5h7" />
    </svg>
  )
}

export function IconSend(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 11.5 20.5 3.5l-6.5 17-3.2-6.3L3.5 11.5z" />
      <path d="M20.5 3.5 10.8 14.2" />
    </svg>
  )
}

export function IconPlus(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function IconClock(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}