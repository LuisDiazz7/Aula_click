import { useCallback, useEffect, useState } from 'react'
import { getProgresoPorAsignatura, onProgresoActualizado } from '../services/progresoService'

const INICIAL = { porAsignatura: {}, general: 0, ejerciciosCompletados: 0 }

/**
 * Progreso real del usuario autenticado.
 * Se vuelve a consultar solo cuando se guarda un resultado nuevo.
 */
export function useProgreso(idUsuario) {
  const [progreso, setProgreso] = useState(INICIAL)
  const [cargando, setCargando] = useState(Boolean(idUsuario))

  const cargar = useCallback(async () => {
    if (!idUsuario) {
      setProgreso(INICIAL)
      setCargando(false)
      return
    }

    const datos = await getProgresoPorAsignatura(idUsuario)
    setProgreso({
      porAsignatura: datos.porAsignatura || {},
      general: datos.general ?? 0,
      ejerciciosCompletados: datos.ejerciciosCompletados ?? 0,
    })
    setCargando(false)
  }, [idUsuario])

  useEffect(() => {
    setCargando(Boolean(idUsuario))
    cargar()
  }, [cargar])

  useEffect(() => onProgresoActualizado(cargar), [cargar])

  const porcentajeDeAsignatura = useCallback(
    (idAsignatura) => progreso.porAsignatura[idAsignatura]?.porcentaje ?? 0,
    [progreso.porAsignatura],
  )

  return { ...progreso, cargando, recargar: cargar, porcentajeDeAsignatura }
}
