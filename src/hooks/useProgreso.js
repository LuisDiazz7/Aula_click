import { useCallback, useEffect, useState } from 'react'
import { getProgresoPorAsignatura, onProgresoActualizado } from '../services/progresoService'

const INICIAL = { porAsignatura: {}, general: 0, ejerciciosCompletados: 0 }

/**
 * Progreso real del usuario autenticado.
 * Se consulta una vez al entrar y se refresca solo cuando se guarda
 * un resultado nuevo, sin necesidad de recargar la pagina.
 */
export function useProgreso(idUsuario) {
  const [progreso, setProgreso] = useState(INICIAL)
  const [cargando, setCargando] = useState(Boolean(idUsuario))
  const [pedido, setPedido] = useState(0)

  const recargar = useCallback(() => setPedido((n) => n + 1), [])

  useEffect(() => {
    let vigente = true

    if (!idUsuario) {
      setProgreso(INICIAL)
      setCargando(false)
      return () => { vigente = false }
    }

    setCargando(true)
    getProgresoPorAsignatura(idUsuario).then((datos) => {
      if (!vigente) return
      setProgreso({
        porAsignatura: datos.porAsignatura || {},
        general: datos.general ?? 0,
        ejerciciosCompletados: datos.ejerciciosCompletados ?? 0,
      })
      setCargando(false)
    })

    return () => { vigente = false }
  }, [idUsuario, pedido])

  useEffect(() => onProgresoActualizado(recargar), [recargar])

  const porcentajeDeAsignatura = useCallback(
    (idAsignatura) => progreso.porAsignatura[idAsignatura]?.porcentaje ?? 0,
    [progreso.porAsignatura],
  )

  return { ...progreso, cargando, recargar, porcentajeDeAsignatura }
}
