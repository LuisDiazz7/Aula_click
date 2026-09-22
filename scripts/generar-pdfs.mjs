import { mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const temas = [
  { slug: 'potencias', nombre: 'Potencias' },
  { slug: 'suma-resta-enteros', nombre: 'Suma y resta de números enteros' },
  { slug: 'multiplicacion-division-enteros', nombre: 'Multiplicación y división de números enteros' },
  { slug: 'propiedades-potencias', nombre: 'Propiedades de las potencias' },
  { slug: 'funcion-lineal', nombre: 'Función lineal' },
  { slug: 'funcion-cuadratica', nombre: 'Función cuadrática' },
  { slug: 'funcion-exponencial', nombre: 'Función exponencial' },
  { slug: 'circulo-circunferencia', nombre: 'Círculo y circunferencia' },
  { slug: 'trigonometria', nombre: 'Trigonometría' },
  { slug: 'areas-volumenes', nombre: 'Áreas y volúmenes' },
  { slug: 'variable-aleatoria', nombre: 'Variable aleatoria' },
  { slug: 'distribucion-binomial', nombre: 'Distribución binomial' },
  { slug: 'estadistica-descriptiva', nombre: 'Estadística descriptiva' },
  { slug: 'textos-escritos', nombre: 'Textos escritos' },
  { slug: 'textos-orales', nombre: 'Textos orales' },
  { slug: 'poesia-chilena', nombre: 'Poesía chilena' },
  { slug: 'narrativa-chilena', nombre: 'Narrativa chilena' },
  { slug: 'debate-argumentacion', nombre: 'Debate y argumentación' },
  { slug: 'skimming-scanning', nombre: 'Skimming and scanning' },
  { slug: 'reading-strategies', nombre: 'Reading strategies' },
  { slug: 'verb-tenses', nombre: 'Verb tenses' },
  { slug: 'conditionals', nombre: 'Conditionals' },
  { slug: 'idioms', nombre: 'Idioms' },
  { slug: 'movimiento-rectilineo', nombre: 'Movimiento rectilíneo uniforme' },
  { slug: 'fuerza-energia', nombre: 'Fuerza y energía' },
  { slug: 'estequiometria', nombre: 'Estequiometría' },
  { slug: 'reacciones-quimicas', nombre: 'Reacciones químicas' },
  { slug: 'genetica', nombre: 'Genética' },
  { slug: 'chile-contemporaneo', nombre: 'Chile contemporáneo' },
  { slug: 'economia-siglo-xx', nombre: 'Economía del siglo XX' },
  { slug: 'guerras-mundiales', nombre: 'Guerras mundiales' },
]

function esc(texto) {
  return texto.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

function crearPdf(titulo) {
  const contenido =
    'BT /F1 24 Tf 50 720 Td (' +
    esc(titulo) +
    ') Tj ET\n' +
    'BT /F1 12 Tf 50 690 Td (Material de estudio de Aula Click.) Tj ET\n' +
    'BT /F1 10 Tf 50 650 Td (Este documento guia los conceptos clave del tema para preparar la PAES.) Tj ET\n' +
    'BT /F1 10 Tf 50 630 Td (Revisa los videos del subtema y responde la ejercitacion para practicar.) Tj ET\n' +
    'BT /F1 10 Tf 50 610 Td (Disenado para 3. o 4. medio, area cientifico-humanista.) Tj ET'

  const objetos = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    '<< /Length ' +
      Buffer.byteLength(contenido, 'latin1') +
      ' >>\nstream\n' +
      contenido +
      '\nendstream',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]

  let pdf = '%PDF-1.4\n'
  const offsets = []
  objetos.forEach((obj, i) => {
    offsets.push(Buffer.byteLength(pdf, 'latin1'))
    pdf += i + 1 + ' 0 obj\n' + obj + '\nendobj\n'
  })
  const xrefPos = Buffer.byteLength(pdf, 'latin1')
  pdf += 'xref\n0 ' + (objetos.length + 1) + '\n'
  pdf += '0000000000 65535 f \n'
  offsets.forEach((off) => {
    pdf += String(off).padStart(10, '0') + ' 00000 n \n'
  })
  pdf += 'trailer\n<< /Size ' + (objetos.length + 1) + ' /Root 1 0 R >>\n'
  pdf += 'startxref\n' + xrefPos + '\n%%EOF'

  return Buffer.from(pdf, 'latin1')
}

const base = resolve('public/materiales')
let creados = 0

for (const tema of temas) {
  const dir = join(base, tema.slug)
  mkdirSync(dir, { recursive: true })
  const opciones = [
    { file: 'guia.pdf', titulo: 'Guía de ' + tema.nombre, textos: ['CONTENIDO', 'Resumen teorico y ejemplos resueltos, paso a paso.'] },
    { file: 'ejercicios.pdf', titulo: 'Ejercicios: ' + tema.nombre, textos: ['EJERCITACION', 'Problemas propuestos con solucionario comentado.'] },
  ]
  for (const opcion of opciones) {
    const pdf = crearPdf(opcion.titulo)
    writeFileSync(join(dir, opcion.file), pdf)
    creados += 1
  }
}

console.log('PDFs creados: ' + creados)