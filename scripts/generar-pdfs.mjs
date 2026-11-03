// Genera la guía y los ejercicios en PDF de cada tema en public/materiales/<slug>/.
// Uso: node scripts/generar-pdfs.mjs
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { Documento } from './pdf/documento.mjs'
import { mezclarAlternativas } from './pdf/mezclar.mjs'
import { ASIGNATURAS } from './pdf/contenido/index.mjs'

function crearGuia(tema, asignatura) {
  const doc = new Documento({ titulo: `Guía: ${tema.nombre}`, subtitulo: `${asignatura.toUpperCase()} · GUÍA DE ESTUDIO` })
  doc.parrafo(tema.paes, { tamano: 10, negrita: true, color: [0.39, 0.45, 0.55], despues: 4 })

  doc.titulo2('¿De qué trata?')
  doc.parrafo(tema.resumen)

  doc.titulo2('Conceptos clave')
  doc.vinetas(tema.claves)

  if (tema.ejemplo) {
    doc.titulo2('Ejemplo resuelto')
    doc.recuadro('Problema', tema.ejemplo.enunciado)
    doc.recuadro('Solución', tema.ejemplo.solucion)
  }
  if (tema.consejo) {
    doc.titulo2('Consejo')
    doc.recuadro(null, tema.consejo)
  }

  doc.titulo2('Para seguir practicando')
  doc.parrafo(
    'Descarga el PDF de ejercicios de este tema, revisa los videos en Aula Click y luego resuelve la ejercitación en línea para medir tu avance.'
  )
  return doc.aBuffer()
}

function crearEjercicios(tema, asignatura) {
  const preguntas = mezclarAlternativas(tema)
  const doc = new Documento({ titulo: `Ejercicios: ${tema.nombre}`, subtitulo: `${asignatura.toUpperCase()} · EJERCITACIÓN TIPO PAES` })
  doc.parrafo(tema.paes, { tamano: 10, negrita: true, color: [0.39, 0.45, 0.55], despues: 4 })
  doc.recuadro(
    'Instrucciones',
    `Este documento contiene ${preguntas.length} preguntas de selección múltiple con 4 alternativas. Solo una es correcta. ` +
      'Respóndelas sin mirar la pauta y luego revisa tus resultados en la última página.'
  )

  if (tema.lectura) {
    doc.titulo2('Lee el siguiente texto y responde las preguntas')
    doc.parrafo(tema.lectura.titulo, { tamano: 12, negrita: true, despues: 4 })
    for (const p of tema.lectura.texto.split('\n')) {
      doc.parrafo(p, { tamano: 10.5, despues: tema.lectura.poema ? 0 : 6 })
    }
    doc.y -= 6
  }

  doc.titulo2('Preguntas')
  preguntas.forEach((p, i) => doc.pregunta(i + 1, p.enunciado, p.alternativas))

  doc.nuevaPagina()
  doc.titulo2('Pauta de respuestas')
  preguntas.forEach((p, i) => {
    doc.parrafo(`${i + 1}. Alternativa ${p.letra}`, { negrita: true, despues: 0 })
    doc.parrafo(p.explicacion, { tamano: 10.5, sangria: 16, color: [0.2, 0.25, 0.33], despues: 6 })
  })
  return doc.aBuffer()
}

const base = resolve('public/materiales')
let creados = 0

for (const [asignatura, temas] of ASIGNATURAS) {
  for (const tema of temas) {
    if (tema.ejercicios.length !== 8) throw new Error(`${tema.slug}: se esperaban 8 ejercicios`)
    const dir = join(base, tema.slug)
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'guia.pdf'), crearGuia(tema, asignatura))
    writeFileSync(join(dir, 'ejercicios.pdf'), crearEjercicios(tema, asignatura))
    creados += 2
  }
}

console.log('PDFs creados: ' + creados)
