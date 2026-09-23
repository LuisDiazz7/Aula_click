-- Políticas RLS para que la app (rol authenticated) pueda operar.
-- Nota: dado que la tabla usuario usa ids bigint propios, las políticas son
-- permisivas para usuarios autenticados. Refinar en producción si se quiere
-- acotar por usuario (ej: auth.uid()).

-- usuario
CREATE POLICY "lectura_usuario_auth" ON usuario FOR SELECT TO authenticated USING (true);
CREATE POLICY "insercion_usuario_auth" ON usuario FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_usuario_auth" ON usuario FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- perfil_estudiante
CREATE POLICY "lectura_perfil_auth" ON perfil_estudiante FOR SELECT TO authenticated USING (true);
CREATE POLICY "insercion_perfil_auth" ON perfil_estudiante FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_perfil_auth" ON perfil_estudiante FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- cursos
CREATE POLICY "lectura_cursos_auth" ON cursos FOR SELECT TO authenticated USING (true);

-- asignaturas
CREATE POLICY "lectura_asignaturas_auth" ON asignaturas FOR SELECT TO authenticated USING (true);

-- asignatura_curso
CREATE POLICY "lectura_asignatura_curso_auth" ON asignatura_curso FOR SELECT TO authenticated USING (true);

-- ramas
CREATE POLICY "lectura_ramas_auth" ON ramas FOR SELECT TO authenticated USING (true);

-- temas
CREATE POLICY "lectura_temas_auth" ON temas FOR SELECT TO authenticated USING (true);

-- videos
CREATE POLICY "lectura_videos_auth" ON videos FOR SELECT TO authenticated USING (true);

-- pdfs
CREATE POLICY "lectura_pdfs_auth" ON pdfs FOR SELECT TO authenticated USING (true);

-- ejercicios
CREATE POLICY "lectura_ejercicios_auth" ON ejercicios FOR SELECT TO authenticated USING (true);

-- notificacion
CREATE POLICY "lectura_notificacion_auth" ON notificacion FOR SELECT TO authenticated USING (true);
CREATE POLICY "insercion_notificacion_auth" ON notificacion FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_notificacion_auth" ON notificacion FOR UPDATE TO authenticated USING (true) WITH CHECK (true);