import { Link } from 'react-router-dom'
import { getTemarioPaes } from '../data/temarioPaes'

function contarCobertura(prueba) {
  const contenidos = prueba.ejes.flatMap((e) => e.contenidos)
  const cubiertos = contenidos.filter((c) => c.temas.length > 0).length
  return { cubiertos, total: contenidos.length }
}

export default function TemarioPaes({ asignatura }) {
  const temario = getTemarioPaes(asignatura)
  if (!temario) return null

  return (
    <section className="paes" aria-labelledby="paes-titulo">
      <div className="paes-head">
        <span className="page-eyebrow">Preparación PAES</span>
        <h2 id="paes-titulo">Temario PAES</h2>
        <p>
          Contenidos que evalúa el DEMRE en la prueba de esta asignatura. Los que tienen material
          en Aula Click te llevan directo al tema.
        </p>
      </div>

      {temario.nota && <p className="paes-nota">{temario.nota}</p>}

      {temario.pruebas.map((prueba) => {
        const { cubiertos, total } = contarCobertura(prueba)
        return (
          <article key={prueba.nombre} className="paes-prueba">
            <header className="paes-prueba-head">
              <h3>{prueba.nombre}</h3>
              <span className={`paes-tipo paes-tipo--${prueba.tipo.toLowerCase()}`}>{prueba.tipo}</span>
              <span className="paes-cobertura">{cubiertos} de {total} contenidos con material</span>
            </header>

            <div className="paes-ejes">
              {prueba.ejes.map((eje) => (
                <div key={eje.nombre} className="paes-eje">
                  <h4>{eje.nombre}</h4>
                  <ul>
                    {eje.contenidos.map((c) => (
                      <li key={c.nombre} className={c.temas.length ? 'is-cubierto' : ''}>
                        {c.temas.length ? (
                          <Link to={`/tema/${c.temas[0]}`}>{c.nombre}</Link>
                        ) : (
                          <span>{c.nombre}</span>
                        )}
                        <small>{c.temas.length ? 'Disponible' : 'Próximamente'}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </article>
        )
      })}
    </section>
  )
}
