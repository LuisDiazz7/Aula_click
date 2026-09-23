// ============================================================
// Datos simulados para la interfaz del inicio del estudiante.
//
// IMPORTANTE: estos valores son MOCK. Buscan demostrar el diseño
// y deben reemplazarse por métricas reales (query a Supabase)
// cuando el backend de progreso esté listo.
// ============================================================

export const PROGRESO_SUBJECT_MOCK = {
  'matemática': 72,
  'lenguaje': 58,
  'inglés': 64,
  'ciencias': 46,
  'historia': 51,
}

export const PROGRESO_GENERAL_MOCK = 68

export const CONTINUA_MOCK = {
  asignatura: 'Matemática',
  rama: 'Álgebra',
  tema: 'Ecuaciones de primer grado',
  descripcion: 'Continúa desde donde quedaste y sigue avanzando.',
  link: '/asignaturas',
}