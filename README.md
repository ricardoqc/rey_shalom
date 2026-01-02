# Rey Shalom ERP - Aplicación Next.js

Esta es la aplicación frontend y backend del sistema Rey Shalom ERP, construida con Next.js 16.

## 🚀 Inicio Rápido

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📋 Prerrequisitos

Antes de iniciar la aplicación, asegúrate de:

1. **Configurar Supabase**: Ver [../docs/SETUP_ENV.md](../docs/SETUP_ENV.md)
2. **Configurar Base de Datos**: Ejecutar scripts SQL en `../database/` (ver [../database/README.md](../database/README.md))
3. **Configurar Storage**: Crear buckets y ejecutar políticas (ver [../docs/ADMIN_SETUP.md](../docs/ADMIN_SETUP.md))

## 📁 Estructura

```
app/
├── app/                    # App Router de Next.js
│   ├── auth/              # Rutas de autenticación
│   ├── dashboard/         # Dashboard de usuario
│   ├── admin/             # Panel de administración
│   ├── shop/              # Tienda pública
│   └── checkout/          # Proceso de compra
├── components/            # Componentes React
│   ├── admin/            # Componentes del panel admin
│   ├── auth/             # Componentes de autenticación
│   ├── dashboard/        # Componentes del dashboard
│   └── ui/               # Componentes UI base
├── actions/               # Server Actions
├── hooks/                 # Custom React Hooks
├── lib/                   # Librerías y utilidades
├── types/                 # Tipos TypeScript
├── utils/                 # Utilidades
└── middleware.ts         # Middleware de Next.js
```

## 🛠️ Scripts Disponibles

```bash
npm run dev      # Desarrollo (puerto 3000)
npm run build    # Construir para producción
npm run start    # Iniciar servidor de producción
npm run lint     # Ejecutar ESLint
```

## 📚 Documentación

- **Configuración General**: Ver [../README.md](../README.md)
- **Setup Detallado**: Ver [../docs/README_SETUP.md](../docs/README_SETUP.md)
- **Configuración Admin**: Ver [../docs/ADMIN_SETUP.md](../docs/ADMIN_SETUP.md)
- **Variables de Entorno**: Ver [../docs/SETUP_ENV.md](../docs/SETUP_ENV.md)

## 🔧 Tecnologías

- **Framework**: Next.js 16 (App Router)
- **React**: 19.2.1
- **TypeScript**: 5.x
- **Estilos**: Tailwind CSS 4
- **Validación**: Zod + React Hook Form
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Storage**: Supabase Storage

## 📝 Notas

- Las variables de entorno deben estar en `.env.local` (no se sube a Git)
- El middleware protege las rutas `/dashboard/*` y `/admin/*`
- Los Server Actions están en `app/actions/`
- Los tipos de Supabase se generan desde la base de datos

---

Para más información, consulta la [documentación principal](../README.md).
