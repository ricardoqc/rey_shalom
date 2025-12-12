# Configuración del Proyecto - Rey Shalom ERP

## 📋 Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto `app/` con las siguientes variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Cómo obtener estas variables:

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **Settings > API**
3. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🚀 Instalación

1. Instala las dependencias:
```bash
cd app
npm install
```

2. Configura las variables de entorno (ver arriba)

3. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

## 📁 Estructura del Proyecto

```
app/
├── app/                          # App Router de Next.js
│   ├── auth/                     # Páginas de autenticación
│   │   ├── login/
│   │   ├── signup/
│   │   └── callback/
│   ├── dashboard/                # Dashboard protegido
│   ├── layout.tsx                # Layout principal (incluye Navbar)
│   └── page.tsx                  # Página de inicio
├── components/
│   ├── auth/                     # Componentes de autenticación
│   │   ├── login-form.tsx
│   │   └── signup-form.tsx
│   └── navbar.tsx                # Navbar con estados dinámicos
├── utils/
│   └── supabase/
│       ├── client.ts             # Cliente para Client Components
│       ├── server.ts             # Cliente para Server Components
│       └── middleware.ts         # Helper para middleware
├── types/
│   └── supabase.ts               # Tipos TypeScript de Supabase
├── middleware.ts                 # Middleware principal (protección de rutas + referidos)
└── .env.local                    # Variables de entorno (crear manualmente)
```

## 🔐 Funcionalidades Implementadas

### 1. Autenticación
- ✅ Login con email/password
- ✅ Registro con validación de código de referido
- ✅ Protección de rutas (`/dashboard/*`, `/admin/*`)
- ✅ Redirección automática según estado de autenticación

### 2. Rastreo de Referidos (MLM)
- ✅ Detección de parámetro `?ref=CODIGO` en cualquier URL
- ✅ Almacenamiento en cookie `sponsor_ref` (30 días)
- ✅ Pre-llenado automático en formulario de registro
- ✅ Validación en tiempo real del código de referido

### 3. Navbar Inteligente
- **Estado A**: Visitante con cookie de referido → Muestra barra superior con código
- **Estado B**: Usuario autenticado → Muestra "Mi Oficina Virtual" y "Cerrar Sesión"
- **Estado C**: Visitante limpio → Botones estándar de Login/Registro

### 4. Middleware
- ✅ Actualización automática de sesión de Supabase
- ✅ Protección de rutas según autenticación y rol
- ✅ Rastreo de referidos en todas las páginas

## 🎯 Próximos Pasos

1. **Configurar RLS Policies** en Supabase para las tablas
2. **Generar tipos de Supabase**:
   ```bash
   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
   ```
3. **Implementar páginas adicionales**:
   - Catálogo de productos
   - Carrito de compras
   - Panel de administración
   - Árbol genealógico MLM

## 📝 Notas Importantes

- El middleware valida que el código de referido exista en la base de datos antes de guardarlo en la cookie
- El trigger `handle_new_user()` en Supabase crea automáticamente el perfil cuando se registra un usuario
- Los códigos de referido se pasan a través de `user_metadata` en el signup
- El rol de admin se verifica desde `user_metadata.role` o `app_metadata.role`

