// Generador mínimo de PDF (sin dependencias) con texto ajustado, varias páginas
// y soporte para acentos (WinAnsiEncoding) y símbolos matemáticos (fuente Symbol).

const ANCHO_PAGINA = 612
const ALTO_PAGINA = 792
const MARGEN_X = 56
const MARGEN_SUP = 60
const MARGEN_INF = 64
export const ANCHO_UTIL = ANCHO_PAGINA - MARGEN_X * 2

const COLOR_PRIMARIO = [0.31, 0.27, 0.9]
const COLOR_TEXTO = [0.06, 0.09, 0.16]
const COLOR_SUAVE = [0.39, 0.45, 0.55]

// Caracteres fuera de WinAnsi que se dibujan con la fuente Symbol.
const SIMBOLOS = {
  'π': 0x70, '√': 0xd6, '≤': 0xa3, '≥': 0xb3, '≠': 0xb9, 'Δ': 0x44, '→': 0xae,
  '−': 0x2d, '∞': 0xa5, 'α': 0x61, 'Σ': 0x53, '∪': 0xc8, '⊂': 0xcc, '∩': 0xc7, 'Ω': 0x57, 'λ': 0x6c, 'β': 0x62, 'θ': 0x71, '≈': 0xbb, '±': 0xb1,
}

// Caracteres de WinAnsi entre 0x80 y 0x9F (el resto coincide con Latin-1).
const WIN_ANSI_EXTRA = {
  '€': 0x80, '‚': 0x82, '„': 0x84, '…': 0x85, '‘': 0x91, '’': 0x92, '“': 0x93,
  '”': 0x94, '•': 0x95, '–': 0x96, '—': 0x97, '™': 0x99,
}

// Anchos de Helvetica (unidades de 1/1000 em) para ASCII 32..126.
const ANCHOS = [
  278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278,
  556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556,
  1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778,
  667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556,
  333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556,
  556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584,
]

function anchoCaracter(c, negrita) {
  if (SIMBOLOS[c] !== undefined) return 560
  const base = c.normalize('NFD')[0]
  const code = base.charCodeAt(0)
  const w = code >= 32 && code <= 126 ? ANCHOS[code - 32] : 556
  return negrita ? w * 1.07 : w
}

export function anchoTexto(texto, tamano, negrita = false) {
  let total = 0
  for (const c of texto) total += anchoCaracter(c, negrita)
  return (total * tamano) / 1000
}

function byteWinAnsi(c) {
  if (WIN_ANSI_EXTRA[c] !== undefined) return WIN_ANSI_EXTRA[c]
  const code = c.charCodeAt(0)
  if (code < 256) return code
  return 0x3f // '?'
}

function literal(bytes) {
  let s = ''
  for (const b of bytes) {
    if (b === 0x28 || b === 0x29 || b === 0x5c) s += '\\' + String.fromCharCode(b)
    else if (b < 32 || b > 126) s += '\\' + b.toString(8).padStart(3, '0')
    else s += String.fromCharCode(b)
  }
  return '(' + s + ')'
}

// Convierte un texto en una secuencia de Tj, cambiando a Symbol cuando hace falta.
function operadoresTexto(texto, fuente, tamano) {
  const tramos = []
  for (const c of texto) {
    const simbolo = SIMBOLOS[c] !== undefined
    const f = simbolo ? 'F3' : fuente
    const b = simbolo ? SIMBOLOS[c] : byteWinAnsi(c)
    const ultimo = tramos[tramos.length - 1]
    if (ultimo && ultimo.f === f) ultimo.bytes.push(b)
    else tramos.push({ f, bytes: [b] })
  }
  return tramos.map((t) => `/${t.f} ${tamano} Tf ${literal(t.bytes)} Tj`).join(' ')
}

export function ajustarLineas(texto, ancho, tamano, negrita = false) {
  const lineas = []
  for (const parrafo of String(texto).split('\n')) {
    const palabras = parrafo.split(/\s+/).filter(Boolean)
    let actual = ''
    for (const palabra of palabras) {
      const prueba = actual ? actual + ' ' + palabra : palabra
      if (anchoTexto(prueba, tamano, negrita) <= ancho || !actual) actual = prueba
      else {
        lineas.push(actual)
        actual = palabra
      }
    }
    lineas.push(actual)
  }
  return lineas
}

const rgb = (c) => c.map((v) => v.toFixed(3)).join(' ')

export class Documento {
  constructor({ titulo, subtitulo }) {
    this.titulo = titulo
    this.subtitulo = subtitulo
    this.paginas = []
    this.nuevaPagina()
  }

  nuevaPagina() {
    this.ops = []
    this.paginas.push(this.ops)
    if (this.paginas.length === 1) {
      this.rect(0, ALTO_PAGINA - 110, ANCHO_PAGINA, 110, COLOR_PRIMARIO)
      this.texto(this.subtitulo, MARGEN_X, ALTO_PAGINA - 46, { tamano: 10, color: [0.88, 0.9, 1] })
      const lineas = ajustarLineas(this.titulo, ANCHO_UTIL, 20, true)
      lineas.slice(0, 2).forEach((l, i) => {
        this.texto(l, MARGEN_X, ALTO_PAGINA - 72 - i * 24, { tamano: 20, negrita: true, color: [1, 1, 1] })
      })
      this.y = ALTO_PAGINA - 110 - 32
    } else {
      this.texto(this.titulo, MARGEN_X, ALTO_PAGINA - 36, { tamano: 9, color: COLOR_SUAVE })
      this.linea(MARGEN_X, ALTO_PAGINA - 44, ANCHO_PAGINA - MARGEN_X, ALTO_PAGINA - 44, [0.88, 0.9, 0.94])
      this.y = ALTO_PAGINA - MARGEN_SUP - 10
    }
  }

  asegurarEspacio(alto) {
    if (this.y - alto < MARGEN_INF) this.nuevaPagina()
  }

  rect(x, y, w, h, color) {
    this.ops.push(`${rgb(color)} rg ${x} ${y} ${w} ${h} re f`)
  }

  linea(x1, y1, x2, y2, color) {
    this.ops.push(`${rgb(color)} RG 0.8 w ${x1} ${y1} m ${x2} ${y2} l S`)
  }

  texto(texto, x, y, { tamano = 11, negrita = false, color = COLOR_TEXTO } = {}) {
    const fuente = negrita ? 'F2' : 'F1'
    this.ops.push(`BT ${rgb(color)} rg ${x.toFixed(2)} ${y.toFixed(2)} Td ${operadoresTexto(texto, fuente, tamano)} ET`)
  }

  // Párrafo con ajuste de línea. `sangria` desplaza todas las líneas.
  parrafo(texto, { tamano = 11, negrita = false, color, sangria = 0, interlineado = 1.45, despues = 8 } = {}) {
    const alto = tamano * interlineado
    const lineas = ajustarLineas(texto, ANCHO_UTIL - sangria, tamano, negrita)
    for (const l of lineas) {
      this.asegurarEspacio(alto)
      this.y -= alto
      this.texto(l, MARGEN_X + sangria, this.y, { tamano, negrita, color })
    }
    this.y -= despues
  }

  titulo2(texto) {
    this.asegurarEspacio(48)
    this.y -= 10
    this.parrafo(texto, { tamano: 14, negrita: true, color: COLOR_PRIMARIO, despues: 6 })
  }

  vinetas(items, { tamano = 11 } = {}) {
    for (const item of items) {
      const lineas = ajustarLineas(item, ANCHO_UTIL - 16, tamano)
      this.asegurarEspacio(lineas.length * tamano * 1.45)
      this.y -= tamano * 1.45
      this.texto('•', MARGEN_X + 2, this.y, { tamano, color: COLOR_PRIMARIO })
      this.y += tamano * 1.45
      this.parrafo(item, { tamano, sangria: 16, despues: 3 })
    }
    this.y -= 5
  }

  // Bloque con fondo suave; el contenido se mide antes de dibujarlo.
  recuadro(titulo, texto, { tamano = 10.5 } = {}) {
    const alto = tamano * 1.45
    const lineas = ajustarLineas(texto, ANCHO_UTIL - 28, tamano)
    const pad = 12
    let restantes = lineas
    let primero = true
    while (restantes.length) {
      this.asegurarEspacio(alto * 3 + pad * 2)
      const cabecera = primero && titulo ? alto + 4 : 0
      const caben = Math.max(1, Math.floor((this.y - MARGEN_INF - pad * 2 - cabecera) / alto))
      const tramo = restantes.slice(0, caben)
      restantes = restantes.slice(caben)
      const h = tramo.length * alto + pad * 2 + cabecera
      this.rect(MARGEN_X, this.y - h, ANCHO_UTIL, h, [0.95, 0.95, 1])
      this.rect(MARGEN_X, this.y - h, 3, h, COLOR_PRIMARIO)
      let yy = this.y - pad
      if (cabecera) {
        yy -= alto
        this.texto(titulo, MARGEN_X + 14, yy, { tamano, negrita: true, color: COLOR_PRIMARIO })
        yy -= 4
      }
      for (const l of tramo) {
        yy -= alto
        this.texto(l, MARGEN_X + 14, yy, { tamano })
      }
      this.y -= h + 12
      primero = false
    }
  }

  // Pregunta de selección múltiple que no se corta entre páginas.
  pregunta(numero, enunciado, alternativas, { tamano = 11 } = {}) {
    const alto = tamano * 1.45
    const lineasEnunciado = ajustarLineas(enunciado, ANCHO_UTIL - 22, tamano)
    const lineasAlt = alternativas.map((a) => ajustarLineas(a, ANCHO_UTIL - 48, tamano))
    const total = (lineasEnunciado.length + lineasAlt.flat().length) * alto + 18
    this.asegurarEspacio(total)

    this.y -= alto
    this.texto(`${numero}.`, MARGEN_X, this.y, { tamano, negrita: true, color: COLOR_PRIMARIO })
    lineasEnunciado.forEach((l, i) => {
      if (i > 0) this.y -= alto
      this.texto(l, MARGEN_X + 22, this.y, { tamano })
    })
    this.y -= 3
    lineasAlt.forEach((lineas, i) => {
      lineas.forEach((l, j) => {
        this.y -= alto
        if (j === 0) this.texto(String.fromCharCode(65 + i) + ')', MARGEN_X + 26, this.y, { tamano, negrita: true })
        this.texto(l, MARGEN_X + 48, this.y, { tamano })
      })
    })
    this.y -= 14
  }

  aBuffer() {
    const total = this.paginas.length
    this.paginas.forEach((ops, i) => {
      this.ops = ops
      this.linea(MARGEN_X, 44, ANCHO_PAGINA - MARGEN_X, 44, [0.88, 0.9, 0.94])
      this.texto('Aula Click · Material de preparación PAES', MARGEN_X, 30, { tamano: 8.5, color: COLOR_SUAVE })
      const pie = `Página ${i + 1} de ${total}`
      this.texto(pie, ANCHO_PAGINA - MARGEN_X - anchoTexto(pie, 8.5), 30, { tamano: 8.5, color: COLOR_SUAVE })
    })

    const objetos = []
    const agregar = (contenido) => objetos.push(contenido) // id = índice + 1
    agregar('<< /Type /Catalog /Pages 2 0 R >>')
    agregar(null) // Pages, se completa después
    agregar('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>')
    agregar('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>')
    agregar('<< /Type /Font /Subtype /Type1 /BaseFont /Symbol >>')
    agregar(`<< /Title ${literal([...this.titulo].map(byteWinAnsi))} /Producer (Aula Click) >>`)

    const kids = []
    for (const ops of this.paginas) {
      const flujo = ops.join('\n')
      agregar(`<< /Length ${Buffer.byteLength(flujo, 'latin1')} >>\nstream\n${flujo}\nendstream`)
      const idContenido = objetos.length
      agregar(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${ANCHO_PAGINA} ${ALTO_PAGINA}] ` +
          `/Contents ${idContenido} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> >>`
      )
      kids.push(`${objetos.length} 0 R`)
    }
    objetos[1] = `<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${kids.length} >>`

    let pdf = '%PDF-1.4\n%\xe2\xe3\xcf\xd3\n'
    const offsets = []
    objetos.forEach((obj, i) => {
      offsets.push(Buffer.byteLength(pdf, 'latin1'))
      pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`
    })
    const xref = Buffer.byteLength(pdf, 'latin1')
    pdf += `xref\n0 ${objetos.length + 1}\n0000000000 65535 f \n`
    for (const off of offsets) pdf += String(off).padStart(10, '0') + ' 00000 n \n'
    pdf += `trailer\n<< /Size ${objetos.length + 1} /Root 1 0 R /Info 6 0 R >>\nstartxref\n${xref}\n%%EOF`
    return Buffer.from(pdf, 'latin1')
  }
}
