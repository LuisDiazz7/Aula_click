import useInView from '../hooks/useInView'

export default function Reveal({
  as: Tag = 'div',
  variant = 'up',
  delay = 0,
  className = '',
  style,
  children,
}) {
  const { ref, inView } = useInView()
  const classes = ['reveal', `reveal-${variant}`, inView ? 'in-view' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag
      ref={ref}
      className={classes}
      style={{ ...style, '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}