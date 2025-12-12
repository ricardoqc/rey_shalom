# 🔧 Configuración de Variables de Entorno

## ⚠️ ERROR ACTUAL

Estás viendo este error porque faltan las variables de entorno de Supabase:

```
Error: Your project's URL and Key are required to create a Supabase client!
```

## ✅ SOLUCIÓN RÁPIDA

### Paso 1: Crear archivo `.env.local`

En la carpeta `app/`, crea un archivo llamado `.env.local` (sin comillas) con el siguiente contenido:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### Paso 2: Obtener tus credenciales de Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto (o créalo si no tienes uno)
3. Ve a **Settings** (⚙️) → **API**
4. Copia los siguientes valores:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Paso 3: Pegar en `.env.local`

Tu archivo `.env.local` debería verse así (con tus valores reales):

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2ODAwMCwiZXhwIjoxOTU0NTQ0MDAwfQ.abcdefghijklmnopqrstuvwxyz1234567890
```

### Paso 4: Reiniciar el servidor

Después de crear el archivo `.env.local`:

1. Detén el servidor (Ctrl+C en la terminal)
2. Inicia nuevamente: `npm run dev`

## 📝 Notas Importantes

- ⚠️ **NUNCA** subas el archivo `.env.local` a Git (ya está en `.gitignore`)
- ✅ El archivo `env.example` es solo una plantilla, no se usa directamente
- 🔄 Si cambias las variables, debes reiniciar el servidor de desarrollo

## 🆘 Si aún tienes problemas

1. Verifica que el archivo se llame exactamente `.env.local` (con el punto al inicio)
2. Verifica que esté en la carpeta `app/` (no en la raíz del proyecto)
3. Verifica que no haya espacios extra en las variables
4. Verifica que las URLs y keys sean correctas (copia y pega directamente desde Supabase)

