-- La contraseña real la maneja Supabase Auth; la columna ya no es obligatoria.
ALTER TABLE usuario ALTER COLUMN contrasena DROP NOT NULL;