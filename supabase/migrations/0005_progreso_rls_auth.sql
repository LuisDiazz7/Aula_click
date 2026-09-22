-- ============================================================
-- Aula Click - Progreso, autenticación por dueño y RLS estricta
-- 1) Vincula cada fila de `usuario` con auth.users (auth_uid).
-- 2) Agrega el área/modalidad del estudiante al perfil.
-- 3) Endurece las políticas RLS para que cada estudiante solo
--    lea/edite su propio perfil y su propio progreso.
-- 4) Siembra las preguntas de ejercitación (5 por subtema).
-- ============================================================

-- ---------- Vinculación con auth.users ----------
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS auth_uid uuid UNIQUE;

-- Backfill para cuentas existentes: une por correo.
UPDATE usuario u
SET auth_uid = au.id
FROM auth.users au
WHERE u.auth_uid IS NULL AND lower(u.correo) = lower(au.email);

-- ---------- Área / modalidad del estudiante ----------
ALTER TABLE perfil_estudiante ADD COLUMN IF NOT EXISTS area text NOT NULL DEFAULT 'Científico Humanista';

-- ---------- Índice de progreso por (usuario, tema) ----------
CREATE INDEX IF NOT EXISTS idx_respuestas_usuario_tema ON respuestas_estudiante(id_usuario, id_tema);

-- ============================================================
-- RLS: cada estudiante solo gestiona sus propios datos
-- ============================================================

-- Helper: consulta interna para saber si un usuario corresponde al
-- usuario autenticado actualmente.
CREATE OR REPLACE FUNCTION public.es_usuario_autenticado(id_usuario bigint)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.usuario u
    WHERE u.id = id_usuario AND u.auth_uid = auth.uid()
  )
$$;

-- ---------- usuario ----------
DROP POLICY IF EXISTS "lectura_usuario_auth" ON usuario;
CREATE POLICY "lectura_usuario_propio" ON usuario
  FOR SELECT TO authenticated USING (auth_uid = auth.uid());

DROP POLICY IF EXISTS "insercion_usuario_auth" ON usuario;
CREATE POLICY "insercion_usuario_propio" ON usuario
  FOR INSERT TO authenticated WITH CHECK (auth_uid = auth.uid());

DROP POLICY IF EXISTS "update_usuario_auth" ON usuario;
CREATE POLICY "update_usuario_propio" ON usuario
  FOR UPDATE TO authenticated USING (auth_uid = auth.uid()) WITH CHECK (auth_uid = auth.uid());

-- ---------- perfil_estudiante ----------
DROP POLICY IF EXISTS "lectura_perfil_auth" ON perfil_estudiante;
CREATE POLICY "lectura_perfil_propio" ON perfil_estudiante
  FOR SELECT TO authenticated USING (public.es_usuario_autenticado(id_usuario));

DROP POLICY IF EXISTS "insercion_perfil_auth" ON perfil_estudiante;
CREATE POLICY "insercion_perfil_propio" ON perfil_estudiante
  FOR INSERT TO authenticated WITH CHECK (public.es_usuario_autenticado(id_usuario));

DROP POLICY IF EXISTS "update_perfil_auth" ON perfil_estudiante;
CREATE POLICY "update_perfil_propio" ON perfil_estudiante
  FOR UPDATE TO authenticated USING (public.es_usuario_autenticado(id_usuario))
  WITH CHECK (public.es_usuario_autenticado(id_usuario));

-- ---------- respuestas_estudiante (progreso) ----------
DROP POLICY IF EXISTS "Permitir lectura propia" ON respuestas_estudiante;
CREATE POLICY "lectura_respuestas_propias" ON respuestas_estudiante
  FOR SELECT TO authenticated USING (public.es_usuario_autenticado(id_usuario));

DROP POLICY IF EXISTS "Permitir insercion" ON respuestas_estudiante;
CREATE POLICY "insercion_respuesta_propia" ON respuestas_estudiante
  FOR INSERT TO authenticated WITH CHECK (public.es_usuario_autenticado(id_usuario));

-- El contenido educativo (cursos, asignaturas, ramas, temas, videos,
-- pdfs, ejercicios) permanece legible por usuarios autenticados según
-- las políticas de la migración 0004.

-- ============================================================
-- Preguntas de ejercitación (5 por subtema)
-- ============================================================

INSERT INTO ejercicios (id, enunciado, id_tema, alt_a, alt_b, alt_c, alt_d, respuesta_correcta, retroalimentacion) VALUES
  -- Subtema 1: Potencias (4° Medio)
  (1, '¿Cuál es el valor de 2³?', 1, '4', '8', '6', '16', 'B', '2³ = 2 · 2 · 2 = 8.'),
  (2, 'El resultado de 3² · 3³ es:', 1, '3⁵ = 243', '3⁶ = 729', '9⁶', '3¹ = 3', 'A', 'Al multiplicar potencias de igual base se suman los exponentes: 3² · 3³ = 3⁵.'),
  (3, 'Al resolver (2²)³ obtenemos:', 1, '2⁵ = 32', '2⁶ = 64', '2⁸ = 256', '2⁹ = 512', 'B', 'El exponente de un exponente se multiplica: (2²)³ = 2⁶.'),
  (4, 'Para cualquier número a distinto de 0, el valor de a⁰ es:', 1, '0', 'a', '1', '−1', 'C', 'Por convención, todo número distinto de 0 elevado a 0 es 1.'),
  (5, 'El valor de 2⁵ : 2² es:', 1, '2⁷ = 128', '2¹⁰ = 1024', '2³ = 8', '2¹ = 2', 'C', 'Al dividir potencias de igual base se restan los exponentes: 2⁵ ÷ 2² = 2³.'),

  -- Subtema 2: Logaritmos (4° Medio)
  (6, 'El valor de log₂ 8 es:', 2, '2', '4', '3', '8', 'C', 'Como 2³ = 8, entonces log₂ 8 = 3.'),
  (7, 'El valor de log₁₀ 1000 es:', 2, '2', '3', '4', '100', 'B', 'Como 10³ = 1000, entonces log₁₀ 1000 = 3.'),
  (8, 'El valor de log₃ 27 es:', 2, '3', '9', '4', '6', 'A', 'Como 3³ = 27, entonces log₃ 27 = 3.'),
  (9, 'El valor de log₅ 5² es:', 2, '1', '5', '2', '25', 'C', 'La potencia dentro del logaritmo baja multiplicando: log₅ 5² = 2 · log₅ 5 = 2.'),
  (10, 'log₁₀ 2 + log₁₀ 5 =', 2, 'log₁₀ 7', 'log₁₀ 10 = 1', 'log₁₀ (2/5)', 'log₁₀ 25', 'B', 'La suma de logaritmos de igual base es el logaritmo del producto: log 2 + log 5 = log 10 = 1.'),

  -- Subtema 3: Funciones cuadráticas (4° Medio)
  (11, 'La gráfica de la función f(x) = x² es:', 3, 'Una recta', 'Una circunferencia', 'Una parábola', 'Una hipérbola', 'C', 'Toda función cuadrática tiene como gráfica una parábola.'),
  (12, 'La parábola de f(x) = −x² se abre:', 3, 'Hacia arriba', 'Hacia abajo', 'No se abre', 'Hacia la derecha', 'B', 'Si el coeficiente a es negativo, la parábola se abre hacia abajo.'),
  (13, 'El vértice de f(x) = x² − 4x + 3 es:', 3, '(2, −1)', '(−2, 1)', '(4, 3)', '(2, 1)', 'A', 'h = −b/2a = 2 y f(2) = 4 − 8 + 3 = −1, por lo que el vértice es (2, −1).'),
  (14, 'Las raíces de x² − 5x + 6 = 0 son:', 3, '1 y 6', '2 y 3', '−2 y −3', '5 y 6', 'B', 'La ecuación se factoriza como (x − 2)(x − 3) = 0, cuyas soluciones son 2 y 3.'),
  (15, '¿Cuántas raíces reales tiene x² + 2x + 5 = 0?', 3, 'Dos', 'Una', 'Ninguna', 'No se puede determinar', 'C', 'El discriminante es 2² − 4·1·5 = −16, menor que 0, por lo que no hay raíces reales.'),

  -- Subtema 4: Teorema de Pitágoras (4° Medio)
  (16, 'En un triángulo rectángulo con catetos 3 y 4, la hipotenusa mide:', 4, '7', '5', '6', '12', 'B', '√(3² + 4²) = √25 = 5. Es el clásico triángulo 3-4-5.'),
  (17, 'Si la hipotenusa mide 13 y un cateto 5, el otro cateto mide:', 4, '8', '10', '12', '18', 'C', '√(13² − 5²) = √(169 − 25) = √144 = 12.'),
  (18, 'El teorema de Pitágoras se aplica a:', 4, 'Triángulos equiláteros', 'Triángulos rectángulos', 'Triángulos isósceles', 'Cualquier triángulo', 'B', 'El teorema relaciona los catetos con la hipotenusa en triángulos rectángulos.'),
  (19, 'El valor de 6² + 8² es 100, entonces la hipotenusa de ese triángulo mide:', 4, '14', '100', '10', '64', 'C', 'La hipotenusa es √100 = 10.'),
  (20, '¿5, 12 y 13 forman una terna pitagórica?', 4, 'Sí, porque 5² + 12² = 13²', 'No', 'Solo si el triángulo es isósceles', 'No se puede saber', 'A', '25 + 144 = 169 = 13², por lo tanto sí forman una terna pitagórica.'),

  -- Subtema 5: Probabilidad condicional (4° Medio)
  (21, 'Si P(A ∩ B) = 0,2 y P(B) = 0,5, entonces P(A | B) =', 5, '0,1', '0,4', '0,7', '0,25', 'B', 'P(A | B) = P(A ∩ B) / P(B) = 0,2 / 0,5 = 0,4.'),
  (22, 'Si A y B son independientes con P(A) = 0,5 y P(B) = 0,4, entonces P(A ∩ B) =', 5, '0,9', '0,2', '0,1', '0,45', 'B', 'Para sucesos independientes P(A ∩ B) = P(A) · P(B) = 0,5 · 0,4 = 0,2.'),
  (23, 'Dos lanzamientos seguidos de un dado justo son sucesos:', 5, 'Dependientes', 'Independientes', 'Mutualmente excluyentes', 'Complementarios', 'B', 'El resultado del primer lanzamiento no influye en el segundo, por lo que son independientes.'),
  (24, 'Si P(A | B) = 0,3 y P(B) = 0,8, entonces P(A ∩ B) =', 5, '0,24', '0,38', '1,1', '0,3', 'A', 'Despejando: P(A ∩ B) = P(A | B) · P(B) = 0,3 · 0,8 = 0,24.'),
  (25, 'Si A y B son mutuamente excluyentes, entonces P(A ∩ B) es:', 5, '1', 'P(A)', '0', 'P(B)', 'C', 'Dos sucesos excluyentes no pueden ocurrir a la vez, por lo que su intersección vale 0.'),

  -- Subtema 6: Potencias y raíces (3° Medio)
  (26, 'El valor de √81 es:', 6, '9', '8', '7', '18', 'A', 'Porque 9 · 9 = 81.'),
  (27, 'El valor de 4² es:', 6, '16', '8', '12', '14', 'A', '4² = 4 · 4 = 16.'),
  (28, 'El valor de 3³ es:', 6, '9', '6', '27', '18', 'C', '3³ = 3 · 3 · 3 = 27.'),
  (29, 'El valor de √64 es:', 6, '6', '7', '8', '9', 'C', 'Porque 8 · 8 = 64.'),
  (30, 'El valor de 10³ es:', 6, '100', '1000', '30', '3000', 'B', '10³ = 10 · 10 · 10 = 1000.');

SELECT setval(pg_get_serial_sequence('ejercicios', 'id'), (SELECT max(id) FROM ejercicios));