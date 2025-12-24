-- ============================================================================
-- CONFIGURACIÓN DE SUPABASE STORAGE PARA IMÁGENES DE PRODUCTOS
-- ============================================================================

-- NOTA IMPORTANTE:
-- Los buckets se crean desde el Dashboard de Supabase o la API REST.
-- Ve a: Storage > New Bucket
-- Nombre: product-images
-- Public: TRUE (para que las imágenes sean accesibles públicamente)
-- Luego ejecuta las políticas SQL de abajo.

-- ============================================================================
-- POLÍTICAS RLS PARA EL BUCKET 'product-images'
-- ============================================================================

-- Política 1: SELECT - Cualquiera puede ver las imágenes (público)
CREATE POLICY "Public Access for product-images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

-- Política 2: INSERT - Solo admins pueden subir imágenes
CREATE POLICY "Admin can upload product-images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated' AND
  (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
);

-- Política 3: UPDATE - Solo admins pueden actualizar imágenes
CREATE POLICY "Admin can update product-images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated' AND
  (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
);

-- Política 4: DELETE - Solo admins pueden eliminar imágenes
CREATE POLICY "Admin can delete product-images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated' AND
  (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
);

-- ============================================================================
-- INSTRUCCIONES:
-- ============================================================================
-- 1. Ve a Supabase Dashboard > Storage > New Bucket
-- 2. Crea un bucket llamado 'product-images'
-- 3. Márcalo como Público (Public bucket)
-- 4. Luego ejecuta este archivo SQL completo en el SQL Editor
-- ============================================================================

