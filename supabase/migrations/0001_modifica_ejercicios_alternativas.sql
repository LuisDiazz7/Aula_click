-- Modifica la tabla ejercicios para soportar preguntas de alternativas.
ALTER TABLE ejercicios
  DROP COLUMN respuesta_correcta,
  ADD COLUMN alt_a text NOT NULL DEFAULT '',
  ADD COLUMN alt_b text NOT NULL DEFAULT '',
  ADD COLUMN alt_c text NOT NULL DEFAULT '',
  ADD COLUMN alt_d text NOT NULL DEFAULT '',
  ADD COLUMN respuesta_correcta char(1) NOT NULL DEFAULT 'A',
  ADD COLUMN retroalimentacion text;