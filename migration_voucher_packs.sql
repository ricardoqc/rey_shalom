-- ============================================================================
-- MIGRACIÓN: Sistema de Vouchers y Packs
-- Fecha: 2024
-- Descripción: Actualiza schema para validación manual de pagos y sistema de packs
-- ============================================================================

-- ============================================================================
-- 1. ACTUALIZACIÓN DE TABLA ORDERS
-- ============================================================================

-- Agregar columna para URL del comprobante de pago (voucher)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;

-- Actualizar payment_status para usar valores específicos: 'pending', 'approved', 'rejected'
-- Primero, actualizar valores existentes si es necesario
UPDATE orders 
SET payment_status = 'pending' 
WHERE payment_status NOT IN ('pending', 'approved', 'rejected');

-- Agregar constraint para validar valores de payment_status
ALTER TABLE orders 
DROP CONSTRAINT IF EXISTS valid_payment_status;

ALTER TABLE orders 
ADD CONSTRAINT valid_payment_status 
CHECK (payment_status IN ('pending', 'approved', 'rejected'));

-- Establecer default para payment_status
ALTER TABLE orders 
ALTER COLUMN payment_status SET DEFAULT 'pending';

-- Agregar columna para notas del administrador
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Comentarios para documentación
COMMENT ON COLUMN orders.payment_proof_url IS 'URL de la imagen del voucher/comprobante de pago subido por el cliente';
COMMENT ON COLUMN orders.payment_status IS 'Estado del pago: pending (pendiente), approved (aprobado), rejected (rechazado)';
COMMENT ON COLUMN orders.admin_notes IS 'Notas internas del administrador sobre la orden';

-- ============================================================================
-- 2. ACTUALIZACIÓN DE TABLA PRODUCTS
-- ============================================================================

-- Agregar columna para identificar packs
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_pack BOOLEAN DEFAULT FALSE;

-- Agregar columna para rango objetivo del pack
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS target_rank TEXT;

-- Agregar constraint para validar valores de target_rank
ALTER TABLE products 
DROP CONSTRAINT IF EXISTS valid_target_rank;

ALTER TABLE products 
ADD CONSTRAINT valid_target_rank 
CHECK (target_rank IS NULL OR target_rank IN ('bronze', 'silver', 'gold', 'BRONCE', 'PLATA', 'ORO'));

-- Comentarios para documentación
COMMENT ON COLUMN products.is_pack IS 'Indica si el producto es un pack que otorga rango al comprarlo';
COMMENT ON COLUMN products.target_rank IS 'Rango que otorga el pack al ser comprado (bronze, silver, gold)';

-- ============================================================================
-- 3. ACTUALIZACIÓN DE TABLA WAREHOUSES
-- ============================================================================

-- La tabla warehouses ya existe, pero vamos a asegurarnos de que tenga la estructura correcta
-- Verificar y agregar columnas si no existen

-- Asegurar que la columna 'address' existe (ya debería existir como TEXT)
-- Si necesitas simplificar, puedes usar solo 'address' en lugar de campos separados

-- Nota: La tabla warehouses ya tiene la estructura básica necesaria:
-- - id (UUID)
-- - name (VARCHAR)
-- - address (TEXT)
-- - is_active (BOOLEAN)

-- ============================================================================
-- 4. POLÍTICAS RLS PARA WAREHOUSES
-- ============================================================================

-- Habilitar RLS en la tabla warehouses si no está habilitado
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer warehouses activos
DROP POLICY IF EXISTS "Anyone can view active warehouses" ON warehouses;
CREATE POLICY "Anyone can view active warehouses"
ON warehouses
FOR SELECT
USING (is_active = TRUE);

-- Política: Solo admins pueden insertar warehouses
DROP POLICY IF EXISTS "Only admins can insert warehouses" ON warehouses;
CREATE POLICY "Only admins can insert warehouses"
ON warehouses
FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
);

-- Política: Solo admins pueden actualizar warehouses
DROP POLICY IF EXISTS "Only admins can update warehouses" ON warehouses;
CREATE POLICY "Only admins can update warehouses"
ON warehouses
FOR UPDATE
USING (
  auth.role() = 'authenticated' AND
  (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
);

-- Política: Solo admins pueden eliminar warehouses (soft delete)
DROP POLICY IF EXISTS "Only admins can delete warehouses" ON warehouses;
CREATE POLICY "Only admins can delete warehouses"
ON warehouses
FOR DELETE
USING (
  auth.role() = 'authenticated' AND
  (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
);

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================

-- Verificar que las columnas se agregaron correctamente
DO $$
BEGIN
  -- Verificar orders
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'payment_proof_url'
  ) THEN
    RAISE EXCEPTION 'Columna payment_proof_url no existe en orders';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'admin_notes'
  ) THEN
    RAISE EXCEPTION 'Columna admin_notes no existe en orders';
  END IF;

  -- Verificar products
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'is_pack'
  ) THEN
    RAISE EXCEPTION 'Columna is_pack no existe en products';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'target_rank'
  ) THEN
    RAISE EXCEPTION 'Columna target_rank no existe en products';
  END IF;

  RAISE NOTICE 'Migración completada exitosamente';
END $$;

