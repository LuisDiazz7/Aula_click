// Genera supabase/migrations/0007_temas_paes.sql a partir del contenido de los temas PAES
// (scripts/pdf/contenido/*-paes.mjs), para que la base de datos y los PDFs usen las mismas preguntas.
// Uso: node scripts/generar-migracion-temas.mjs
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { TEMAS_PAES } from './pdf/contenido/index.mjs'
import { mezclarAlternativas } from './pdf/mezclar.mjs'

const PREGUNTAS_POR_TEMA = 5

const RAMAS_NUEVAS = [
  [15, 'Formación ciudadana', 5],
  [16, 'Mundo contemporáneo', 5],
]

const txt = (s) => `'${String(s).replace(/'/g, "''")}'`
const filas = (lista) => lista.map((f) => `  (${f.join(', ')})`).join(',\n')

const temas = TEMAS_PAES.map((t) => [t.id, txt(t.nombre), t.rama])

const videos = TEMAS_PAES.flatMap((t) =>
  t.videos.map(([id, titulo, descripcion, canal]) => [
    txt(titulo),
    txt(descripcion),
    txt(`https://www.youtube.com/watch?v=${id}`),
    t.id,
    txt(id),
    txt(canal),
  ])
)

const pdfs = TEMAS_PAES.flatMap((t) => [
  [txt(`Guía de ${t.nombre}`), txt('Resumen con los conceptos clave del tema.'), txt(`/materiales/${t.slug}/guia.pdf`), t.id],
  [txt(`Ejercicios adicionales: ${t.nombre}`), txt('Problemas propuestos con solucionario.'), txt(`/materiales/${t.slug}/ejercicios.pdf`), t.id],
])

const ejercicios = TEMAS_PAES.flatMap((t) =>
  mezclarAlternativas(t)
    .slice(0, PREGUNTAS_POR_TEMA)
    .map((p) => [txt(p.enunciado), t.id, ...p.alternativas.map(txt), txt(p.letra), txt(p.explicacion)])
)

const sql = `-- ============================================================
-- Aula Click - Temas que completan el temario PAES
-- Generado con: node scripts/generar-migracion-temas.mjs (no editar a mano)
-- ${temas.length} temas nuevos, cada uno con 2 videos, 2 PDFs y ${PREGUNTAS_POR_TEMA} preguntas.
-- Se puede ejecutar más de una vez: no duplica filas.
-- ============================================================

BEGIN;

-- ---------- Ramas nuevas de Historia ----------
INSERT INTO ramas (id, nombre, id_asignatura) VALUES
${filas(RAMAS_NUEVAS.map(([id, nombre, asig]) => [id, txt(nombre), asig]))}
ON CONFLICT (id) DO NOTHING;

-- ---------- Temas ----------
INSERT INTO temas (id, nombre, id_rama) VALUES
${filas(temas)}
ON CONFLICT (id) DO NOTHING;

-- ---------- Videos (verificados en YouTube) ----------
INSERT INTO videos (titulo, descripcion, url, id_tema, id_youtube, canal)
SELECT v.titulo, v.descripcion, v.url, v.id_tema, v.id_youtube, v.canal
FROM (VALUES
${filas(videos)}
) AS v(titulo, descripcion, url, id_tema, id_youtube, canal)
WHERE NOT EXISTS (SELECT 1 FROM videos x WHERE x.id_tema = v.id_tema);

-- ---------- PDFs (guía y ejercicios por tema) ----------
INSERT INTO pdfs (titulo, descripcion, url, id_tema)
SELECT p.titulo, p.descripcion, p.url, p.id_tema
FROM (VALUES
${filas(pdfs)}
) AS p(titulo, descripcion, url, id_tema)
WHERE NOT EXISTS (SELECT 1 FROM pdfs x WHERE x.id_tema = p.id_tema);

-- ---------- Ejercitación ----------
INSERT INTO ejercicios (enunciado, id_tema, alt_a, alt_b, alt_c, alt_d, respuesta_correcta, retroalimentacion)
SELECT e.enunciado, e.id_tema, e.alt_a, e.alt_b, e.alt_c, e.alt_d, e.respuesta_correcta, e.retroalimentacion
FROM (VALUES
${filas(ejercicios)}
) AS e(enunciado, id_tema, alt_a, alt_b, alt_c, alt_d, respuesta_correcta, retroalimentacion)
WHERE NOT EXISTS (SELECT 1 FROM ejercicios x WHERE x.id_tema = e.id_tema);

SELECT setval(pg_get_serial_sequence('ramas', 'id'), (SELECT max(id) FROM ramas));
SELECT setval(pg_get_serial_sequence('temas', 'id'), (SELECT max(id) FROM temas));

COMMIT;
`

const destino = resolve('supabase/migrations/0007_temas_paes.sql')
writeFileSync(destino, sql)
console.log(`Migración generada: ${temas.length} temas, ${videos.length} videos, ${pdfs.length} PDFs, ${ejercicios.length} preguntas.`)
