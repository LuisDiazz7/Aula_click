-- ============================================================
-- Aula Click - Seguridad por usuario y progreso
-- 1) Vincula cada fila de `usuario` con auth.users (auth_uid).
-- 2) Agrega el área/modalidad del estudiante al perfil.
-- 3) Endurece las políticas RLS para que cada estudiante solo
--    lea/edite su propio perfil y su propio progreso.
--    (El contenido educativo queda legible por usuarios
--    autenticados según las políticas de la migración 0004.)
-- ============================================================

-- ---------- Vínculo con auth.users ----------
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS auth_uid uuid UNIQUE;

-- Backfill para cuentas existentes: une por correo.
UPDATE usuario u
SET auth_uid = au.id
FROM auth.users au
WHERE u.auth_uid IS NULL AND lower(u.correo) = lower(au.email);

-- ---------- Área / modalidad del estudiante ----------
ALTER TABLE perfil_estudiante ADD COLUMN IF NOT EXISTS area text NOT NULL DEFAULT 'Científico Humanista';

-- ---------- Índice de progreso (usuario, tema) ----------
CREATE INDEX IF NOT EXISTS idx_respuestas_usuario_tema ON respuestas_estudiante(id_usuario, id_tema);

-- ---------- Helper: ¿el perfil/progreso pertenece al usuario autenticado? ----------
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

-- ---------- usuario: solo el dueño ----------
DROP POLICY IF EXISTS "lectura_usuario_auth" ON usuario;
CREATE POLICY "lectura_usuario_propio" ON usuario
  FOR SELECT TO authenticated USING (auth_uid = auth.uid());

DROP POLICY IF EXISTS "insercion_usuario_auth" ON usuario;
CREATE POLICY "insercion_usuario_propio" ON usuario
  FOR INSERT TO authenticated WITH CHECK (auth_uid = auth.uid());

DROP POLICY IF EXISTS "update_usuario_auth" ON usuario;
CREATE POLICY "update_usuario_propio" ON usuario
  FOR UPDATE TO authenticated USING (auth_uid = auth.uid()) WITH CHECK (auth_uid = auth.uid());

-- ---------- perfil_estudiante: solo el dueño ----------
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

-- ---------- respuestas_estudiante: solo el dueño ----------
DROP POLICY IF EXISTS "Permitir lectura propia" ON respuestas_estudiante;
CREATE POLICY "lectura_respuestas_propias" ON respuestas_estudiante
  FOR SELECT TO authenticated USING (public.es_usuario_autenticado(id_usuario));

DROP POLICY IF EXISTS "Permitir insercion" ON respuestas_estudiante;
CREATE POLICY "insercion_respuesta_propia" ON respuestas_estudiante
  FOR INSERT TO authenticated WITH CHECK (public.es_usuario_autenticado(id_usuario));