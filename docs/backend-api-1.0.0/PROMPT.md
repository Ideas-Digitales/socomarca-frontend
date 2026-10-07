# Prompt: adaptar el frontend a la API del backend 1.0.0

Copiar desde "Contexto" hasta el final en una sesión de Cursor abierta en `socomarca-frontend`, adjuntando:

- `@docs/backend-api-1.0.0/CONTRATO-API-1.0.0.md` (obligatorio: contrato y ejemplos)
- `@docs/backend-api-1.0.0/openapi-1.0.0.json` (referencia exacta de esquemas; consultarlo por endpoint, no
  leerlo completo)
- `@docs/backend-api-1.0.0/openapi-0.0.1-produccion.json` (solo si hace falta comparar con producción)

Se recomienda empezar en modo Plan, revisar el plan y luego ejecutarlo por fases, con un commit por fase.

---

## Contexto

El backend de Socomarca (Laravel) publica la versión 1.0.0 de su API, que rompe el contrato con este
frontend. Cada sucursal de una entidad de Random ERP pasa a ser un usuario que puede iniciar sesión; una
sucursal principal puede comprar para sus sucursales secundarias; el login y la recuperación de contraseña
pasan de RUT a email. El contrato completo, con ejemplos de request y response, está en
`docs/backend-api-1.0.0/CONTRATO-API-1.0.0.md`: es la fuente de verdad. Ante cualquier duda sobre un
campo, consultar `openapi-1.0.0.json` antes de suponer.

Ambos deben desplegarse juntos: el frontend resultante solo tiene que funcionar con la API 1.0.0, no hace
falta compatibilidad con la 0.0.1.

## Stack y convenciones del proyecto

- Next.js 16 (app router), React 19, TypeScript estricto, Tailwind 4, zustand 5, pnpm
- Todas las llamadas al backend están en server actions `'use server'` en `src/services/actions/*.actions.ts`,
  con `fetch` nativo y `Authorization: Bearer` leído desde la cookie httpOnly `token`
  (`src/stores/base/utils/cookiesManagement.ts`). Base URL: `BACKEND_URL` (`src/utils/getEnv.ts`), que ya
  termina en `/api`
- Sesión: cookies `token`, `role`, `permissions`, `userId` y `userData` (JSON), escritas en
  `auth.actions.ts` y rehidratadas por `src/app/api/internal/auth/route.ts` y
  `authSlice.initializeFromAuth`. `src/middleware.ts` valida el token con `GET /auth/check-token`
- Formularios con `useState` y validaciones manuales (no hay zod ni react-hook-form; no agregarlos)
- Textos de UI en español. Seguir el estilo y nombres del código existente; no refactorizar lo que no
  se toca
- No hay tests ni script de typecheck: verificar con `pnpm build` (que hace el chequeo de tipos)
- Commits con gitmoji y estilo convencional en español, ej. `✨ feat(auth): iniciar sesión con email`

## Antes de empezar

1. La rama `qa` tiene cambios **sin commitear** de un diseño intermedio que nunca llegó a producción
   (`finalizar-compra/page.tsx`, `branch.interface.ts`, `branches.actions.ts`, `addressees.actions.ts`,
   `DireccionesSection.tsx`, `checkout-branches-frontend.md`). Se basan en `addresses.branch_id`,
   `GET /addresses?branch_id=` y un `GET /branches` que incluía a la principal: **nada de eso existe en la
   API 1.0.0**. El selector de sucursal del checkout se puede reutilizar como base visual, pero el contrato
   debe reemplazarse. No descartar esos cambios sin preguntarme; propón cómo integrarlos.
2. `package.json` tiene un cambio local (`NODE_TLS_REJECT_UNAUTHORIZED=0` en `dev`) que no debe
   commitearse.
3. Crear la rama `feat/backend-api-1.0.0` desde `qa`.

## Tareas

### Fase 1: tipos y sesión

- `src/interfaces/user.interface.ts`: agregar a `User` `branch_type: 'P' | 'S' | null` y
  `can_order_for_branches: boolean`; quitar `missing_email` de `LoginResponse.extra` (conservar
  `weak_password`). Agregar `is_synced: boolean` y `branch_type` al `ApiUser` de administración
- `src/interfaces/branch.interface.ts`: redefinir `Branch` según `GET /branches` 1.0.0 (`id`, `name`,
  `email`, `billing_email`, `phone`, `rut`, `business_name`, `user_code`, `branch_code`, `branch_type`,
  `addresses`), reutilizando el tipo de dirección existente en vez de duplicarlo
- `src/interfaces/order.interface.ts`: reemplazar `branch: Branch` por
  `customer?: { id; name; user_code; branch_code; branch_type }` y agregar
  `price_list_id: string | null` a `OrderItem`. Eliminar el `Branch` local de ese archivo
- Persistir `branch_type` y `can_order_for_branches` (vienen en el login) en la cookie `userData` y en el
  auth store, y rehidratarlos en `initializeFromAuth`. `GET /profile` también los devuelve: el checkout
  debe usar el valor de `GET /profile` (que ya consulta para precargar los datos) para decidir si muestra
  el selector, ya que `can_order_for_branches` puede cambiar durante la sesión. Agregar ambos campos al
  `ApiUser` de `/profile` en `user.actions.ts`
- Agregar `is_synced: boolean` al tipo de dirección
- Manejo de `401`: el backend revoca de inmediato los tokens de usuarios desactivados. En las server
  actions que se modifiquen en este trabajo, un `401` debe tratarse como sesión expirada (limpiar cookies
  de sesión y redirigir al login correspondiente). Crear un helper pequeño y reutilizable para esto; no
  migrar todas las actions del proyecto

### Fase 2: login y recuperación de contraseña

- `auth.actions.ts` (`fetchLogin`), `authSlice.login` y `src/stores/base/types.ts`: enviar
  `{ email, password }` en lugar de `rut`. Normalizar el email (`trim` y minúsculas) antes de enviarlo.
  Actualizar el mock de QA y el mensaje de error (`Email o contraseña incorrectos.`)
- El backend responde `401` ante cualquier credencial inválida (ya no `403`); los `422` vienen en
  `errors.email` / `errors.password`
- `LoginForm.tsx`: reemplazar `RutInput` por un input de email (`type="email"`, `autoComplete="email"`),
  con validación básica de formato para habilitar el envío. Aplica a `/auth/login` y `/auth/login-admin`.
  Conservar `RutInput` y los helpers de RUT: los siguen usando los formularios de administración
- Recuperación (`sendRecoveryEmail` y las páginas `src/app/auth/recuperar/page.tsx` y
  `recuperar-admin/page.tsx`): enviar `{ email }`. La respuesta siempre es `200` con el email enmascarado
  en `data.email`, exista o no la cuenta: mostrar el paso "revisa tu correo" con `message` del backend.
  Eliminar el paso `add-email`, `updateCredentialsAction` (`PATCH /auth/credentials` ya no existe) y todo
  uso de `provisional_token` / `missing_email`
- Agregar en el login un texto de ayuda breve: los clientes ingresan con su email comercial y, si es su
  primer acceso, deben usar "¿Olvidaste tu contraseña?" (los usuarios sincronizados se crean sin
  contraseña)

### Fase 3: checkout con selección de sucursal

Pantalla: `src/app/(private)/finalizar-compra/page.tsx`, más `redirect/page.tsx` y `order.actions.ts`.

- Mostrar el selector "Comprar para" **solo** si `can_order_for_branches` es `true` (desde `GET /profile`,
  con el valor de la sesión como respaldo). Si es `false`
  (sucursal secundaria, principal sin secundarias), el checkout funciona como hoy, comprando para sí mismo
- Opciones del selector:
  - Primera opción, seleccionada por defecto: el propio usuario ("Mi sucursal"), con sus direcciones de
    `GET /addresses`. Al pagar **no** se envía `customer_id`
  - Luego, las sucursales de `GET /branches` (el listado no incluye al propio usuario). Recorrer todas las
    páginas o usar un `per_page` alto (ej. 100). Etiqueta sugerida: `{name} · {branch_code} · Secundaria`
- Dirección: al elegir una sucursal, usar sus `addresses` (vienen en el listado; no llamar a
  `GET /addresses?branch_id=`, que no existe). Si tiene más de una, permitir elegir; si no tiene ninguna,
  bloquear el pago con un mensaje claro. Al volver a "Mi sucursal", restaurar sus direcciones
- `createOrderFromCart` (`order.actions.ts`): reemplazar `branch_id` por `customer_id`, enviándolo solo
  cuando se compra para otra sucursal. Renombrar también la clave de `localStorage` `branchId` que usan
  `finalizar-compra` y `redirect` (ej. `customerId`), y limpiar la anterior
- Precios: el carrito muestra los precios del usuario autenticado, pero el backend recalcula el pedido con
  las listas de precios de la sucursal destino. Cuando se compra para otra sucursal, mostrar un aviso
  visible: el total final se calcula con los precios de la sucursal seleccionada y puede diferir del
  mostrado. (La previsualización del total por sucursal llegará en
  [backend #486](https://github.com/Ideas-Digitales/socomarca-backend/issues/486); no implementarla ahora)
- Errores del pago en `redirect/page.tsx` (hoy solo muestra `body.message`):
  - `422` con `products`: mostrar la lista de productos sin precio para la sucursal (nombre, SKU y
    unidad), indicar que el carrito se conservó y ofrecer volver al carrito o al checkout
  - `422` con `errors.customer_id` o `errors.address_id`: mostrar el mensaje del campo y volver al
    checkout
  - Mantener el manejo actual de Webpay y de las respuestas de crédito (`success: false`)
- Crédito: la principal no puede consultar el crédito de una secundaria (`GET /users/{id}/credit-line`
  solo permite el propio). Si se elige una secundaria con pago a crédito, no mostrar el crédito disponible
  propio como si fuera el de la sucursal: indicar que el crédito de la sucursal se valida al confirmar el
  pago (la consulta del crédito de la sucursal también llegará en #486)

### Fase 4: direcciones

- `addressees.actions.ts`: eliminar `branch_id` del tipo `Address` y el parámetro `branch_id` de
  `getUserAddresses`
- `DireccionesSection.tsx`: hoy decide qué dirección es de solo lectura con `branch_id != null`. Usar
  `is_synced` en su lugar: si es `true`, ocultar editar y eliminar y mostrar una etiqueta como
  "Sincronizada desde Random ERP". Como respaldo, si editar o eliminar responde `403`, mostrar "Esta
  dirección proviene de Random ERP y no se puede modificar". No inferir que es sincronizada por `type`
- No enviar `is_synced` al crear o editar direcciones (el backend responde `422`)

### Fase 5: órdenes

- `src/utils/mapOrderToCompra.ts`: construir `sucursal` desde `order.customer` (`name`, `branch_code`)
  en lugar de `order.branch`
- `ComprasSection.tsx` y `DetalleCompra.tsx`: mostrar la sucursal destino. Cuando el pedido lo emitió otro
  usuario (`order.user.id !== user.id`, ej. la principal compró para esta secundaria), mostrar
  "Emitido por {order.user.name}"
- Repetir pedido (`POST /cart/add-order`): sin cambios de contrato; verificar que funcione también con
  pedidos emitidos para el usuario

### Fase 6: administración de usuarios

Archivos: `src/app/(administrador)/super-admin/users/page.tsx` (modal de edición),
`super-admin/create-user/page.tsx`, `user.actions.ts`, `src/configs/permisos.ts`.

- Usuarios sincronizados (`is_synced: true`): en el modal de edición, mostrar los datos en solo lectura con
  una etiqueta "Sincronizado desde Random" y el tipo de sucursal (Principal / Secundaria), y permitir solo
  activar o desactivar. Guardar con `PATCH /users/{id}` enviando únicamente `{ is_active }`
  (`patchUserAction`). Cualquier otro campo responde `422`
- Usuarios internos: conservar el formulario actual, pero dejar de forzar `is_active: true` en cada
  edición (hoy reactiva a cualquier usuario editado); agregar el control de activo/inactivo
- Creación: `roles` es obligatorio y nunca puede incluir `customer` (`ROLES_ASIGNABLES` ya lo excluye;
  mantenerlo así). El RUT ya no es único: no agregar validaciones de unicidad
- Mostrar los `errors` de `422` por campo en creación y edición, si hoy no se muestran
- Listados de clientes: las sucursales secundarias ahora aparecen como clientes; mostrar `branch_type`
  como columna o etiqueta donde haya listados de clientes

## Fuera de alcance

- Reportes y exportaciones de administración (pendiente de definición en el backend)
- Previsualizar el total del carrito y consultar el crédito de otra sucursal (el backend aún no lo
  soporta; [backend #486](https://github.com/Ideas-Digitales/socomarca-backend/issues/486))
- UX de `extra.weak_password` (hoy no se usa)
- Migrar todas las actions a un cliente HTTP común
- Bug existente: `logoutAction` llama a `${BACKEND_URL}/api/auth/token` (duplica `/api`). Puede corregirse
  en un commit aparte si es trivial, avisándome

## Verificación

1. `pnpm build` sin errores de tipos
2. Buscar restos del contrato anterior; no deben quedar usos de:
   `rut:` en el body de login o recuperación, `missing_email`, `provisional_token`, `/auth/credentials`,
   `branch_id`, `order.branch`, `commercial_email`, `.code` sobre sucursales
3. Prueba manual contra el backend local (rama `feat/random-entities-as-users`) con:
   - Una sucursal principal con secundarias activas: ve el selector, compra para sí misma y para una
     secundaria (Webpay y crédito), y ve ambos pedidos con la sucursal correcta
   - Una sucursal secundaria: no ve el selector, ve los pedidos que la principal hizo para ella con
     "Emitido por"
   - Un administrador: login por email en `/auth/login-admin`; edita un usuario interno y
     activa/desactiva un cliente sincronizado
   - Login con email inexistente o contraseña incorrecta: mensaje de credenciales inválidas
   - Recuperación con un email inexistente: mismo mensaje que con uno existente
   - Desactivar desde la administración a un cliente con sesión abierta: su siguiente acción lo envía al
     login
4. Usuarios de prueba: consultarlos en la base del backend, por ejemplo
   `select id, email, user_code, branch_code, branch_type, is_active from users where branch_type is not null order by user_code, branch_type;`
   Los usuarios sincronizados no tienen contraseña: obtenerla con "recuperar contraseña" (en local el
   correo llega a Mailpit)

## Forma de trabajo

- Antes de editar, proponer un plan por fases con los archivos a modificar y señalar cualquier punto del
  contrato que no calce con el código
- Un commit por fase, con `pnpm build` en verde antes de cada commit
- Si un campo o comportamiento del backend no está claro en el contrato ni en el OpenAPI, preguntar en vez
  de suponer
