-- ============================================================================
-- MIGRACIÓN: Configuración de Usuario y Tienda Personalizada
-- Fecha: 2024
-- Descripción: Tablas para métodos de pago, redes sociales y tienda personalizada
-- ============================================================================

-- ============================================================================
-- 1. TABLA DE MÉTODOS DE PAGO (Para retiros)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    method_type VARCHAR(50) NOT NULL, -- 'BANK_ACCOUNT', 'PAYPAL', 'WISE', 'WESTERN_UNION', 'YAPE', 'PLIN', 'OTHER'
    provider_name VARCHAR(100), -- Nombre del banco o servicio (ej: "BCP", "Interbank", "PayPal")
    account_number VARCHAR(200), -- Número de cuenta, teléfono (Yape/Plin), o email (PayPal)
    account_holder_name VARCHAR(200), -- Nombre del titular
    routing_number VARCHAR(50), -- Para cuentas bancarias (CCI)
    swift_code VARCHAR(50), -- Para transferencias internacionales
    currency VARCHAR(10) DEFAULT 'PEN', -- Moneda de la cuenta
    is_default BOOLEAN DEFAULT FALSE, -- Método predeterminado para retiros
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT, -- Notas adicionales
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_method_type CHECK (method_type IN ('BANK_ACCOUNT', 'PAYPAL', 'WISE', 'WESTERN_UNION', 'YAPE', 'PLIN', 'OTHER')),
    CONSTRAINT valid_currency CHECK (currency IN ('PEN', 'USD', 'EUR'))
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_user_payment_methods_user_id ON user_payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_user_payment_methods_default ON user_payment_methods(user_id, is_default) WHERE is_default = TRUE;

-- Comentarios
COMMENT ON TABLE user_payment_methods IS 'Métodos de pago configurados por usuarios para recibir retiros';
COMMENT ON COLUMN user_payment_methods.method_type IS 'Tipo de método: cuenta bancaria, PayPal, Yape, Plin, etc.';
COMMENT ON COLUMN user_payment_methods.account_number IS 'Número de cuenta, teléfono (Yape/Plin) o email (PayPal)';
COMMENT ON COLUMN user_payment_methods.is_default IS 'Método predeterminado para retiros automáticos';

-- ============================================================================
-- 2. TABLA DE REDES SOCIALES
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- 'FACEBOOK', 'INSTAGRAM', 'WHATSAPP', 'TIKTOK', 'YOUTUBE', 'LINKEDIN', 'TWITTER'
    url TEXT NOT NULL, -- URL completa del perfil o número de WhatsApp
    display_name VARCHAR(200), -- Nombre a mostrar (opcional)
    is_public BOOLEAN DEFAULT TRUE, -- Si se muestra en tienda personalizada
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, platform),
    CONSTRAINT valid_platform CHECK (platform IN ('FACEBOOK', 'INSTAGRAM', 'WHATSAPP', 'TIKTOK', 'YOUTUBE', 'LINKEDIN', 'TWITTER', 'OTHER'))
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_social_links_user_id ON user_social_links(user_id);
CREATE INDEX IF NOT EXISTS idx_user_social_links_public ON user_social_links(user_id, is_public) WHERE is_public = TRUE;

-- Comentarios
COMMENT ON TABLE user_social_links IS 'Enlaces a redes sociales del usuario para mostrar en su tienda personalizada';
COMMENT ON COLUMN user_social_links.url IS 'URL completa del perfil o número de WhatsApp (formato: +51987654321)';
COMMENT ON COLUMN user_social_links.is_public IS 'Si se muestra en la tienda personalizada del usuario';

-- ============================================================================
-- 3. TABLA DE TIENDA PERSONALIZADA
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE, -- Un usuario = una tienda
    store_name VARCHAR(200), -- Nombre de la tienda (opcional, por defecto usa public_name)
    store_description TEXT, -- Descripción de la tienda
    store_banner_url TEXT, -- URL del banner de la tienda
    store_logo_url TEXT, -- URL del logo de la tienda
    store_theme VARCHAR(50) DEFAULT 'default', -- Tema de colores: 'default', 'blue', 'green', 'purple', etc.
    is_active BOOLEAN DEFAULT TRUE, -- Si la tienda está activa
    custom_domain VARCHAR(200), -- Dominio personalizado (opcional, futuro)
    seo_keywords TEXT, -- Palabras clave para SEO
    view_count INTEGER DEFAULT 0, -- Contador de visitas
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_theme CHECK (store_theme IN ('default', 'blue', 'green', 'purple', 'orange', 'pink', 'dark'))
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_stores_user_id ON user_stores(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stores_active ON user_stores(user_id, is_active) WHERE is_active = TRUE;

-- Comentarios
COMMENT ON TABLE user_stores IS 'Configuración de tienda personalizada para cada usuario';
COMMENT ON COLUMN user_stores.store_name IS 'Nombre personalizado de la tienda (si no se especifica, usa public_name)';
COMMENT ON COLUMN user_stores.custom_domain IS 'Dominio personalizado para la tienda (futuro)';

-- ============================================================================
-- 4. ACTUALIZACIÓN DE TABLA PROFILES
-- ============================================================================

-- Agregar campo para WhatsApp (separado del teléfono general)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(20);

-- Agregar campo para tipo de WhatsApp (personal o business)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS whatsapp_type VARCHAR(20) DEFAULT 'personal';

-- Constraint para whatsapp_type
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS valid_whatsapp_type;

ALTER TABLE profiles 
ADD CONSTRAINT valid_whatsapp_type 
CHECK (whatsapp_type IN ('personal', 'business'));

-- Comentarios
COMMENT ON COLUMN profiles.whatsapp_number IS 'Número de WhatsApp (personal o business)';
COMMENT ON COLUMN profiles.whatsapp_type IS 'Tipo de WhatsApp: personal o business';

-- ============================================================================
-- 5. TRIGGER PARA ACTUALIZAR updated_at
-- ============================================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para las nuevas tablas
DROP TRIGGER IF EXISTS update_user_payment_methods_updated_at ON user_payment_methods;
CREATE TRIGGER update_user_payment_methods_updated_at
    BEFORE UPDATE ON user_payment_methods
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_social_links_updated_at ON user_social_links;
CREATE TRIGGER update_user_social_links_updated_at
    BEFORE UPDATE ON user_social_links
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_stores_updated_at ON user_stores;
CREATE TRIGGER update_user_stores_updated_at
    BEFORE UPDATE ON user_stores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 6. POLÍTICAS RLS (Row Level Security)
-- ============================================================================

-- Habilitar RLS en las nuevas tablas
ALTER TABLE user_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stores ENABLE ROW LEVEL SECURITY;

-- Políticas para user_payment_methods
-- Los usuarios solo pueden ver/editar sus propios métodos de pago
DROP POLICY IF EXISTS "Users can view their own payment methods" ON user_payment_methods;
CREATE POLICY "Users can view their own payment methods"
    ON user_payment_methods FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own payment methods" ON user_payment_methods;
CREATE POLICY "Users can insert their own payment methods"
    ON user_payment_methods FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own payment methods" ON user_payment_methods;
CREATE POLICY "Users can update their own payment methods"
    ON user_payment_methods FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own payment methods" ON user_payment_methods;
CREATE POLICY "Users can delete their own payment methods"
    ON user_payment_methods FOR DELETE
    USING (auth.uid() = user_id);

-- Políticas para user_social_links
DROP POLICY IF EXISTS "Users can view their own social links" ON user_social_links;
CREATE POLICY "Users can view their own social links"
    ON user_social_links FOR SELECT
    USING (auth.uid() = user_id OR is_public = TRUE);

DROP POLICY IF EXISTS "Users can insert their own social links" ON user_social_links;
CREATE POLICY "Users can insert their own social links"
    ON user_social_links FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own social links" ON user_social_links;
CREATE POLICY "Users can update their own social links"
    ON user_social_links FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own social links" ON user_social_links;
CREATE POLICY "Users can delete their own social links"
    ON user_social_links FOR DELETE
    USING (auth.uid() = user_id);

-- Políticas para user_stores
-- Los usuarios pueden ver su propia tienda y las tiendas públicas de otros
DROP POLICY IF EXISTS "Users can view stores" ON user_stores;
CREATE POLICY "Users can view stores"
    ON user_stores FOR SELECT
    USING (auth.uid() = user_id OR is_active = TRUE);

DROP POLICY IF EXISTS "Users can insert their own store" ON user_stores;
CREATE POLICY "Users can insert their own store"
    ON user_stores FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own store" ON user_stores;
CREATE POLICY "Users can update their own store"
    ON user_stores FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own store" ON user_stores;
CREATE POLICY "Users can delete their own store"
    ON user_stores FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- NOTAS IMPORTANTES
-- ============================================================================
-- 1. Los métodos de pago están encriptados en la aplicación (no en la BD)
-- 2. Las URLs de redes sociales deben validarse en el frontend
-- 3. La tienda personalizada se accede mediante: /store/[referral_code]
-- 4. Solo un método de pago puede ser "default" por usuario
-- 5. Los datos sensibles (cuentas bancarias) deben encriptarse antes de guardar

