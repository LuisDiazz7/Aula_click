-- ============================================================
-- Aula Click - Contenido de estudio para los 31 subtemas
-- 1) Agrega id_youtube y canal a `videos` (miniaturas reales).
-- 2) Agrega tiempo_segundos a `respuestas_estudiante`.
-- 3) Siembra cursos, asignaturas, ramas, temas, videos, pdfs
--    y ejercitación (5 preguntas por subtema).
-- ============================================================

-- ---------- Esquema ----------
ALTER TABLE videos ADD COLUMN IF NOT EXISTS id_youtube text;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS canal text;

ALTER TABLE respuestas_estudiante ADD COLUMN IF NOT EXISTS tiempo_segundos integer;

-- ---------- Cursos ----------
INSERT INTO cursos (id, nombre) VALUES
  (1, '3° y 4° Medio');

-- ---------- Asignaturas ----------
INSERT INTO asignaturas (id, nombre, descripcion) VALUES
  (1, 'Matemática', 'Números, álgebra, funciones, geometría, probabilidad y estadística.'),
  (2, 'Lenguaje', 'Comprensión de textos, comunicación oral, literatura chilena y argumentación.'),
  (3, 'Inglés', 'Estrategias de lectura, gramática y vocabulario en inglés.'),
  (4, 'Ciencias', 'Física, química y biología en la vida cotidiana.'),
  (5, 'Historia', 'Chile y el mundo contemporáneo: historia, economía y sociedad.');

INSERT INTO asignatura_curso (id, id_asignatura, id_curso) VALUES
  (1, 1, 1), (2, 2, 1), (3, 3, 1), (4, 4, 1), (5, 5, 1);

-- ---------- Ramas ----------
INSERT INTO ramas (id, nombre, id_asignatura) VALUES
  (1,  'Números', 1),
  (2,  'Álgebra y funciones', 1),
  (3,  'Geometría', 1),
  (4,  'Probabilidad y estadística', 1),
  (5,  'Comprensión y comunicación', 2),
  (6,  'Literatura chilena', 2),
  (7,  'Argumentación', 2),
  (8,  'Estrategias de lectura', 3),
  (9,  'Gramática', 3),
  (10, 'Vocabulario', 3),
  (11, 'Física', 4),
  (12, 'Química', 4),
  (13, 'Biología', 4),
  (14, 'Historia de Chile', 5);

-- ---------- Temas (31 subtemas) ----------
INSERT INTO temas (id, nombre, id_rama) VALUES
  (1,  'Potencias', 1),
  (2,  'Suma y resta de números enteros', 1),
  (3,  'Multiplicación y división de números enteros', 1),
  (4,  'Propiedades de las potencias', 1),
  (5,  'Función lineal', 2),
  (6,  'Función cuadrática', 2),
  (7,  'Función exponencial', 2),
  (8,  'Círculo y circunferencia', 3),
  (9,  'Trigonometría', 3),
  (10, 'Áreas y volúmenes', 3),
  (11, 'Variable aleatoria', 4),
  (12, 'Distribución binomial', 4),
  (13, 'Estadística descriptiva', 4),
  (14, 'Textos escritos', 5),
  (15, 'Textos orales', 5),
  (16, 'Poesía chilena', 6),
  (17, 'Narrativa chilena', 6),
  (18, 'Debate y argumentación', 7),
  (19, 'Skimming and scanning', 8),
  (20, 'Reading strategies', 8),
  (21, 'Verb tenses', 9),
  (22, 'Conditionals', 9),
  (23, 'Idioms', 10),
  (24, 'Movimiento rectilíneo uniforme', 11),
  (25, 'Fuerza y energía', 11),
  (26, 'Estequiometría', 12),
  (27, 'Reacciones químicas', 12),
  (28, 'Genética', 13),
  (29, 'Chile contemporáneo', 14),
  (30, 'Economía del siglo XX', 14),
  (31, 'Guerras mundiales', 14);

-- ---------- Videos (2 por tema, con id_youtube validado) ----------
INSERT INTO videos (id, titulo, descripcion, url, id_tema, id_youtube, canal) VALUES
  (1,   'Potenciación de números enteros', 'Aprende a calcular potencias de números enteros paso a paso.', 'https://www.youtube.com/watch?v=mpwEQ3usaEc', 1, 'mpwEQ3usaEc', 'Matemáticas profe Alex'),
  (2,   'Potencias y raíces de números enteros', 'Explicación de potenciación y radicación de números enteros.', 'https://www.youtube.com/watch?v=fsyWnIfFtkw', 1, 'fsyWnIfFtkw', 'Matemáticas Mister Juan'),
  (3,   'Suma y resta de números enteros: método debo y tengo', 'Resuelve sumas y restas de enteros con el método debo y tengo.', 'https://www.youtube.com/watch?v=dayfz0ff1Mc', 2, 'dayfz0ff1Mc', 'Daniel Carreón'),
  (4,   'Operaciones con números enteros: curso desde cero', 'Curso completo de operaciones con números enteros.', 'https://www.youtube.com/watch?v=ATltlvh10nc', 2, 'ATltlvh10nc', 'Matemáticas con Juan'),
  (5,   'Multiplicación y división de números enteros: regla de los signos', 'Multiplica y divide enteros usando la regla de los signos.', 'https://www.youtube.com/watch?v=4mlK7a4Un4Q', 3, '4mlK7a4Un4Q', 'Alejo Mates'),
  (6,   'Regla de los signos: multiplicación y división de enteros', 'Domina la regla de los signos aplicada a multiplicación y división.', 'https://www.youtube.com/watch?v=FQgsoA0mGUs', 3, 'FQgsoA0mGUs', 'Agus el profe'),
  (7,   'Propiedades de la potenciación', 'Repaso de todas las propiedades de la potenciación.', 'https://www.youtube.com/watch?v=tA94S33kxm8', 4, 'tA94S33kxm8', 'Matemáticas profe Alex'),
  (8,   'Propiedades de las potencias', 'Aprende las propiedades de las potencias con ejemplos.', 'https://www.youtube.com/watch?v=y12Op8QMjHs', 4, 'y12Op8QMjHs', 'Susi Profe'),
  (9,   '¿Qué es la función lineal? Explicación sencilla', 'Introducción a la función lineal y su representación.', 'https://www.youtube.com/watch?v=PnATAsxu_oo', 5, 'PnATAsxu_oo', 'Andrey Trejos - Mate para secundaria'),
  (10,  'Función lineal: pendiente de la recta', 'Interpreta la pendiente de la recta en la función lineal.', 'https://www.youtube.com/watch?v=FFwtzhkUASw', 5, 'FFwtzhkUASw', 'Profe Luis Conchas'),
  (11,  'Función cuadrática: explicación completa y cómo graficarla', 'Conceptos y grafeno de la función cuadrática.', 'https://www.youtube.com/watch?v=svqAxfMPw7Q', 6, 'svqAxfMPw7Q', 'Ticmas Educación'),
  (12,  'Función cuadrática y parábola: vértice y apertura', 'Vértice y apertura de la parábola explicados.', 'https://www.youtube.com/watch?v=jv7EvIt4ZqE', 6, 'jv7EvIt4ZqE', 'Aprende con Hector'),
  (13,  'Función exponencial: características', 'Características principales de la función exponencial.', 'https://www.youtube.com/watch?v=IhsZKreUPE0', 7, 'IhsZKreUPE0', 'Matemáticas profe Alex'),
  (14,  '¿Qué es una función exponencial?', 'Concepto de función exponencial con ejemplos.', 'https://www.youtube.com/watch?v=dPaeE4YZsYc', 7, 'dPaeE4YZsYc', 'Pi-ensa Matematik'),
  (15,  '¿Qué es el círculo y la circunferencia?', 'Diferencia entre círculo y circunferencia y sus elementos.', 'https://www.youtube.com/watch?v=hFnfUmgu7Wo', 8, 'hFnfUmgu7Wo', 'Aprende con Luis'),
  (16,  'Geometría: círculo y circunferencia, tipos y elementos', 'Tipos y elementos del círculo y la circunferencia.', 'https://www.youtube.com/watch?v=5ufTi4j5Pgg', 8, '5ufTi4j5Pgg', 'TuProfeVirtual'),
  (17,  'Razones trigonométricas: ángulos de 30, 60 y 45 grados', 'Razones trigonométricas de ángulos notables.', 'https://www.youtube.com/watch?v=WGesrfNbggs', 9, 'WGesrfNbggs', 'Bego Profe'),
  (18,  'Why is trigonometry so important?', 'Por qué es importante la trigonometría. En inglés.', 'https://www.youtube.com/watch?v=VjdCDZ0f3s4', 9, 'VjdCDZ0f3s4', 'Eddie Woo'),
  (19,  'Perímetro, área y volumen: super fácil para principiantes', 'Conceptos de perímetro, área y volumen con ejemplos.', 'https://www.youtube.com/watch?v=yY5beo7bXao', 10, 'yY5beo7bXao', 'Daniel Carreón'),
  (20,  'Perímetro, área y volumen de figuras geométricas', 'Cálculo de perímetro, área y volumen de figuras.', 'https://www.youtube.com/watch?v=np7lvxEF_08', 10, 'np7lvxEF_08', 'Matemáticas con Juan'),
  (21,  'Variables aleatorias discretas y continuas: ejemplos', 'Clasificación de variables aleatorias con ejemplos.', 'https://www.youtube.com/watch?v=_wonmKS4Blk', 11, '_wonmKS4Blk', 'Matemóvil'),
  (22,  'Variables discretas y continuas: ejemplos y ejercicios', 'Ejercicios resueltos de variables discretas y continuas.', 'https://www.youtube.com/watch?v=fMW5S6JdMzg', 11, 'fMW5S6JdMzg', 'Matemóvil'),
  (23,  'Distribución binomial explicada fácil con ejemplos', 'Concepto y ejemplos de la distribución binomial.', 'https://www.youtube.com/watch?v=VJLLzBt3upc', 12, 'VJLLzBt3upc', 'AulaDeEconomia'),
  (24,  'Distribución binomial (UPV)', 'Clase universitaria de distribución binomial.', 'https://www.youtube.com/watch?v=lpEpH_QxGBs', 12, 'lpEpH_QxGBs', 'Universitat Politècnica de València - UPV'),
  (25,  'Medidas de tendencia central: media, mediana y moda', 'Cálculo e interpretación de media, mediana y moda.', 'https://www.youtube.com/watch?v=dfxCsCZ1c3A', 13, 'dfxCsCZ1c3A', 'Matemáticas profe Alex'),
  (26,  'Medidas de tendencia central: media, mediana y moda', 'Media, mediana y moda con ejemplos paso a paso.', 'https://www.youtube.com/watch?v=Ss6l9ebiCxE', 13, 'Ss6l9ebiCxE', 'Matemática Sin Fronteras'),
  (27,  'Estrategias de comprensión lectora', 'Estrategias para comprender mejor los textos escritos.', 'https://www.youtube.com/watch?v=okCPE6HYKn8', 14, 'okCPE6HYKn8', 'CANALEDUCA CHILE'),
  (28,  'Estrategias para la comprensión lectora de textos', 'Técnicas para la comprensión lectora de distintos textos.', 'https://www.youtube.com/watch?v=lzDaBQP5V1o', 14, 'lzDaBQP5V1o', 'Rocio Carreon'),
  (29,  'Comunicación oral y escrita: diferencias', 'Diferencias entre comunicación oral y escrita.', 'https://www.youtube.com/watch?v=JiM6f6z1lxA', 15, 'JiM6f6z1lxA', 'Astraway'),
  (30,  'Estrategias para desarrollar la expresión y comunicación oral', 'Técnicas para mejorar la expresión oral.', 'https://www.youtube.com/watch?v=AvLXjOIoSe0', 15, 'AvLXjOIoSe0', 'Gerencia de Desarrollo Humano MML'),
  (31,  'Poesía chilena: modelo para armar', 'Conversación sobre poesía chilena con Soledad Bianchi.', 'https://www.youtube.com/watch?v=JkQ1ou8jEBo', 16, 'JkQ1ou8jEBo', 'Centro para las Humanidades UDP'),
  (32,  'Poesía chilena: a 50 años, con David Rencoret', 'Programa sobre la poesía chilena.', 'https://www.youtube.com/watch?v=tMCrYcTtOAo', 16, 'tMCrYcTtOAo', 'paraleerenlibertad'),
  (33,  '5 escritores chilenos fundamentales', 'Repaso de escritores chilenos imprescindibles.', 'https://www.youtube.com/watch?v=896S4RWLGR4', 17, '896S4RWLGR4', 'Recomiéndame un libro'),
  (34,  'Descubre a los grandes escritores de Chile', 'Panorama de la narrativa chilena y sus autores.', 'https://www.youtube.com/watch?v=fpm6VbYJRZ0', 17, 'fpm6VbYJRZ0', 'Parlamento Andino TV'),
  (35,  'Cómo argumentar en 5 pasos', 'Método práctico para construir argumentos.', 'https://www.youtube.com/watch?v=L62ZXHuXjP4', 18, 'L62ZXHuXjP4', 'En prosa Podcast'),
  (36,  'Speech & debate tips: the PREP method', 'Método PREP para estructurar intervenciones. En inglés.', 'https://www.youtube.com/watch?v=MuVZAXflPAk', 18, 'MuVZAXflPAk', 'My Speech and Debate Coach'),
  (37,  'Differences between skimming and scanning', 'Diferencia entre lectura rápida global y búsqueda de información.', 'https://www.youtube.com/watch?v=VZHZ1s7S8RE', 19, 'VZHZ1s7S8RE', 'Thesis Helper'),
  (38,  'How to use skimming and scanning in reading', 'Cómo aplicar skimming y scanning en la lectura.', 'https://www.youtube.com/watch?v=mbsAtyoNIpU', 19, 'mbsAtyoNIpU', 'Netteum'),
  (39,  'Las 7 mejores técnicas de comprensión lectora', 'Técnicas prácticas de comprensión lectora.', 'https://www.youtube.com/watch?v=TmtJZGI18R0', 20, 'TmtJZGI18R0', 'Pablo Lomeli'),
  (40,  'Reading comprehension strategies that work', 'Estrategias de comprensión lectora que funcionan. En inglés.', 'https://www.youtube.com/watch?v=8Y8Mb2RuvDM', 20, '8Y8Mb2RuvDM', 'Kathleen Jasper'),
  (41,  'Learn all English verb tenses (easiest method)', 'Todos los tiempos verbales del inglés con el método más fácil.', 'https://www.youtube.com/watch?v=sCiG6rlk2Bc', 21, 'sCiG6rlk2Bc', 'Brian Wiles'),
  (42,  'All 12 English tenses explained: complete grammar guide', 'Guía completa de los 12 tiempos verbales en inglés.', 'https://www.youtube.com/watch?v=r5SlDWK-9CI', 21, 'r5SlDWK-9CI', 'CodeLucky'),
  (43,  'The first conditional: 6 minute grammar', 'El primer condicional explicado en inglés.', 'https://www.youtube.com/watch?v=8VETylIxyhw', 22, '8VETylIxyhw', 'BBC Learning English'),
  (44,  'The second conditional: 6 minute grammar', 'El segundo condicional explicado en inglés.', 'https://www.youtube.com/watch?v=3OuqzHxlrHc', 22, '3OuqzHxlrHc', 'BBC Learning English'),
  (45,  'English idioms in movies and TV shows', 'Aprende idioms ingleses con escenas de películas.', 'https://www.youtube.com/watch?v=4b4zbCHB4gM', 23, '4b4zbCHB4gM', 'Learzing'),
  (46,  '150 common idioms in English', '150 idioms comunes del inglés con ejemplos.', 'https://www.youtube.com/watch?v=Zj_KPW6RMa4', 23, 'Zj_KPW6RMa4', 'English Like A Native'),
  (47,  'MRU: movimiento rectilíneo uniforme, explicación y ejercicios', 'Conceptos y ejercicios de movimiento rectilíneo uniforme.', 'https://www.youtube.com/watch?v=wc3scVd1JYI', 24, 'wc3scVd1JYI', 'Clases Particulares en Ávila'),
  (48,  'Movimiento rectilíneo uniforme: introducción', 'Introducción al movimiento rectilíneo uniforme.', 'https://www.youtube.com/watch?v=ylErHxQjodw', 24, 'ylErHxQjodw', 'Matemáticas profe Alex'),
  (49,  'La energía cinética y la energía potencial', 'Conceptos de energía cinética y energía potencial.', 'https://www.youtube.com/watch?v=VpMeJ9Q7O3g', 25, 'VpMeJ9Q7O3g', 'Clases Medio Ambiente'),
  (50,  'Trabajo, energía y potencia en física: curso desde cero', 'Curso desde cero de trabajo, energía y potencia.', 'https://www.youtube.com/watch?v=nSYCcJESDrU', 25, 'nSYCcJESDrU', 'Matemáticas con Juan'),
  (51,  '¿Qué es la estequiometría? Explicación fácil con ejemplos', 'Concepto de estequiometría y cálculos básicos.', 'https://www.youtube.com/watch?v=D3VvhxPtSOE', 26, 'D3VvhxPtSOE', 'AltumX Educación'),
  (52,  'Estequiometría: aprende fácil y sencillo todos los cálculos', 'Todos los cálculos estequiométricos explicados.', 'https://www.youtube.com/watch?v=BJCY3j0SDXw', 26, 'BJCY3j0SDXw', 'ARRIBA LA CIENCIA'),
  (53,  'Types of chemical reactions (tipos de reacciones químicas)', 'Tipos de reacciones químicas. En inglés.', 'https://www.youtube.com/watch?v=aMU1RaRulSo', 27, 'aMU1RaRulSo', 'Tyler DeWitt'),
  (54,  'Tipos de reacciones químicas', 'Clasificación de las reacciones químicas en español.', 'https://www.youtube.com/watch?v=MLcHCEnBKmo', 27, 'MLcHCEnBKmo', 'Es Ciencia'),
  (55,  'El ADN, explicación fácil', 'Qué es el ADN y cómo funciona, explicado fácil.', 'https://www.youtube.com/watch?v=dfR486-4ERU', 28, 'dfR486-4ERU', 'Ticmas Educación'),
  (56,  'Herencia genética: Biología - Educatina', 'Cómo se transmiten los caracteres hereditarios.', 'https://www.youtube.com/watch?v=21Cm3Xoz2tM', 28, '21Cm3Xoz2tM', 'Flex Flix Teens en Español'),
  (57,  'Resumen de siglo XX en Chile: mirada global', 'Panorama del siglo XX en Chile para PAES.', 'https://www.youtube.com/watch?v=xwIN2DdOyhE', 29, 'xwIN2DdOyhE', 'Preu Cpech Canal Oficial'),
  (58,  'Chile: history, geography, economy and culture', 'Historia y características de Chile. En inglés.', 'https://www.youtube.com/watch?v=gGfBc4N86mA', 29, 'gGfBc4N86mA', 'Geodiode'),
  (59,  'La gran depresión de 1929: la mayor crisis económica', 'Causas y consecuencias de la crisis de 1929.', 'https://www.youtube.com/watch?v=6HQmWAvhDMo', 30, '6HQmWAvhDMo', 'Inverbots Español'),
  (60,  'La gran depresión de 1929: de millonarios a la quiebra total', 'La crisis de 1929 y sus efectos en el mundo.', 'https://www.youtube.com/watch?v=7coLfDELuB8', 30, '7coLfDELuB8', 'Infonimados'),
  (61,  'La primera guerra mundial resumida en 30 minutos', 'Resumen completo de la Primera Guerra Mundial.', 'https://www.youtube.com/watch?v=_4eAB6DG83g', 31, '_4eAB6DG83g', 'Memorias de Pez'),
  (62,  'La segunda guerra mundial en 15 minutos', 'Resumen de la Segunda Guerra Mundial.', 'https://www.youtube.com/watch?v=sRi0bCjnMFs', 31, 'sRi0bCjnMFs', 'Memorias de Pez');

-- ---------- PDFs (guía y ejercicios por tema) ----------
INSERT INTO pdfs (id, titulo, descripcion, url, id_tema)
  SELECT
    gp.pid,
    gp.p_titulo,
    gp.p_desc,
    gp.p_url,
    gp.p_id_tema
  FROM (
    -- guía de estudio
    VALUES
      (1,   'Guía de Potencias', 'Resumen con los conceptos clave del tema.', '/materiales/potencias/guia.pdf', 1),
      (3,   'Guía de Suma y resta de enteros', 'Resumen con los conceptos clave del tema.', '/materiales/suma-resta-enteros/guia.pdf', 2),
      (5,   'Guía de Multiplicación y división de enteros', 'Resumen con los conceptos clave del tema.', '/materiales/multiplicacion-division-enteros/guia.pdf', 3),
      (7,   'Guía de Propiedades de las potencias', 'Resumen con los conceptos clave del tema.', '/materiales/propiedades-potencias/guia.pdf', 4),
      (9,   'Guía de Función lineal', 'Resumen con los conceptos clave del tema.', '/materiales/funcion-lineal/guia.pdf', 5),
      (11,  'Guía de Función cuadrática', 'Resumen con los conceptos clave del tema.', '/materiales/funcion-cuadratica/guia.pdf', 6),
      (13,  'Guía de Función exponencial', 'Resumen con los conceptos clave del tema.', '/materiales/funcion-exponencial/guia.pdf', 7),
      (15,  'Guía de Círculo y circunferencia', 'Resumen con los conceptos clave del tema.', '/materiales/circulo-circunferencia/guia.pdf', 8),
      (17,  'Guía de Trigonometría', 'Resumen con los conceptos clave del tema.', '/materiales/trigonometria/guia.pdf', 9),
      (19,  'Guía de Áreas y volúmenes', 'Resumen con los conceptos clave del tema.', '/materiales/areas-volumenes/guia.pdf', 10),
      (21,  'Guía de Variable aleatoria', 'Resumen con los conceptos clave del tema.', '/materiales/variable-aleatoria/guia.pdf', 11),
      (23,  'Guía de Distribución binomial', 'Resumen con los conceptos clave del tema.', '/materiales/distribucion-binomial/guia.pdf', 12),
      (25,  'Guía de Estadística descriptiva', 'Resumen con los conceptos clave del tema.', '/materiales/estadistica-descriptiva/guia.pdf', 13),
      (27,  'Guía de Textos escritos', 'Resumen con los conceptos clave del tema.', '/materiales/textos-escritos/guia.pdf', 14),
      (29,  'Guía de Textos orales', 'Resumen con los conceptos clave del tema.', '/materiales/textos-orales/guia.pdf', 15),
      (31,  'Guía de Poesía chilena', 'Resumen con los conceptos clave del tema.', '/materiales/poesia-chilena/guia.pdf', 16),
      (33,  'Guía de Narrativa chilena', 'Resumen con los conceptos clave del tema.', '/materiales/narrativa-chilena/guia.pdf', 17),
      (35,  'Guía de Debate y argumentación', 'Resumen con los conceptos clave del tema.', '/materiales/debate-argumentacion/guia.pdf', 18),
      (37,  'Guía de Skimming and scanning', 'Resumen con los conceptos clave del tema.', '/materiales/skimming-scanning/guia.pdf', 19),
      (39,  'Guía de Reading strategies', 'Resumen con los conceptos clave del tema.', '/materiales/reading-strategies/guia.pdf', 20),
      (41,  'Guía de Verb tenses', 'Resumen con los conceptos clave del tema.', '/materiales/verb-tenses/guia.pdf', 21),
      (43,  'Guía de Conditionals', 'Resumen con los conceptos clave del tema.', '/materiales/conditionals/guia.pdf', 22),
      (45,  'Guía de Idioms', 'Resumen con los conceptos clave del tema.', '/materiales/idioms/guia.pdf', 23),
      (47,  'Guía de Movimiento rectilíneo uniforme', 'Resumen con los conceptos clave del tema.', '/materiales/movimiento-rectilineo/guia.pdf', 24),
      (49,  'Guía de Fuerza y energía', 'Resumen con los conceptos clave del tema.', '/materiales/fuerza-energia/guia.pdf', 25),
      (51,  'Guía de Estequiometría', 'Resumen con los conceptos clave del tema.', '/materiales/estequiometria/guia.pdf', 26),
      (53,  'Guía de Reacciones químicas', 'Resumen con los conceptos clave del tema.', '/materiales/reacciones-quimicas/guia.pdf', 27),
      (55,  'Guía de Genética', 'Resumen con los conceptos clave del tema.', '/materiales/genetica/guia.pdf', 28),
      (57,  'Guía de Chile contemporáneo', 'Resumen con los conceptos clave del tema.', '/materiales/chile-contemporaneo/guia.pdf', 29),
      (59,  'Guía de Economía del siglo XX', 'Resumen con los conceptos clave del tema.', '/materiales/economia-siglo-xx/guia.pdf', 30),
      (61,  'Guía de Guerras mundiales', 'Resumen con los conceptos clave del tema.', '/materiales/guerras-mundiales/guia.pdf', 31)
  ) AS gp(pid, p_titulo, p_desc, p_url, p_id_tema)

  UNION ALL

  SELECT
    ep.pid,
    ep.p_titulo,
    ep.p_desc,
    ep.p_url,
    ep.p_id_tema
  FROM (
    -- ejercicios adicionales
    VALUES
      (2,   'Ejercicios adicionales: Potencias', 'Problemas propuestos con solucionario.', '/materiales/potencias/ejercicios.pdf', 1),
      (4,   'Ejercicios adicionales: Suma y resta de enteros', 'Problemas propuestos con solucionario.', '/materiales/suma-resta-enteros/ejercicios.pdf', 2),
      (6,   'Ejercicios adicionales: Multiplicación y división de enteros', 'Problemas propuestos con solucionario.', '/materiales/multiplicacion-division-enteros/ejercicios.pdf', 3),
      (8,   'Ejercicios adicionales: Propiedades de las potencias', 'Problemas propuestos con solucionario.', '/materiales/propiedades-potencias/ejercicios.pdf', 4),
      (10,  'Ejercicios adicionales: Función lineal', 'Problemas propuestos con solucionario.', '/materiales/funcion-lineal/ejercicios.pdf', 5),
      (12,  'Ejercicios adicionales: Función cuadrática', 'Problemas propuestos con solucionario.', '/materiales/funcion-cuadratica/ejercicios.pdf', 6),
      (14,  'Ejercicios adicionales: Función exponencial', 'Problemas propuestos con solucionario.', '/materiales/funcion-exponencial/ejercicios.pdf', 7),
      (16,  'Ejercicios adicionales: Círculo y circunferencia', 'Problemas propuestos con solucionario.', '/materiales/circulo-circunferencia/ejercicios.pdf', 8),
      (18,  'Ejercicios adicionales: Trigonometría', 'Problemas propuestos con solucionario.', '/materiales/trigonometria/ejercicios.pdf', 9),
      (20,  'Ejercicios adicionales: Áreas y volúmenes', 'Problemas propuestos con solucionario.', '/materiales/areas-volumenes/ejercicios.pdf', 10),
      (22,  'Ejercicios adicionales: Variable aleatoria', 'Problemas propuestos con solucionario.', '/materiales/variable-aleatoria/ejercicios.pdf', 11),
      (24,  'Ejercicios adicionales: Distribución binomial', 'Problemas propuestos con solucionario.', '/materiales/distribucion-binomial/ejercicios.pdf', 12),
      (26,  'Ejercicios adicionales: Estadística descriptiva', 'Problemas propuestos con solucionario.', '/materiales/estadistica-descriptiva/ejercicios.pdf', 13),
      (28,  'Ejercicios adicionales: Textos escritos', 'Problemas propuestos con solucionario.', '/materiales/textos-escritos/ejercicios.pdf', 14),
      (30,  'Ejercicios adicionales: Textos orales', 'Problemas propuestos con solucionario.', '/materiales/textos-orales/ejercicios.pdf', 15),
      (32,  'Ejercicios adicionales: Poesía chilena', 'Problemas propuestos con solucionario.', '/materiales/poesia-chilena/ejercicios.pdf', 16),
      (34,  'Ejercicios adicionales: Narrativa chilena', 'Problemas propuestos con solucionario.', '/materiales/narrativa-chilena/ejercicios.pdf', 17),
      (36,  'Ejercicios adicionales: Debate y argumentación', 'Problemas propuestos con solucionario.', '/materiales/debate-argumentacion/ejercicios.pdf', 18),
      (38,  'Ejercicios adicionales: Skimming and scanning', 'Problemas propuestos con solucionario.', '/materiales/skimming-scanning/ejercicios.pdf', 19),
      (40,  'Ejercicios adicionales: Reading strategies', 'Problemas propuestos con solucionario.', '/materiales/reading-strategies/ejercicios.pdf', 20),
      (42,  'Ejercicios adicionales: Verb tenses', 'Problemas propuestos con solucionario.', '/materiales/verb-tenses/ejercicios.pdf', 21),
      (44,  'Ejercicios adicionales: Conditionals', 'Problemas propuestos con solucionario.', '/materiales/conditionals/ejercicios.pdf', 22),
      (46,  'Ejercicios adicionales: Idioms', 'Problemas propuestos con solucionario.', '/materiales/idioms/ejercicios.pdf', 23),
      (48,  'Ejercicios adicionales: Movimiento rectilíneo uniforme', 'Problemas propuestos con solucionario.', '/materiales/movimiento-rectilineo/ejercicios.pdf', 24),
      (50,  'Ejercicios adicionales: Fuerza y energía', 'Problemas propuestos con solucionario.', '/materiales/fuerza-energia/ejercicios.pdf', 25),
      (52,  'Ejercicios adicionales: Estequiometría', 'Problemas propuestos con solucionario.', '/materiales/estequiometria/ejercicios.pdf', 26),
      (54,  'Ejercicios adicionales: Reacciones químicas', 'Problemas propuestos con solucionario.', '/materiales/reacciones-quimicas/ejercicios.pdf', 27),
      (56,  'Ejercicios adicionales: Genética', 'Problemas propuestos con solucionario.', '/materiales/genetica/ejercicios.pdf', 28),
      (58,  'Ejercicios adicionales: Chile contemporáneo', 'Problemas propuestos con solucionario.', '/materiales/chile-contemporaneo/ejercicios.pdf', 29),
      (60,  'Ejercicios adicionales: Economía del siglo XX', 'Problemas propuestos con solucionario.', '/materiales/economia-siglo-xx/ejercicios.pdf', 30),
      (62,  'Ejercicios adicionales: Guerras mundiales', 'Problemas propuestos con solucionario.', '/materiales/guerras-mundiales/ejercicios.pdf', 31)
  ) AS ep(pid, p_titulo, p_desc, p_url, p_id_tema);

-- ---------- Ejercitación (5 preguntas por subtema) ----------
INSERT INTO ejercicios (id, enunciado, id_tema, alt_a, alt_b, alt_c, alt_d, respuesta_correcta, retroalimentacion) VALUES
  -- Tema 1: Potencias
  (1,   'El valor de (−2)³ es:', 1, '8', '−8', '6', '−6', 'B', '(−2)³ = (−2)·(−2)·(−2) = −8.'),
  (2,   'El valor de (−3)² · (−3)³ es:', 1, '−243', '243', '729', '−729', 'A', 'Se suman los exponentes: (−3)⁵ = −243 porque el exponente es impar.'),
  (3,   'El valor de (−5)⁰ es:', 1, '0', '−5', '1', '5', 'C', 'Todo número distinto de 0 elevado a 0 es 1.'),
  (4,   'Al resolver (−2)⁴ : (−2)² se obtiene:', 1, '4', '−4', '16', '−16', 'A', 'Se restan exponentes: (−2)² = 4.'),
  (5,   'El valor de (−4)² − 2³ es:', 1, '8', '24', '−8', '−24', 'A', '(−4)² = 16 y 2³ = 8; entonces 16 − 8 = 8.'),

  -- Tema 2: Suma y resta de números enteros
  (6,   'El resultado de −5 + 9 es:', 2, '−4', '4', '14', '−14', 'B', '9 − 5 = 4, y el número mayor es positivo.'),
  (7,   'El resultado de −7 − (−3) es:', 2, '−10', '10', '−4', '4', 'C', 'Restar −3 equivale a sumar 3: −7 + 3 = −4.'),
  (8,   'La expresión −12 + 7 − 3 equivale a:', 2, '−8', '−2', '2', '−22', 'A', '−12 + 7 = −5 y −5 − 3 = −8.'),
  (9,   'Si la temperatura baja 6°C y luego sube 10°C, quedó en:', 2, '−4°C', '16°C', '4°C', '−16°C', 'C', '−6 + 10 = +4.'),
  (10,  'El opuesto (inverso aditivo) de −15 es:', 2, '−15', '15', '0', '1/15', 'B', 'El opuesto de un número es el que suma 0 con él: −15 + 15 = 0.'),

  -- Tema 3: Multiplicación y división de números enteros
  (11,  'El resultado de (−6) · 4 es:', 3, '−24', '24', '−10', '2', 'A', 'Signos distintos dan resultado negativo: −24.'),
  (12,  'El resultado de (−8) : (−2) es:', 3, '−4', '4', '16', '−16', 'B', 'Signos iguales dan resultado positivo: (−8):(−2) = 4.'),
  (13,  'El signo del producto (−3)·(−5)·(−2) es:', 3, 'Positivo', 'Negativo', 'Depende del orden', 'Cero', 'B', 'Hay tres factores negativos: impar, por lo tanto es negativo.'),
  (14,  'El valor de (−4) · 3 · (−2) es:', 3, '24', '−24', '−9', '9', 'A', 'Dos signos negativos dan positivo: (−4)·3 = −12 y −12·(−2) = 24.'),
  (15,  'Si a · b = 0 y a ≠ 0, entonces:', 3, 'b = 0', 'b ≠ 0', 'b = 1', 'No puede determinarse', 'A', 'Para que el producto sea 0, al menos un factor debe ser 0. Como a ≠ 0, entonces b = 0.'),

  -- Tema 4: Propiedades de las potencias
  (16,  'Al simplificar a⁵ · a⁴, con a ≠ 0, se obtiene:', 4, 'a⁹', 'a²⁰', 'a¹', 'a⁴⁵', 'A', 'Al multiplicar potencias de igual base se suman los exponentes: a⁹.'),
  (17,  'El valor de 7⁰ + 0⁷ es:', 4, '0', '1', '7', '2', 'B', '7⁰ = 1 y 0⁷ = 0; entonces 1 + 0 = 1.'),
  (18,  'Al simplificar (x³)⁴ se obtiene:', 4, 'x⁷', 'x¹²', 'x⁸¹', '3x⁴', 'B', 'Potencia de potencia: se multiplican los exponentes, x¹².'),
  (19,  'El valor de 2⁵ · 2⁻³ es:', 4, '4', '2', '8', '1/4', 'A', 'Se suman exponentes: 2² = 4.'),
  (20,  'La potencia de un producto (a·b)³ se desarrolla como:', 4, 'a³ + b³', 'a³ · b³', 'a·b³', '3·a·b', 'B', 'La potencia de un producto distribuye el exponente a cada factor.'),

  -- Tema 5: Función lineal
  (21,  'La gráfica de f(x) = 2x − 1 es:', 5, 'Una parábola', 'Una recta', 'Una circunferencia', 'Una hipérbola', 'B', 'Toda función de la forma f(x) = mx + b se representa con una recta.'),
  (22,  'La pendiente de f(x) = −3x + 2 es:', 5, '3', '−3', '2', '−2', 'B', 'En y = mx + b, m es la pendiente; aquí m = −3.'),
  (23,  'La intersección con el eje Y de f(x) = 5x + 7 es:', 5, '(0, 7)', '(0, 5)', '(7, 0)', '(5, 0)', 'A', 'La intersección con el eje Y es el punto (0, b) = (0, 7).'),
  (24,  'La pendiente de la recta que pasa por (1, 2) y (3, 6) es:', 5, '1', '2', '3', '4', 'B', 'm = (6 − 2)/(3 − 1) = 4/2 = 2.'),
  (25,  'En f(x) = mx + b, si m > 0 la recta es:', 5, 'Decreciente', 'Creciente', 'Horizontal', 'Vertical', 'B', 'Con pendiente positiva la función crece al aumentar x.'),

  -- Tema 6: Función cuadrática
  (26,  'La suma de las raíces de f(x) = x² − 2x − 3 es:', 6, '2', '−2', '3', '−3', 'A', 'Las raíces son 3 y −1; su suma es 2 (−b/a).'),
  (27,  'El vértice de f(x) = x² − 4x + 1 es:', 6, '(2, −3)', '(−2, −3)', '(4, 1)', '(2, 3)', 'A', 'h = −b/2a = 2 y f(2) = 4 − 8 + 1 = −3.'),
  (28,  'Si a < 0 en f(x) = ax² + bx + c, la parábola:', 6, 'Se abre hacia arriba', 'Se abre hacia abajo', 'Es una recta', 'No tiene vértice', 'B', 'Un coeficiente a negativo invierte la concavidad: abre hacia abajo.'),
  (29,  'El discriminante de x² − 6x + 9 es:', 6, '0', '36', '−36', '12', 'A', 'Δ = 36 − 36 = 0; la ecuación tiene una raíz doble.'),
  (30,  'Las soluciones de x² − 9 = 0 son:', 6, '3 y −3', '3 y 9', '9 y −9', '3 (doble)', 'A', 'x² = 9, por lo tanto x = ±3.'),

  -- Tema 7: Función exponencial
  (31,  'Si f(x) = 2ˣ, el valor de f(3) es:', 7, '5', '8', '6', '9', 'B', '2³ = 8.'),
  (32,  'Si f(x) = 3ˣ, el valor de f(−1) es:', 7, '−3', '1/3', '3', '1/9', 'B', '3⁻¹ = 1/3.'),
  (33,  'La función f(x) = 2ˣ, para x ≥ 0, es:', 7, 'Constante', 'Creciente', 'Decreciente', 'Lineal', 'B', 'Con base mayor que 1, la exponencial es creciente.'),
  (34,  'La función f(x) = (1/2)ˣ es:', 7, 'Creciente', 'Decreciente', 'Constante', 'Periódica', 'B', 'Con base entre 0 y 1, la exponencial decrece.'),
  (35,  'El dominio de f(x) = aˣ, con a > 0 y a ≠ 1, es:', 7, 'Solo los enteros', 'Solo los positivos', 'Todos los reales', 'Solo los negativos', 'C', 'La exponencial está definida para todo número real.'),

  -- Tema 8: Círculo y circunferencia
  (36,  'El diámetro de un círculo de radio 6 cm es:', 8, '3 cm', '12 cm', '18 cm', '36 cm', 'B', 'El diámetro es el doble del radio: d = 2·6 = 12 cm.'),
  (37,  'La longitud de una circunferencia de radio 5 cm (π ≈ 3,14) es:', 8, '31,4 cm', '15,7 cm', '78,5 cm', '10 cm', 'A', 'L = 2πr = 2·3,14·5 = 31,4 cm.'),
  (38,  'El área de un círculo de radio 3 cm (π ≈ 3,14) es:', 8, '28,26 cm²', '18,84 cm²', '9,42 cm²', '56,52 cm²', 'A', 'A = πr² = 3,14·9 = 28,26 cm².'),
  (39,  'La relación correcta entre el diámetro d y el radio r es:', 8, 'd = r/2', 'd = 2r', 'd = r²', 'd = πr', 'B', 'Por definición, el diámetro mide el doble del radio.'),
  (40,  'Si la longitud de una circunferencia es 62,8 cm (π ≈ 3,14), su diámetro es:', 8, '20 cm', '10 cm', '40 cm', '31,4 cm', 'A', 'L = π·d, entonces 62,8 = 3,14·d → d = 20 cm.'),

  -- Tema 9: Trigonometría
  (41,  'En un triángulo rectángulo, sen θ se define como:', 9, 'Cateto opuesto / hipotenusa', 'Cateto adyacente / hipotenusa', 'Cateto opuesto / cateto adyacente', 'Hipotenusa / cateto opuesto', 'A', 'El seno relaciona el cateto opuesto con la hipotenusa.'),
  (42,  'En un triángulo rectángulo, tan θ se define como:', 9, 'Cateto adyacente / hipotenusa', 'Cateto opuesto / cateto adyacente', 'Hipotenusa / cateto adyacente', 'Cateto opuesto / hipotenusa', 'B', 'La tangente es el cociente entre el cateto opuesto y el adyacente.'),
  (43,  'Si sen θ = 3/5 en un triángulo rectángulo, entonces cos θ vale:', 9, '4/5', '3/4', '5/4', '1/5', 'A', 'Es el triángulo 3-4-5: cos θ = 4/5.'),
  (44,  'El valor de sen 30° es:', 9, '1', '1/2', '√3/2', '0', 'B', 'sen 30° = 1/2, un valor notable muy usado.'),
  (45,  'El valor de tan 45° es:', 9, '0', '1/2', '1', '√3', 'C', 'tan 45° = 1 porque los catetos son iguales.'),

  -- Tema 10: Áreas y volúmenes
  (46,  'El área de un cuadrado de lado 7 cm es:', 10, '49 cm²', '14 cm²', '28 cm²', '7 cm²', 'A', 'A = lado² = 49 cm².'),
  (47,  'El volumen de un cubo de arista 3 cm es:', 10, '9 cm³', '27 cm³', '81 cm³', '6 cm³', 'B', 'V = arista³ = 27 cm³.'),
  (48,  'El área de un rectángulo de 8 cm por 5 cm es:', 10, '13 cm²', '40 cm²', '26 cm²', '80 cm²', 'B', 'A = base·altura = 8·5 = 40 cm².'),
  (49,  'El área de un círculo de radio 2 cm (π ≈ 3,14) es:', 10, '6,28 cm²', '12,56 cm²', '25,12 cm²', '4 cm²', 'B', 'A = πr² = 3,14·4 = 12,56 cm².'),
  (50,  'El volumen de un cilindro de radio 2 cm y altura 5 cm (π ≈ 3,14) es:', 10, '31,4 cm³', '20 cm³', '62,8 cm³', '78,5 cm³', 'C', 'V = πr²h = 3,14·4·5 = 62,8 cm³.'),

  -- Tema 11: Variable aleatoria
  (51,  'El número de caras al lanzar una moneda 3 veces es una variable aleatoria:', 11, 'Continua', 'Discreta', 'Cualitativa', 'No aleatoria', 'B', 'Toma un número finito de valores (0, 1, 2 o 3): es discreta.'),
  (52,  'La estatura de un estudiante elegido al azar es una variable aleatoria:', 11, 'Continua', 'Discreta', 'Constante', 'Ordinal', 'A', 'Puede tomar cualquier valor en un intervalo: es continua.'),
  (53,  'Una variable aleatoria es una función que:', 11, 'Ordena los datos de menor a mayor', 'Asocia un número a cada resultado de un experimento aleatorio', 'Solo toma valores negativos', 'Mide el azar', 'B', 'La variable aleatoria asigna un valor numérico a cada resultado del experimento.'),
  (54,  'La variable "número de autos que pasan por una esquina en una hora" es:', 11, 'Continua', 'Discreta', 'Cualitativa', 'Determinística', 'B', 'Se puede contar: toma valores enteros, por lo tanto es discreta.'),
  (55,  'El tiempo exacto de espera de un bus, en minutos, es una variable:', 11, 'Discreta', 'Continua', 'Ordinal', 'Categórica', 'B', 'El tiempo se mide y puede tomar infinitos valores, es continua.'),

  -- Tema 12: Distribución binomial
  (56,  'En un experimento binomial, los ensayos son:', 12, 'Dependientes entre sí', 'Independientes e idénticos', 'Sin resultados posibles', 'Ordenados obligatoriamente', 'B', 'Cada ensayo es independiente y se repite en las mismas condiciones.'),
  (57,  'Cada ensayo de un experimento binomial tiene:', 12, 'Tres resultados posibles', 'Dos resultados posibles (éxito o fracaso)', 'Cuatro resultados posibles', 'Un resultado seguro', 'B', 'La binomial modela solo éxito o fracaso.'),
  (58,  'Si n = 4 y p = 1/2, el valor esperado E[X] = n·p es:', 12, '4', '1/2', '2', '8', 'C', 'E[X] = 4·(1/2) = 2.'),
  (59,  'La varianza de una distribución binomial es:', 12, 'n·p', 'n·p·(1−p)', 'n/p', 'p·(1−p)', 'B', 'Var(X) = n·p·(1−p).'),
  (60,  'Al lanzar una moneda justa 10 veces y contar caras, el valor de p es:', 12, '0,1', '0,5', '1', '10', 'B', 'En una moneda justa, P(cara) = 0,5.'),

  -- Tema 13: Estadística descriptiva
  (61,  'La moda del conjunto {2, 3, 3, 5, 7} es:', 13, '2', '3', '5', '7', 'B', 'El valor que más se repite es 3.'),
  (62,  'La mediana de {2, 4, 6, 8} es:', 13, '4', '6', '5', '20', 'C', 'Con datos pares, la mediana es el promedio de los centrales: (4+6)/2 = 5.'),
  (63,  'La media aritmética de {2, 4, 6} es:', 13, '3', '4', '5', '6', 'B', '(2+4+6)/3 = 12/3 = 4.'),
  (64,  'La mediana de {3, 5, 7} es:', 13, '3', '5', '7', '15', 'B', 'Es el valor central: 5.'),
  (65,  'El rango del conjunto {3, 7, 11} es:', 13, '4', '8', '7', '11', 'B', 'Rango = máximo − mínimo = 11 − 3 = 8.'),

  -- Tema 14: Textos escritos
  (66,  'La idea principal de un texto expositivo se identifica porque:', 14, 'Se repite con las mismas palabras', 'Expresa el mensaje central que organiza el resto', 'Aparece siempre al final', 'Es la oración más larga', 'B', 'La idea principal resume y organiza el contenido del texto.'),
  (67,  'Subrayar y escribir notas al margen mientras se lee es una estrategia de:', 14, 'Predicción', 'Registro y localización de ideas', 'Resumen oral', 'Lectura rápida', 'B', 'Ayudan a registrar las ideas importantes para estudiarlas después.'),
  (68,  'Anticipar el tema a partir del título de un texto corresponde a:', 14, 'Predecir', 'Resumir', 'Parafrasear', 'Comparar', 'A', 'La predicción activa conocimientos previos antes de leer.'),
  (69,  'Resumir un texto consiste en:', 14, 'Copiar el texto completo', 'Reducir el texto a sus ideas esenciales con palabras propias', 'Cambiar de tema', 'Subrayar todo', 'B', 'El resumen conserva lo esencial con tus propias palabras.'),
  (70,  'El "tema" de un texto se refiere a:', 14, 'El asunto general del que trata', 'La opinión del autor', 'El título del texto', 'El número de párrafos', 'A', 'El tema es el asunto que se aborda a lo largo del texto.'),

  -- Tema 15: Textos orales
  (71,  'La comunicación oral se caracteriza por:', 15, 'Ser diferida en el tiempo', 'Ser inmediata y con retroalimentación directa', 'No usar gestos', 'Usar solo señales', 'B', 'En la oralidad emisor y receptor interactúan en el momento.'),
  (72,  'En una exposición oral, los apoyos visuales sirven para:', 15, 'Reemplazar al expositor', 'Reforzar y ordenar la información', 'Distraer al público', 'Evitar hablar', 'B', 'Refuerzan el mensaje y facilitan seguir la exposición.'),
  (73,  'Prestar atención al mensaje, al tono y a los gestos corresponde a:', 15, 'Escucha activa', 'Hablar por turnos', 'Debatir', 'Resumir', 'A', 'La escucha activa implica comprender el mensaje completo.'),
  (74,  'Un debate se caracteriza por:', 15, 'Exponer sin réplica', 'Confrontar argumentos sobre un tema', 'Leer un discurso', 'Votar al final', 'B', 'En el debate se contraponen argumentos de posturas distintas.'),
  (75,  'La entonación y las pausas al exponer sirven para:', 15, 'Terminar más rápido', 'Dar énfasis y facilitar la comprensión', 'Evitar preguntas', 'Bajar el volumen', 'B', 'Manejar la voz ayuda a destacar ideas y mantener el interés.'),

  -- Tema 16: Poesía chilena
  (76,  'Gabriela Mistral es la poeta chilena que recibió:', 16, 'El Premio Nobel de Literatura en 1945', 'El Premio Planeta', 'El Nobel de la Paz', 'El Pulitzer', 'A', 'Gabriela Mistral fue la primera latinoamericana en obtener el Nobel de Literatura.'),
  (77,  'Pablo Neruda es autor de:', 16, 'La casa de los espíritus', 'Veinte poemas de amor y una canción desesperada', 'Martín Rivas', 'Rayuela', 'B', 'Obra emblemática del poeta chileno.'),
  (78,  'El verso y la estrofa son:', 16, 'Unidades del poema', 'Tipos de poemas', 'Autores chilenos', 'Figuras literarias', 'A', 'El verso es la línea del poema y la estrofa es el grupo de versos.'),
  (79,  'La rima entre versos se refiere a:', 16, 'La semejanza de sonidos finales', 'La longitud del poema', 'El número de estrofas', 'El autor del poema', 'A', 'Riman cuando coinciden los sonidos finales de los versos.'),
  (80,  'El hablante lírico es:', 16, 'El autor real del poema', 'La voz que expresa sentimientos dentro del poema', 'El lector del poema', 'El editorialista', 'B', 'Es la voz poética que transmite las emociones del poema.'),

  -- Tema 17: Narrativa chilena
  (81,  'Isabel Allende es autora de:', 17, 'La casa de los espíritus', 'Cien años de soledad', 'Rayuela', 'Pedro Páramo', 'A', 'Novela emblemática de la narrativa chilena contemporánea.'),
  (82,  'El narrador en primera persona:', 17, 'Es observador externo', 'Participa de la historia', 'Es omnisciente', 'Nunca habla', 'B', 'El narrador en primera persona cuenta hechos que vivió o presencia.'),
  (83,  'La novela "Martín Rivas" pertenece a la literatura chilena del:', 17, 'Siglo XXI', 'Siglo XIX', 'Siglo XVII', 'Siglo XV', 'B', 'Obra de Alberto Blest Gana, publicada en el siglo XIX.'),
  (84,  'Un cuento se diferencia de una novela por:', 17, 'Su menor extensión y menos subtramas', 'Tener más personajes', 'No tener narrador', 'Ser siempre real', 'A', 'El cuento es breve y concentra la acción en pocos acontecimientos.'),
  (85,  'El ambiente de una narración incluye:', 17, 'El tiempo y el espacio donde ocurren los hechos', 'Solo los personajes', 'El título de la obra', 'La editorial', 'A', 'El ambiente reúne las coordenadas temporales y espaciales del relato.'),

  -- Tema 18: Debate y argumentación
  (86,  'En un debate, la tesis es:', 18, 'La reformulación de la pregunta', 'La postura que se defiende', 'El moderador', 'El público', 'B', 'La tesis es la afirmación central que se intenta sostener.'),
  (87,  'Un argumento válido está formado por:', 18, 'Premisas que apoyan una conclusión', 'Solo opiniones', 'Un ejemplo aislado', 'Una pregunta retórica', 'A', 'La argumentación conecta premisas con una conclusión.'),
  (88,  'La falacia ad hominem consiste en:', 18, 'Atacar a la persona y no a sus argumentos', 'Generalizar sin evidencia', 'Apelar a la autoridad', 'Usar estadísticas', 'A', 'Se desvía el debate desacreditando al contrincante.'),
  (89,  'Rebatir una idea implica:', 18, 'Cambiar de tema', 'Contradecir con argumentos la postura contraria', 'Repetir la idea', 'Aplaudir', 'B', 'Refutar es enfrentar la postura contraria con razones.'),
  (90,  'La conclusión de una argumentación:', 18, 'Presenta los datos crudos', 'Resume la postura y refuerza la tesis', 'Introduce nuevas premisas', 'Define las reglas', 'B', 'Cierra el razonamiento y refuerza la tesis defendida.'),

  -- Tema 19: Skimming and scanning
  (91,  'Skimming is used to:', 19, 'Find specific data quickly', 'Get the general idea of a text quickly', 'Translate every word', 'Read aloud', 'B', 'Skimming gives the gist: title, headings and first sentences.'),
  (92,  'Scanning is used to:', 19, 'Get the general idea', 'Find specific information such as dates or names', 'Memorize the text', 'Draw conclusions', 'B', 'Scanning looks for particular details, not the whole text.'),
  (93,  'When you read titles and first sentences only, you are:', 19, 'Scanning', 'Skimming', 'Paraphrasing', 'Summarizing', 'B', 'That is the classic skimming technique.'),
  (94,  'To find a telephone number in a directory you need to:', 19, 'Scan', 'Skim', 'Translate', 'Recite', 'A', 'Scanning helps locate a precise piece of information.'),
  (95,  'A quick way to decide if a text is useful is to:', 19, 'Read it twice', 'Skim its headings', 'Count every word', 'Ask a friend', 'B', 'Skimming headings reveals the structure and topic quickly.'),

  -- Tema 20: Reading strategies
  (96,  'Predicting before reading consists of:', 20, 'Anticipating content using titles and images', 'Reading the last paragraph first', 'Memorizing vocabulary', 'Writing a summary', 'A', 'Prediction activates previous knowledge and expectations.'),
  (97,  'Guessing meaning from context means:', 20, 'Using a dictionary for every word', 'Inferring unknown words using surrounding clues', 'Skipping unknown words forever', 'Reading aloud', 'B', 'Context clues help deduce the meaning of unknown words.'),
  (98,  'Reading for gist means:', 20, 'Finding specific dates', 'Understanding the overall idea', 'Translating word by word', 'Underlining everything', 'B', 'Gist reading focuses on the general message.'),
  (99,  'Rereading a passage helps to:', 20, 'Clarify details and improve comprehension', 'Make the text longer', 'Memorize the author', 'Change the story', 'A', 'Going back over a section reinforces understanding.'),
  (100, 'Highlighting key ideas while reading helps to:', 20, 'Locate and remember important information', 'Avoid reading', 'Increase speed only', 'Translate faster', 'A', 'Highlighting marks what matters for later review.'),

  -- Tema 21: Verb tenses
  (101, 'The form "subject + verb-ed" is used for the:', 21, 'Present simple', 'Past simple (regular verbs)', 'Future', 'Present perfect', 'B', 'Regular past tense adds -ed to the base verb.'),
  (102, '"I have finished my homework" is in the:', 21, 'Present perfect', 'Past simple', 'Present continuous', 'Future simple', 'A', 'Have/has + past participle is the present perfect.'),
  (103, '"She is studying right now" uses the:', 21, 'Present simple', 'Present continuous', 'Past perfect', 'Future', 'B', 'Am/is/are + verb-ing expresses an action in progress.'),
  (104, 'The future with "will" is used to express:', 21, 'Predictions and decisions at the moment of speaking', 'Past habits', 'Actions in progress', 'Daily routines', 'A', 'Will is typical for predictions and spontaneous decisions.'),
  (105, '"They have been working since Monday" uses the:', 21, 'Past continuous', 'Present perfect continuous', 'Future perfect', 'Past simple', 'B', 'Have been + verb-ing signals duration up to the present.'),

  -- Tema 22: Conditionals
  (106, '"If it rains, we will stay home" is a:', 22, 'Zero conditional', 'First conditional', 'Second conditional', 'Third conditional', 'B', 'If + present simple, will + infinitive is the first conditional.'),
  (107, 'The first conditional is formed with:', 22, 'If + present simple, will + infinitive', 'If + past simple, would + infinitive', 'If + past perfect, would have + past participle', 'If + will', 'A', 'First conditional expresses possible future situations.'),
  (108, '"If I were rich, I would travel" is a:', 22, 'Zero conditional', 'First conditional', 'Second conditional', 'Mixed conditional', 'C', 'If + past simple, would + infinitive is the second conditional.'),
  (109, 'The second conditional expresses:', 22, 'General truths', 'Real possibilities', 'Unreal or unlikely situations', 'Past regrets', 'C', 'It talks about hypothetical or unlikely present/future situations.'),
  (110, 'The zero conditional describes:', 22, 'General truths and facts', 'Unreal past', 'Future plans', 'Polite requests', 'A', 'If + present simple, present simple is used for facts.'),

  -- Tema 23: Idioms
  (111, '"It is raining cats and dogs" means:', 23, 'It is very cold', 'It is raining heavily', 'There are pets outside', 'It is sunny', 'B', 'The idiom means very heavy rain.'),
  (112, '"Break a leg" is used to:', 23, 'Wish someone good luck', 'Insult someone', 'Ask for help', 'End a conversation', 'A', 'It is said before a performance to wish success.'),
  (113, '"This exercise is a piece of cake" means:', 23, 'It is delicious', 'It is very easy', 'It is expensive', 'It is difficult', 'B', 'A piece of cake is something effortless.'),
  (114, '"I feel under the weather today" means:', 23, 'I am tired of the weather', 'I feel ill', 'I am outside', 'I am happy', 'B', 'Feeling under the weather means feeling unwell.'),
  (115, '"He visits us once in a blue moon" means:', 23, 'Very rarely', 'Every night', 'When the moon is blue', 'Every day', 'A', 'Once in a blue moon means almost never.'),

  -- Tema 24: Movimiento rectilíneo uniforme
  (116, 'En el MRU, la velocidad del móvil es:', 24, 'Constante y la aceleración es cero', 'Variable', 'Cada vez mayor', 'Negativa siempre', 'A', 'En el MRU no hay cambios de velocidad, por lo tanto a = 0.'),
  (117, 'La posición de un móvil en MRU se calcula con:', 24, 'x = x₀ + v·t', 'x = x₀ − v²·t', 'x = v·t²', 'x = x₀/v·t', 'A', 'x = x₀ + v·t describe el MRU.'),
  (118, 'Un auto recorre 120 km en 2 horas. Su rapidez es:', 24, '60 km/h', '120 km/h', '240 km/h', '30 km/h', 'A', 'v = d/t = 120/2 = 60 km/h.'),
  (119, 'Con v = 5 m/s durante 4 segundos, la distancia recorrida es:', 24, '9 m', '20 m', '1,25 m', '5 m', 'B', 'd = v·t = 5·4 = 20 m.'),
  (120, 'La gráfica posición-tiempo de un MRU es:', 24, 'Una parábola', 'Una recta', 'Una circunferencia', 'Una hipérbola', 'B', 'En el MRU la posición crece linealmente con el tiempo.'),
  (121, 'La energía cinética de un cuerpo depende de su:', 25, 'Color y forma', 'Masa y velocidad', 'Solo de la altura', 'Temperatura', 'B', 'E_c = (1/2)·m·v².'),
  (122, 'Con m = 2 kg, g = 10 m/s² y h = 3 m, la energía potencial gravitatoria es:', 25, '15 J', '30 J', '60 J', '6 J', 'C', 'E_p = m·g·h = 2·10·3 = 60 J.'),
  (123, 'Si una fuerza de 10 N desplaza un cuerpo 5 m en su misma dirección, el trabajo es:', 25, '2 J', '15 J', '50 J', '500 J', 'C', 'W = F·d = 10·5 = 50 J.'),
  (124, 'La unidad de energía en el Sistema Internacional es:', 25, 'El watt', 'El joule', 'El newton', 'El pascal', 'B', 'La energía se mide en joules (J).'),
  (125, 'El teorema del trabajo y la energía establece que:', 25, 'El trabajo neto equivale al cambio de energía cinética', 'La energía siempre se pierde', 'El trabajo no mueve cuerpos', 'La energía potencial nunca cambia', 'A', 'W_neto = ΔE_c.'),

  -- Tema 26: Estequiometría
  (126, 'En la reacción 2H₂ + O₂ → 2H₂O, la proporción molar H₂:O₂ es:', 26, '1:1', '2:1', '1:2', '4:1', 'B', 'Los coeficientes indican 2 moles de H₂ por 1 mol de O₂.'),
  (127, 'Un mol de una sustancia contiene:', 26, '6,022·10²³ partículas', '1·10²³ partículas', '1000 partículas', '6,022 partículas', 'A', 'Un mol equivale al número de Avogadro.'),
  (128, 'Los coeficientes de una ecuación química balanceada indican:', 26, 'La proporción en moles de las sustancias', 'Las masas absolutas', 'Los colores', 'Las temperaturas', 'A', 'Los coeficientes son la proporción estequiométrica.'),
  (129, 'Si la masa molar del agua es 18 g/mol, la masa de 2 moles es:', 26, '9 g', '18 g', '36 g', '54 g', 'C', 'masa = moles·masa molar = 2·18 = 36 g.'),
  (130, 'La masa molar del CO₂ (C = 12, O = 16) es aproximadamente:', 26, '28 g/mol', '32 g/mol', '44 g/mol', '48 g/mol', 'C', '12 + 2·16 = 44 g/mol.'),

  -- Tema 27: Reacciones químicas
  (131, 'En la reacción 2H₂ + O₂ → 2H₂O, los reactivos son:', 27, 'H₂O', 'H₂ y O₂', 'H₂ y H₂O', 'O₂ y H₂O', 'B', 'Los reactivos están a la izquierda de la flecha: H₂ y O₂.'),
  (132, 'Una reacción de síntesis es aquella en la que:', 27, 'Un compuesto se separa', 'Dos o más sustancias forman un producto', 'Un elemento reemplaza a otro', 'Se libera calor únicamente', 'B', 'Síntesis: A + B → AB.'),
  (133, 'La ley de conservación de la masa afirma que:', 27, 'La masa puede aumentar', 'La masa de reactivos iguala la de productos', 'La masa se destruye', 'Solo importa la energía', 'B', 'En una reacción química la masa total se conserva.'),
  (134, 'En una reacción de descomposición:', 27, 'Un compuesto se separa en sustancias más simples', 'Dos reactivos se combinan', 'Nada cambia', 'Se forma un solo elemento', 'A', 'Descomposición: AB → A + B.'),
  (135, 'En la reacción balanceada 2H₂ + O₂ → 2H₂O, el número de átomos de H en el lado izquierdo es:', 27, '2', '4', '6', '8', 'B', 'Coeficiente 2 × subíndice 2 = 4 átomos de hidrógeno.'),

  -- Tema 28: Genética
  (136, 'El ADN se encuentra principalmente en:', 28, 'El núcleo de la célula', 'Los ribosomas', 'La membrana celular', 'El citoplasma', 'A', 'El ADN está organizado en el núcleo dentro de los cromosomas.'),
  (137, 'Un gen es:', 28, 'Una proteína', 'Un segmento de ADN que lleva información', 'Una célula', 'Un cromosoma entero', 'B', 'El gen es la unidad de información hereditaria en el ADN.'),
  (138, 'Los alelos de un gen se encuentran en:', 28, 'Cromosomas homólogos', 'Los ribosomas', 'El ARN mensajero', 'Las mitocondrias', 'A', 'Los alelos ocupan el mismo lugar en cada cromosoma del par homólogo.'),
  (139, 'Si un individuo tiene dos alelos iguales para un gen, es:', 28, 'Homocigoto', 'Heterocigoto', 'Recesivo siempre', 'Dominante siempre', 'A', 'Homocigoto significa alelos idénticos; heterocigoto, distintos.'),
  (140, 'El puente entre el ADN y los ribosomas es:', 28, 'El ATP', 'El ARN mensajero', 'La glucosa', 'El agua', 'B', 'El ARNm copia la información del ADN y la lleva a los ribosomas.'),

  -- Tema 29: Chile contemporáneo
  (141, 'El golpe de Estado en Chile ocurrió el:', 29, '11 de septiembre de 1973', '18 de septiembre de 1970', '5 de octubre de 1988', '11 de marzo de 1990', 'A', 'El 11/09/1973 se produjo el golpe militar.'),
  (142, 'El plebiscito de 1988 tuvo como resultado:', 29, 'La continuidad de la dictadura', 'El triunfo de la opción "No" y el fin de la dictadura', 'La elección de un nuevo congreso', 'La reforma agraria', 'B', 'El "No" ganó, convocando elecciones y el retorno a la democracia.'),
  (143, 'El retorno a la democracia (1990) comenzó con el gobierno de:', 29, 'Patricio Aylwin', 'Eduardo Frei Montalva', 'Augusto Pinochet', 'Salvador Allende', 'A', 'Patricio Aylwin fue el primer presidente tras la dictadura.'),
  (144, 'Augusto Pinochet ejerció el poder entre:', 29, '1973 y 1990', '1964 y 1970', '1990 y 1994', '1988 y 2000', 'A', 'Gobernó desde el golpe de 1973 hasta 1990.'),
  (145, 'La Constitución Política actual de Chile fue promulgada originalmente en:', 29, '1980', '1973', '1925', '1990', 'A', 'La Constitución de 1980, reformada con posterioridad, rige hasta hoy.'),

  -- Tema 30: Economía del siglo XX
  (146, 'El modelo de industrialización por sustitución de importaciones (ISI) buscaba:', 30, 'Comprar más productos del exterior', 'Fomentar la industria nacional', 'Eliminar el comercio', 'Privatizar todo', 'B', 'El ISI promovía la producción local para reemplazar importaciones.'),
  (147, 'La crisis de 1929 afectó fuertemente a Chile por:', 30, 'El auge del salitre', 'La caída de las exportaciones de salitre', 'La exportación de cobre', 'La reforma agraria', 'B', 'Chile era muy dependiente del salitre, cuyo mercado se desplomó.'),
  (148, 'Desde fines de la década de 1970 se aplicó en Chile un modelo económico:', 30, 'Socialista', 'De mercado con apertura externa', 'Agrario', 'Autárquico', 'B', 'El modelo implementado impulsó el libre mercado y la apertura.'),
  (149, 'El salitre fue el principal recurso de exportación chileno hasta:', 30, 'mediados del siglo XX, cuando decayó tras 1929', 'el siglo XXI', 'la independencia', '1990', 'A', 'Tras la crisis de 1929 el salitre perdió protagonismo frente al cobre.'),
  (150, 'La reforma agraria de los años 60 se relaciona con:', 30, 'La redistribución de la tierra', 'La industrialización', 'La minería del cobre', 'El comercio exterior', 'A', 'Buscó redistribuir predios para mejorar la producción y la equidad.'),

  -- Tema 31: Guerras mundiales
  (151, 'La Primera Guerra Mundial comenzó en:', 31, '1939', '1914', '1918', '1945', 'B', 'Inició en 1914 y terminó en 1918.'),
  (152, 'La Segunda Guerra Mundial terminó en:', 31, '1918', '1939', '1945', '1950', 'C', 'Concluyó en 1945 con la rendición de las potencias del Eje.'),
  (153, 'El tratado que puso fin a la Primera Guerra Mundial fue:', 31, 'El Tratado de Versalles', 'El Tratado de Tordesillas', 'El Pacto de Varsovia', 'El Tratado de Lisboa', 'A', 'Versalles (1919) impuso duras condiciones a Alemania.'),
  (154, 'En 1945, Estados Unidos lanzó bombas atómicas sobre:', 31, 'Berlín y Roma', 'Hiroshima y Nagasaki', 'Tokio y Osaka', 'Londres y París', 'B', 'Los bombardeos de Hiroshima y Nagasaki aceleraron el fin de la guerra.'),
  (155, 'La causa inmediata del inicio de la Primera Guerra Mundial fue:', 31, 'El asesinato del archiduque Francisco Fernando', 'La crisis de 1929', 'La revolución rusa', 'El tratado de Versalles', 'A', 'El atentado de Sarajevo (1914) precipitó el conflicto.');

SELECT setval(pg_get_serial_sequence('cursos', 'id'), (SELECT max(id) FROM cursos));
SELECT setval(pg_get_serial_sequence('asignaturas', 'id'), (SELECT max(id) FROM asignaturas));
SELECT setval(pg_get_serial_sequence('asignatura_curso', 'id'), (SELECT max(id) FROM asignatura_curso));
SELECT setval(pg_get_serial_sequence('ramas', 'id'), (SELECT max(id) FROM ramas));
SELECT setval(pg_get_serial_sequence('temas', 'id'), (SELECT max(id) FROM temas));
SELECT setval(pg_get_serial_sequence('videos', 'id'), (SELECT max(id) FROM videos));
SELECT setval(pg_get_serial_sequence('pdfs', 'id'), (SELECT max(id) FROM pdfs));
SELECT setval(pg_get_serial_sequence('ejercicios', 'id'), (SELECT max(id) FROM ejercicios));