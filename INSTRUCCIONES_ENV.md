# 🔧 Instrucciones para Configurar .env.local

## ✅ Archivo Creado

He creado el archivo `.env.local` en la carpeta `app/`. 

## ⚠️ IMPORTANTE: Reemplaza los Valores

El archivo actualmente tiene valores de placeholder. **DEBES reemplazarlos** con tus credenciales reales de Supabase.

### Paso 1: Obtener tus credenciales

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto (o créalo si no tienes uno)
3. Ve a **Settings** (⚙️) → **API**
4. Copia estos valores:
   - **Project URL** → Reemplaza `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → Reemplaza `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Paso 2: Editar el archivo

Abre el archivo `app/.env.local` y reemplaza los valores:

**ANTES (valores de placeholder):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

**DESPUÉS (tus valores reales):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2ODAwMCwiZXhwIjoxOTU0NTQ0MDAwfQ.abcdefghijklmnopqrstuvwxyz1234567890
```

### Paso 3: Reiniciar el servidor

**MUY IMPORTANTE:** Después de editar el archivo:

1. **Detén el servidor** (presiona `Ctrl+C` en la terminal donde está corriendo)
2. **Inicia nuevamente:**
   ```bash
   npm run dev
   ```

## ✅ Verificación

Si todo está correcto, deberías ver:
- ✅ El servidor inicia sin errores
- ✅ No aparece el mensaje "Variables de entorno de Supabase no configuradas"
- ✅ La aplicación carga correctamente

## 🆘 Si aún tienes problemas

1. Verifica que el archivo se llame exactamente `.env.local` (con el punto al inicio)
2. Verifica que esté en la carpeta `app/` (no en la raíz del proyecto)
3. Verifica que no haya espacios extra alrededor del `=`
4. Verifica que las URLs y keys sean correctas (copia y pega directamente desde Supabase)
5. **Asegúrate de haber reiniciado el servidor** después de editar el archivo

