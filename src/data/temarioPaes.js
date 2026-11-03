// Temario PAES (DEMRE) organizado por asignatura de Aula Click.
// `temas` contiene los id de la tabla `temas` que cubren cada contenido;
// un arreglo vacío significa que el contenido aún no tiene material en la plataforma.
// Fuente: temarios PAES Regular publicados por el DEMRE (portaldemre.demre.cl).

export const TEMARIO_PAES = {
  matemática: {
    pruebas: [
      {
        nombre: 'Competencia Matemática 1 (M1)',
        tipo: 'Obligatoria',
        ejes: [
          {
            nombre: 'Números',
            contenidos: [
              { nombre: 'Números enteros: operatoria y orden', temas: [2, 3] },
              { nombre: 'Números racionales', temas: [32] },
              { nombre: 'Porcentaje', temas: [33] },
              { nombre: 'Potencias y raíces enésimas', temas: [1, 4] },
            ],
          },
          {
            nombre: 'Álgebra y funciones',
            contenidos: [
              { nombre: 'Expresiones algebraicas, productos notables y factorización', temas: [37] },
              { nombre: 'Proporcionalidad directa e inversa', temas: [38] },
              { nombre: 'Ecuaciones e inecuaciones de primer grado', temas: [39] },
              { nombre: 'Sistemas de ecuaciones lineales (2×2)', temas: [40] },
              { nombre: 'Función lineal y afín', temas: [5] },
              { nombre: 'Función cuadrática', temas: [6] },
            ],
          },
          {
            nombre: 'Geometría',
            contenidos: [
              { nombre: 'Teorema de Pitágoras, perímetros y áreas de figuras planas', temas: [8, 10] },
              { nombre: 'Áreas y volúmenes de cuerpos geométricos', temas: [10] },
              { nombre: 'Transformaciones isométricas', temas: [41] },
              { nombre: 'Semejanza, proporcionalidad y homotecia', temas: [42] },
            ],
          },
          {
            nombre: 'Probabilidad y estadística',
            contenidos: [
              { nombre: 'Representación de datos en tablas y gráficos', temas: [13] },
              { nombre: 'Medidas de tendencia central y de posición', temas: [13] },
              { nombre: 'Reglas de las probabilidades (aditiva y multiplicativa)', temas: [43] },
            ],
          },
        ],
      },
      {
        nombre: 'Competencia Matemática 2 (M2)',
        tipo: 'Electiva',
        ejes: [
          {
            nombre: 'Números',
            contenidos: [
              { nombre: 'Números reales', temas: [34] },
              { nombre: 'Matemática financiera', temas: [35] },
              { nombre: 'Logaritmos', temas: [36] },
            ],
          },
          {
            nombre: 'Álgebra y funciones',
            contenidos: [
              { nombre: 'Sistemas de ecuaciones lineales: análisis de soluciones', temas: [40] },
              { nombre: 'Función potencia y modelos de crecimiento', temas: [7] },
            ],
          },
          {
            nombre: 'Geometría',
            contenidos: [
              { nombre: 'Razones trigonométricas en el triángulo rectángulo', temas: [9] },
              { nombre: 'Relaciones métricas en la circunferencia', temas: [8] },
            ],
          },
          {
            nombre: 'Probabilidad y estadística',
            contenidos: [
              { nombre: 'Medidas de dispersión', temas: [13] },
              { nombre: 'Probabilidad condicional', temas: [44] },
              { nombre: 'Permutaciones y combinatoria', temas: [45] },
              { nombre: 'Variable aleatoria y modelo binomial', temas: [11, 12] },
            ],
          },
        ],
      },
    ],
  },

  lenguaje: {
    pruebas: [
      {
        nombre: 'Competencia Lectora',
        tipo: 'Obligatoria',
        ejes: [
          {
            nombre: 'Habilidades evaluadas',
            contenidos: [
              { nombre: 'Localizar información explícita', temas: [14] },
              { nombre: 'Interpretar: inferir, sintetizar y relacionar', temas: [14, 16, 17] },
              { nombre: 'Evaluar: juzgar el contenido y la forma de un texto', temas: [18] },
            ],
          },
          {
            nombre: 'Textos literarios',
            contenidos: [
              { nombre: 'Textos narrativos (cuentos y fragmentos de novela)', temas: [17] },
              { nombre: 'Textos líricos y recursos del lenguaje figurado', temas: [16] },
            ],
          },
          {
            nombre: 'Textos no literarios',
            contenidos: [
              { nombre: 'Textos expositivos e informativos (noticias, reportajes, infografías)', temas: [14] },
              { nombre: 'Textos argumentativos (columnas, editoriales, cartas al director)', temas: [18] },
              { nombre: 'Discursos y textos de origen oral', temas: [15] },
            ],
          },
        ],
      },
    ],
  },

  ciencias: {
    pruebas: [
      {
        nombre: 'Ciencias (módulo común + módulo electivo)',
        tipo: 'Electiva',
        ejes: [
          {
            nombre: 'Biología',
            contenidos: [
              { nombre: 'Organización, estructura y actividad celular', temas: [46] },
              { nombre: 'Procesos y funciones biológicas', temas: [47] },
              { nombre: 'Herencia, genética y evolución', temas: [28] },
              { nombre: 'Organismo y ambiente', temas: [48] },
            ],
          },
          {
            nombre: 'Física',
            contenidos: [
              { nombre: 'Ondas: sonido y luz', temas: [49] },
              { nombre: 'Mecánica: movimiento y fuerzas', temas: [24, 25] },
              { nombre: 'Energía: trabajo, potencia y conservación', temas: [25] },
              { nombre: 'Electricidad y magnetismo', temas: [50] },
              { nombre: 'La Tierra y el universo', temas: [51] },
            ],
          },
          {
            nombre: 'Química',
            contenidos: [
              { nombre: 'Estructura atómica, tabla periódica y enlace químico', temas: [52] },
              { nombre: 'Química orgánica', temas: [53] },
              { nombre: 'Reacciones químicas', temas: [27] },
              { nombre: 'Estequiometría', temas: [26] },
              { nombre: 'Disoluciones', temas: [54] },
            ],
          },
        ],
      },
    ],
  },

  historia: {
    pruebas: [
      {
        nombre: 'Historia y Ciencias Sociales',
        tipo: 'Electiva',
        ejes: [
          {
            nombre: 'Historia: Mundo, América y Chile',
            contenidos: [
              { nombre: 'Construcción del Estado nación en Chile y América (siglo XIX)', temas: [55] },
              { nombre: 'Crisis, totalitarismos y guerras mundiales (primera mitad del siglo XX)', temas: [31] },
              { nombre: 'Crisis de 1929 y transformaciones económicas', temas: [30] },
              { nombre: 'Guerra Fría y América Latina', temas: [56] },
              { nombre: 'Chile en el siglo XX: reformas, quiebre y recuperación de la democracia', temas: [29] },
            ],
          },
          {
            nombre: 'Formación ciudadana',
            contenidos: [
              { nombre: 'Estado de derecho, democracia y Constitución', temas: [57] },
              { nombre: 'Derechos humanos', temas: [58] },
              { nombre: 'Participación ciudadana', temas: [59] },
            ],
          },
          {
            nombre: 'Sistema económico',
            contenidos: [
              { nombre: 'El problema económico y el funcionamiento del mercado', temas: [30] },
              { nombre: 'Rol del Estado en la economía', temas: [30] },
            ],
          },
        ],
      },
    ],
  },

  inglés: {
    nota:
      'La PAES no incluye una prueba de Inglés. Estos contenidos te ayudan con tu desempeño escolar y con la lectura de textos y fuentes en inglés.',
    pruebas: [],
  },
}

export function getTemarioPaes(nombreAsignatura) {
  return TEMARIO_PAES[(nombreAsignatura || '').toLowerCase()] || null
}
