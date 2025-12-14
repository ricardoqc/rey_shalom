# Solución: Error al Crear Super Admin - Trigger handle_new_user()

## Problema

Al intentar crear el super admin, se produce un error 500 con el mensaje:
```
Database error creating new user
```

Este error ocurre porque el trigger `handle_new_user()` en Supabase está fallando cuando se crea un usuario con `admin.createUser()`.

## Causa

El trigger `handle_new_user()` se ejecuta automáticamente cuando se crea un nuevo usuario en Supabase Auth. Si este trigger falla (por ejemplo, al intentar crear el perfil en la tabla `profiles`), Supabase retorna un error 500.

## Solución

### Opción 1: Corregir el Trigger en Supabase (Recomendado)

1. **Ve al Dashboard de Supabase**
   - Abre tu proyecto en [supabase.com](https://supabase.com)
   - Navega a **Database** → **Functions** o **Database** → **Triggers**

2. **Busca el trigger `handle_new_user()`**
   - Este trigger probablemente está en la tabla `auth.users`
   - Se ejecuta después de un INSERT en `auth.users`

3. **Revisa la función del trigger**
   - Ve a **Database** → **Functions** y busca la función relacionada
   - O revisa el SQL del trigger en **Database** → **Triggers**

4. **Verifica que la función pueda:**
   - Insertar en la tabla `profiles` con el `service_role`
   - Generar un `referral_code` único
   - Manejar errores correctamente

### Opción 2: SQL para Corregir el Trigger

Ejecuta este SQL en el SQL Editor de Supabase:

```sql
-- Primero, verifica si existe el trigger
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Si el trigger existe, puedes deshabilitarlo temporalmente
-- ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;

-- O corregir la función handle_new_user()
-- Asegúrate de que la función tenga manejo de errores:

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  referral_code_value TEXT;
BEGIN
  -- Generar código de referido único
  referral_code_value := 'USER-' || UPPER(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
  
  -- Intentar insertar el perfil
  INSERT INTO public.profiles (
    id,
    public_name,
    referral_code,
    status_level,
    current_points,
    total_points_earned,
    is_active,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'public_name', split_part(NEW.email, '@', 1)),
    referral_code_value,
    'BRONCE',
    0,
    0,
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING; -- Evitar errores si el perfil ya existe
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log del error pero no fallar la creación del usuario
    RAISE WARNING 'Error al crear perfil para usuario %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Asegúrate de que el trigger esté configurado correctamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### Opción 3: Verificar Políticas RLS

Asegúrate de que las políticas RLS permitan la inserción:

```sql
-- Verificar políticas RLS en la tabla profiles
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Si es necesario, crear una política que permita al service_role insertar
CREATE POLICY "Service role can insert profiles"
ON public.profiles
FOR INSERT
TO service_role
WITH CHECK (true);
```

### Opción 4: Crear Usuario Manualmente

Si necesitas una solución rápida:

1. Ve a **Authentication** → **Users** en el dashboard de Supabase
2. Crea el usuario manualmente con:
   - Email: `admin@reyshalom.com` (o el que configuraste)
   - Password: `admin123456` (o el que configuraste)
   - Marca "Auto Confirm User"
3. Luego ejecuta la función de creación de admin nuevamente para crear el perfil

## Verificación

Después de corregir el trigger:

1. Intenta crear el super admin nuevamente desde la página `/setup`
2. Si aún falla, revisa los logs en **Logs** → **Postgres Logs** en Supabase
3. Verifica que el perfil se haya creado correctamente en la tabla `profiles`

## Notas

- El trigger debe usar `SECURITY DEFINER` para tener permisos suficientes
- El trigger debe manejar errores con `EXCEPTION` para no fallar la creación del usuario
- Usa `ON CONFLICT DO NOTHING` para evitar errores si el perfil ya existe


