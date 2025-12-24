# 🛠️ Configuración del Panel de Administración

Este documento contiene las instrucciones para configurar el panel de administración y la funcionalidad de subida de imágenes.

## 📋 Pasos de Configuración

### 1. Crear Bucket de Supabase Storage

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **Storage** en el menú lateral
3. Haz clic en **New Bucket**
4. Configura el bucket:
   - **Nombre**: `product-images`
   - **Public bucket**: ✅ Marca esta opción (para que las imágenes sean accesibles públicamente)
5. Haz clic en **Create bucket**

### 2. Ejecutar Políticas RLS para Storage

1. Ve al **SQL Editor** en Supabase Dashboard
2. Abre el archivo `setup_storage.sql` que está en la raíz del proyecto `app/`
3. Copia y pega todo el contenido en el SQL Editor
4. Haz clic en **Run** para ejecutar las políticas

Esto creará las políticas de seguridad que permiten:
- **SELECT**: Cualquiera puede ver las imágenes (público)
- **INSERT/UPDATE/DELETE**: Solo usuarios con rol `admin` pueden subir/modificar/eliminar imágenes

### 3. Agregar Campo `image_url` a la Tabla Products

1. Ve al **SQL Editor** en Supabase Dashboard
2. Abre el archivo `add_image_url_to_products.sql` que está en la raíz del proyecto `app/`
3. Copia y pega el contenido en el SQL Editor
4. Haz clic en **Run** para ejecutar

Esto agregará el campo `image_url` a la tabla `products` para almacenar las URLs de las imágenes.

### 4. Verificar Instalación de Dependencias

Las siguientes dependencias ya deberían estar instaladas:
- `react-hook-form`
- `zod`
- `@hookform/resolvers`

Si no están instaladas, ejecuta:
```bash
cd app
npm install react-hook-form zod @hookform/resolvers
```

## 🎯 Funcionalidades Implementadas

### Panel de Administración (`/admin`)

- **Dashboard General**: Vista general con estadísticas del sistema
- **Productos**: CRUD completo de productos
  - Crear productos con formulario validado
  - Subir imágenes a Supabase Storage
  - Listar todos los productos
  - Editar productos (página pendiente)
  - Eliminar productos
- **Inventario**: Gestión de stock por sucursal
  - Ver stock actual por producto y sucursal
  - Agregar stock a productos en cualquier sucursal
- **Usuarios/Afiliados**: (Pendiente de implementar)

### Características Técnicas

- ✅ Layout con sidebar oscura responsiva
- ✅ Protección de rutas (solo usuarios con `role: 'admin'`)
- ✅ Hook personalizado `useImageUpload` para subida de imágenes
- ✅ Validación de formularios con `react-hook-form` y `zod`
- ✅ Server Actions para operaciones CRUD
- ✅ Integración con Supabase Storage
- ✅ Notificaciones con `sonner`

## 🔐 Seguridad

- Las rutas `/admin/*` están protegidas por middleware
- Solo usuarios con `role: 'admin'` pueden acceder
- Las políticas RLS de Storage solo permiten operaciones a admins
- Validación de datos en cliente y servidor

## 📝 Notas Importantes

1. **Tamaño máximo de imagen**: 5MB
2. **Formatos soportados**: PNG, JPG, GIF, y otros formatos de imagen
3. **Almacenamiento**: Las imágenes se guardan en `product-images/products/` en Supabase Storage
4. **URLs públicas**: Las imágenes son accesibles públicamente una vez subidas

## 🐛 Solución de Problemas

### Error: "Bucket not found"
- Verifica que hayas creado el bucket `product-images` en Supabase Storage
- Asegúrate de que el bucket sea público

### Error: "Permission denied"
- Verifica que hayas ejecutado las políticas RLS del archivo `setup_storage.sql`
- Confirma que tu usuario tenga el rol `admin` en `user_metadata` o `app_metadata`

### Error: "Column image_url does not exist"
- Ejecuta el SQL del archivo `add_image_url_to_products.sql` en Supabase

### Las imágenes no se muestran
- Verifica que el bucket sea público
- Revisa la consola del navegador para ver errores de CORS
- Confirma que la URL de la imagen sea válida

## 🚀 Próximos Pasos

- [ ] Implementar página de edición de productos
- [ ] Agregar funcionalidad de eliminar imágenes del Storage al eliminar productos
- [ ] Implementar gestión de usuarios/afiliados
- [ ] Agregar filtros y búsqueda en la lista de productos
- [ ] Implementar paginación en las tablas

