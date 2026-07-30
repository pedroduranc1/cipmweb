# Tareas de Mejora — Módulo de Cursos

> Análisis realizado el 2026-07-30. Archivos principales en `/pages/cursos/`, `/db/Cursos/index.js`, `/minicomponents/Cursocard.jsx`.

### Progreso de sesión (2026-07-30)
- ✅ Dependencias actualizadas: `firebase` 10.7.1→10.14.1, Radix UI, formik, react-player, postcss, tipos TS
- ✅ Next.js actualizado a 12.3.7 (última versión 12.x con parches de seguridad)
- ✅ Vulnerabilidades reducidas: 31→26, críticas 3→0
- ✅ `[SEGURIDAD]` UIDs hardcodeados eliminados — ahora usa `User?.role === "admin"` desde Firestore
- ✅ `[BUG]` Race condition de auth guard corregida en 11 páginas
- ✅ `[BUG]` Query keys de videos ahora incluyen `CursoID` — evita mostrar videos del curso anterior
- ✅ `[BUG]` `deleteCurso` usa `Promise.all()` — videos se eliminan correctamente
- ✅ `[BUG]` `useFormik({})` huérfano eliminado de `crear-curso`

**Pendiente antes de hacer deploy:** Agregar campo `role: "admin"` en Firestore a los documentos de los 3 usuarios admin en la colección `users`.

---

## 🔴 Crítico — Bugs y Seguridad

- [x] **[SEGURIDAD] Eliminar UIDs de admin hardcodeados** ✅  
  `pages/cursos/index.jsx` — Reemplazado por `User?.role === "admin"`. Nuevo método `getRole(uid)` en `db/User/index.js` lee el campo `role` de Firestore. Campo `role` se carga al hacer login en `AuthContext`.  
  **Acción requerida:** Agregar `role: "admin"` en Firestore → colección `users` → documentos de los 3 admins.

- [x] **[BUG] Corregir async/await en `deleteCurso`** ✅  
  `db/Cursos/index.js` — Cambiado a `Promise.all(curso.videos.map(...))`.

- [x] **[BUG] Race condition en protección de rutas** ✅  
  11 páginas corregidas — ahora usan `if (!loading && !User)` con `loading` expuesto desde `AuthContext`.

- [x] **[BUG] Query key fija para videos por curso** ✅  
  `pages/cursos/[curso]/index.jsx` — Keys cambiadas a `["curso", CursoID]` y `["videos", CursoID]` con `enabled: !!CursoID`.

- [x] **[BUG] `formik.resetForm()` llama a instancia incorrecta** ✅  
  `pages/crear-curso/index.jsx` — `useFormik({})` huérfano eliminado.

---

## 🟡 Importante — Deuda Técnica

- [ ] **Renombrar variables "blog" a "curso"/"video"**  
  `db/Cursos/index.js` — Variables como `blogRef`, `blogId`, `blogData` en métodos de cursos y videos. Son confusas y parecen copy-paste de otro módulo.  
  Afecta líneas: 47-50, 96, 107, 119, 158, 169, 181.

- [ ] **Unificar `activarCurso` y `desactivarCurso`**  
  `db/Cursos/index.js:233-253` — Ambos métodos hacen exactamente lo mismo (`updateDoc`). Reemplazar por un único `updateCursosCliente(userID, data)`.

- [ ] **Eliminar N+1 queries en `Cursocard`**  
  `minicomponents/Cursocard.jsx:13` — Cada tarjeta lanza su propia query `getCursosCliente`. Con 10 cursos son 10 llamadas. Mover la query al componente padre (`pages/cursos/index.jsx`) y pasar `active` como prop.

- [ ] **Normalizar manejo de errores en `db/Cursos/index.js`**  
  Actualmente mezcla: `return "Error"` (string), `throw "Error"` (string sin tipo), y `return false`. Unificar: lanzar `Error` con mensaje descriptivo en todos los casos.

- [ ] **Corregir mutación del array en `filtrarCursosPorFecha`**  
  `pages/cursos/[curso]/index.jsx:32` — `.sort()` muta `VideosData` directamente. Cambiar a `[...cursos].sort(...)`.

- [ ] **Eliminar `console.log` olvidado**  
  `pages/modificar-video/index.jsx:105` — `console.log(VideosFiltados)` de debug. Eliminarlo.

- [ ] **Eliminar `<></>` vacíos innecesarios**  
  Múltiples páginas retornan `(<></>)` en lugar de `null` en ramas condicionales vacías.

- [ ] **Corregir `getCursosCliente`: separar read de write**  
  `db/Cursos/index.js:197-220` — Un método de lectura no debería crear documentos como side effect. Separar en `getCursosCliente(id)` (solo lectura) y `initCursosCliente(id)` (creación).

---

## 🟢 Mejoras de UX / UI

- [ ] **Agregar skeletons de carga en listado de cursos**  
  `pages/cursos/index.jsx:78` — El estado de carga muestra texto plano `"Cargando Cursos.."`. Reemplazar con skeleton cards que respeten el grid existente.

- [ ] **Mostrar estado de error en listado de cursos**  
  `pages/cursos/index.jsx` — `isError` se desestructura pero nunca se usa. Mostrar mensaje de error al usuario cuando falla la query.

- [ ] **Agregar confirmación antes de eliminar curso o video**  
  `pages/eliminar-curso/index.jsx` y `pages/eliminar-video/index.jsx` — No hay modal de confirmación. Un click elimina permanentemente. Agregar diálogo de confirmación con nombre del elemento a eliminar.

- [ ] **Convertir campo Descripción a `<textarea>`**  
  `pages/crear-curso/index.jsx:86` y `pages/modificar-curso/index.jsx:129` — La descripción usa `<input type="text">`. Cambiar a `<Field as="textarea">` para textos largos.

- [ ] **Agregar preview de imagen antes de subir**  
  `pages/crear-curso/index.jsx` y `pages/modificar-curso/index.jsx` — Al seleccionar archivo no se muestra preview. Mostrar `<img src={URL.createObjectURL(file)}>` al seleccionar.

- [ ] **Organizar botones de admin con jerarquía visual**  
  `pages/cursos/index.jsx:44-70` — Los 8 botones admin están en un solo bloque sin agrupación. Separar en secciones: "Cursos", "Videos", "Clientes".

- [ ] **Agregar `object-cover` a imágenes de cursos**  
  `minicomponents/Cursocard.jsx:31` — La imagen no tiene `object-fit`, se deforma en distintas resoluciones. Agregar `object-cover` y fijar altura explícita al contenedor.

- [ ] **Corregir dimensiones de `ReactPlayer` en mobile**  
  `pages/cursos/[curso]/video/[video]/index.jsx:38` — El player no tiene dimensiones explícitas y se comporta erráticamente en mobile. Usar `width="100%" height="100%"` con contenedor de aspecto fijo (p.ej. `aspect-video`).

- [ ] **Corregir `htmlFor` apuntando a `"password"` en formularios**  
  `pages/crear-curso/index.jsx:85,94,103` y `pages/modificar-curso/index.jsx` — Labels con `htmlFor="password"` por error de copy-paste. Actualizar a los nombres de campo correctos.

- [ ] **Mostrar estado de carga en `Cursocard` mientras verifica acceso**  
  `minicomponents/Cursocard.jsx` — Mientras `isLoading` es true, el componente no muestra nada o hace flash del estado incorrecto. Mostrar skeleton o estado neutral hasta que `isLoading` sea false.

- [ ] **Agregar estado de error en página de video**  
  `pages/cursos/[curso]/video/[video]/index.jsx` — Si el video no existe o la URL falla, no se muestra ningún mensaje. Agregar manejo de `isError` y URL inválida.

---

## 🔵 Refactoring (Largo Plazo)

- [ ] **Migrar páginas a nombres de componente en PascalCase**  
  Múltiples páginas exportan `const index = ()` en minúscula, lo que viola las reglas de React y rompe Fast Refresh. Renombrar a `const CursosPage`, `const CrearCursoPage`, etc.

- [ ] **Extraer custom hooks para lógica de cursos**  
  Crear `hooks/useCursos.js`, `hooks/useCursoDetalle.js`, `hooks/useClienteCursos.js` para reusar lógica de fetching sin repetir queries.

- [ ] **Consolidar componentes de video duplicados**  
  Existen `Videocard.jsx`, `VideoCard2.jsx` y `cardVideo.jsx` con funcionalidad similar. Unificar en un solo componente con props.

- [ ] **Agregar tipos TypeScript a datos de Firestore**  
  Crear `types/cursos.ts` con interfaces `Curso`, `Video`, `CursosCliente` para tener autocompletado y validación en tiempo de compilación.

- [ ] **Actualizar React Query a v5**  
  La versión actual (v3) está desactualizada. v5 tiene mejor API (`useQuery` sin isLoading/isError separado), mejor TypeScript, y devtools mejorados.

- [ ] **Validar `VideoUrl` con Yup en agregar/modificar video**  
  `pages/agregar-video/index.jsx` — El campo `VideoUrl` no tiene validación. Agregar `Yup.string().url("Ingresa una URL válida").required()`.

---

## Orden sugerido para empezar

1. Bug query key de videos (impacto inmediato en datos incorrectos)
2. Race condition de auth guard (UX rota para usuarios legítimos)
3. Skeletons + estados de error (percepción de calidad)
4. Confirmaciones de eliminación (prevenir pérdida de datos)
5. Renombrar variables "blog" + limpiar console.log (deuda técnica rápida)
6. Eliminar UIDs hardcodeados (seguridad, requiere cambios en Firestore)
