-- ============================================================================
-- CONFIGURACIÓN DE SUPABASE STORAGE PARA COMPROBANTES DE PAGO
-- ============================================================================

-- NOTA IMPORTANTE:
-- Los buckets se crean desde el Dashboard de Supabase o la API REST.
-- Ve a: Storage > New Bucket
-- Nombre: payment-proofs
-- Public: FALSE (bucket privado)
-- Luego ejecuta las políticas SQL de abajo.

-- ============================================================================
-- POLÍTICAS RLS PARA EL BUCKET 'payment-proofs'
-- ============================================================================

-- Política 1: SELECT - Solo admins pueden ver los comprobantes
CREATE POLICY "Only admins can view payment proofs"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'payment-proofs' AND
  auth.role() = 'authenticated' AND
  (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
);

-- Política 2: INSERT - Usuarios autenticados pueden subir sus propios comprobantes
-- Solo pueden subir archivos en una carpeta con su user_id
CREATE POLICY "Authenticated users can upload their own payment proofs"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'payment-proofs' AND
  auth.role() = 'authenticated' AND
  -- Verificar que el path comience con el user_id del usuario autenticado
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Política 3: UPDATE - Solo el usuario propietario puede actualizar su comprobante
CREATE POLICY "Users can update their own payment proofs"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'payment-proofs' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Política 4: DELETE - Solo el usuario propietario o admin puede eliminar
CREATE POLICY "Users and admins can delete payment proofs"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'payment-proofs' AND
  auth.role() = 'authenticated' AND
  (
    -- El usuario puede eliminar sus propios archivos
    (storage.foldername(name))[1] = auth.uid()::text OR
    -- O es admin
    (
      (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR
      (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    )
  )
);

-- ============================================================================
-- INSTRUCCIONES:
-- ============================================================================
-- 1. Ve a Supabase Dashboard > Storage > New Bucket
-- 2. Crea un bucket llamado 'payment-proofs'
-- 3. Márcalo como PRIVADO (Public bucket: NO)
-- 4. Luego ejecuta este archivo SQL completo en el SQL Editor
-- ============================================================================

