# Contrato de la API del backend: 0.0.1 (producción) → 1.0.0

Fuente: issue [#483](https://github.com/Ideas-Digitales/socomarca-backend/issues/483) del backend,
rama `feat/random-entities-as-users`.

- `openapi-0.0.1-produccion.json`: API que opera hoy en producción
- `openapi-1.0.0.json`: API nueva (generada con Scramble)

La versión 1.0.0 rompe el contrato con el frontend actual. Backend y frontend deben desplegarse
coordinados.

> La mayoría de las diferencias entre ambos JSON son de documentación: códigos `403` que antes no se
> documentaban, esquemas más precisos y nombres de esquemas (`CartItemStoreRequest`,
> `WebpayTransactionResource`, etc.). Este documento lista solo los cambios de comportamiento, verificados
> contra el código.

## 1. Modelo de negocio nuevo

- Cada sucursal de una entidad de Random ERP es un **usuario** con rol `customer`:
  - `user_code`: código de entidad (KOEN), compartido por todas las sucursales de la entidad
  - `branch_code`: código de sucursal (SUEN), puede venir vacío
  - `branch_type`: `"P"` (principal) o `"S"` (secundaria); `null` para usuarios internos (admin, etc.)
- Tanto las sucursales principales como las secundarias pueden iniciar sesión.
- Una sucursal **secundaria** solo compra para sí misma.
- Una sucursal **principal** compra para sí misma y para las sucursales secundarias **activas** de su
  entidad.
- El login es por **email** (email comercial de Random, `EMAILCOMER`), no por RUT. Varias sucursales
  comparten el mismo RUT. Si un email está repetido en más de un usuario activo, nadie puede iniciar
  sesión con él (responde `401` igual que una contraseña incorrecta).
- Los datos de los clientes vienen de Random; la administración solo puede activarlos o desactivarlos.
- Los usuarios sincronizados se crean **sin contraseña**: el primer acceso se hace con "recuperar
  contraseña".

## 2. Autenticación

### `POST /auth/token` (login)

Request: `rut` se reemplaza por `email`. `device_name` es opcional. `role` nunca fue leído por el backend.

```json
{ "email": "compras@cliente.cl", "password": "secreta", "device_name": "web" }
```

Respuesta `200`:

```json
{
  "token": "12|abc...",
  "user": {
    "id": 15,
    "name": "500 SABORES SPA (DULCE UNA OESTE)",
    "rut": "77528378-1",
    "email": "compras@cliente.cl",
    "branch_type": "P",
    "can_order_for_branches": true,
    "roles": ["customer"],
    "permissions": ["read-own-addresses", "..."]
  },
  "extra": { "weak_password": false }
}
```

- **Nuevo** `user.branch_type`: `"P" | "S" | null`
- **Nuevo** `user.can_order_for_branches`: `true` solo si es sucursal principal con al menos una secundaria
  activa. Debe usarse para mostrar u ocultar el selector de sucursal. No depende de roles ni permisos.
- **Eliminado** `extra.missing_email`
- `user.rut` puede ser `null`

Errores:

| Antes | Ahora |
|---|---|
| `403` si el RUT no existía, `401` si la contraseña era incorrecta | Siempre `401` `{"message": "Unauthorized"}` ante cualquier credencial inválida (email inexistente, repetido, usuario inactivo o contraseña incorrecta) |
| `422` con `errors.rut` | `422` con `errors.email` / `errors.password` |

> `branch_type` y `can_order_for_branches` también vienen en `GET /profile` (ver más abajo), con el mismo
> valor que en el login. `can_order_for_branches` puede cambiar durante la sesión (ej. si se desactiva la
> única secundaria), por lo que `GET /profile` es la fuente para refrescarlo.

### `GET /profile`

Respuesta sin envoltorio `data`. **Nuevos** `branch_type` y `can_order_for_branches`, con la misma
definición que en el login. Las direcciones (`billing_address`, `default_shipping_address`) incluyen
`is_synced` (ver sección 4).

```json
{
  "rut": "77528378-1",
  "name": "500 SABORES SPA (DULCE UNA OESTE)",
  "business_name": "500 SABORES",
  "email": "compras@cliente.cl",
  "phone": null,
  "is_active": true,
  "branch_type": "P",
  "can_order_for_branches": true,
  "billing_address": null,
  "default_shipping_address": { "id": 34, "...": "...", "is_synced": true },
  "fcm_token": null
}
```

### `POST /auth/restore` (recuperar contraseña)

Request: `{ "email": "compras@cliente.cl" }` (antes `{ "rut": "..." }`).

Respuesta: **siempre** `200` con el email solicitado enmascarado, exista o no, para no revelar si está
registrado. La contraseña temporal solo se envía si el email corresponde a exactamente un usuario activo.

```json
{
  "message": "Si el correo c*****s@cliente.cl corresponde a una cuenta activa, recibirá una nueva contraseña provisional.",
  "data": { "email": "c*****s@cliente.cl" }
}
```

- **Eliminada** la variante con `data.missing_email` y `data.provisional_token`
- **Eliminado** el `403`. Sigue existiendo el `422` si falta `email`

### `PATCH /auth/credentials`: **eliminado**

Ya no existe el flujo "el usuario no tiene email, ingrese uno". Un usuario sin email no puede iniciar
sesión y debe pedir al cliente que lo registre en Random.

### Tokens de usuarios desactivados

Si un usuario es desactivado (por un administrador o porque desapareció de Random), **todos sus tokens
dejan de funcionar de inmediato**: cualquier ruta autenticada responde `401`. El frontend debe tratar un
`401` en cualquier llamada como sesión expirada (limpiar sesión y redirigir al login).

## 3. Sucursales

### `GET /branches?per_page=20&page=1`

Antes: sucursales (modelo `Branch`), protegido por el permiso `read-own-branches`.

Ahora: las sucursales **para las que el usuario autenticado puede emitir pedidos**, es decir, las
secundarias activas de su entidad, ordenadas por nombre y paginadas.

- **No incluye** al propio usuario (la sucursal principal no aparece en la lista)
- Para una sucursal secundaria o un usuario interno devuelve `data: []`
- Solo requiere autenticación (se eliminaron los permisos `read-own-branches` y `read-all-branches`)
- Cada sucursal incluye sus direcciones (`addresses`)

```json
{
  "data": [
    {
      "id": 231,
      "name": "500 SABORES SPA (LOCAL CERRILLOS)",
      "email": "cerrillos@cliente.cl",
      "billing_email": "dte@cliente.cl",
      "phone": "",
      "rut": "77528378-1",
      "business_name": "500 SABORES",
      "user_code": "77528378",
      "branch_code": "002",
      "branch_type": "S",
      "addresses": [
        {
          "id": 901,
          "address_line1": "AV AMÉRICO VESPUCIO 1501",
          "address_line2": null,
          "postal_code": null,
          "is_default": false,
          "type": "shipping",
          "phone": null,
          "contact_name": null,
          "municipality_name": "Cerrillos",
          "region_name": "Región Metropolitana",
          "alias": null,
          "is_synced": true
        }
      ]
    }
  ],
  "links": { "first": "...", "last": "...", "prev": null, "next": null },
  "meta": { "current_page": 1, "last_page": 1, "per_page": 20, "total": 1, "...": "..." }
}
```

Cambios de campos respecto de producción:

| Producción (0.0.1) | 1.0.0 |
|---|---|
| `id` (id de `branches`) | `id` (id del **usuario** de la sucursal; es el `customer_id` del pago) |
| `code` | `branch_code` |
| `commercial_email` | `email` |
| `email` (facturación) | `billing_email` |
| `user` (objeto) | eliminado |
| — | `user_code`, `branch_type`, `addresses` |

### `GET /branches/{branch}`

Misma estructura que un elemento del listado (dentro de `data`). `{branch}` es el id de usuario de la
sucursal. Responde `404` si no existe **o** si el usuario autenticado no puede emitir pedidos para ella.

## 4. Direcciones

- `GET /addresses` devuelve las direcciones del usuario autenticado, incluida su dirección sincronizada
  desde Random (siempre `type: "shipping"`).
- **Nuevo** `is_synced` (`boolean`) en todas las direcciones (`GET /addresses`, `GET /addresses/{id}`,
  `GET /profile`, `GET /branches`): `true` si la dirección la administra la sincronización con Random.
- Las direcciones sincronizadas no se pueden editar ni eliminar: `PUT/PATCH/DELETE /addresses/{id}`
  responde `403`. El frontend debe ocultar esas acciones cuando `is_synced` es `true`.
- `is_synced` no se puede enviar al crear o editar una dirección (`422`).
- **No existe** `addresses.branch_id` ni el filtro `GET /addresses?branch_id=` (fue un diseño intermedio
  que nunca llegó a producción). Las direcciones de una sucursal secundaria se obtienen desde
  `GET /branches` o `GET /branches/{id}` (`addresses`).

## 5. Pago: `POST /orders/pay`

Request: `branch_id` se reemplaza por `customer_id` (opcional; por defecto, el usuario autenticado).

```json
{
  "customer_id": 231,
  "address_id": 901,
  "payment_method": "transbank",
  "payment_document_type": "receipt",
  "notes": "Entregar en bodega"
}
```

Reglas:

- `customer_id` debe ser el propio usuario o una sucursal de `GET /branches`. Para comprar para sí mismo,
  omitir `customer_id`.
- `address_id` debe pertenecer al **customer** (no al usuario que compra):
  - Compra propia: una dirección de `GET /addresses`
  - Compra para una sucursal: una de `branch.addresses`
- Quien **paga y factura** es siempre el usuario autenticado, también cuando compra para una sucursal:
  - Los precios son los de **sus** listas de precios, igual que en el catálogo y el carrito: el total
    cobrado es el total del carrito
  - El crédito (`random_credit`) que se consulta y descuenta es el **suyo** (el de
    `GET /users/{id}/credit-line` con su propio `id`)
  - La nota de venta (NVV) en Random usa su código de entidad y el código de sucursal del `customer`
- Respuestas `200`, flujo Webpay y crédito: sin cambios de estructura, salvo que la orden ahora trae
  `customer` en lugar de `branch` (ver sección 6).

Errores `422` nuevos:

```json
{ "message": "...", "errors": { "customer_id": ["No puede emitir pedidos para el cliente indicado."] } }
```

```json
{ "message": "...", "errors": { "address_id": ["La dirección no pertenece al cliente del pedido."] } }
```

Productos sin precio vigente en las listas del usuario (**sin** clave `errors`; no se crea la orden y el
carrito se conserva). En el carrito esos productos aparecen con `price: 0`:

```json
{
  "message": "Algunos productos del carrito no tienen precio vigente",
  "products": [{ "id": 12, "name": "Harina 25 kg", "sku": "HAR25", "unit": "kg" }]
}
```

## 6. Órdenes

### Recurso de orden (`GET /orders`, respuesta del pago, retorno de Webpay)

- **Eliminado** `branch`
- **Nuevo** `customer`: sucursal a la que se despacha el pedido (quien paga y factura es `user`)

```json
"customer": {
  "id": 231,
  "name": "500 SABORES SPA (LOCAL CERRILLOS)",
  "user_code": "77528378",
  "branch_code": "002",
  "branch_type": "S"
}
```

- `user` sigue siendo el usuario que **emitió** el pedido (modelo completo)
- **Nuevo** `order_items[].price_list_id`: código de la lista de precios usada (`null` en pedidos
  antiguos)

### `GET /orders`

Ahora incluye los pedidos emitidos **por** el usuario y los emitidos **para** él. Una sucursal secundaria
ve los pedidos que su principal hizo para ella (en ese caso `user.id` ≠ usuario autenticado). Los
parámetros no cambian (`sort` admite `id` | `created_at`, `sort_direction` admite `asc` | `desc`).

### `POST /cart/add-order` (repetir pedido)

Permite repetir pedidos emitidos por el usuario o para él. Los precios del carrito se recalculan con las
listas del usuario que repite el pedido.

### `POST /orders/cancel`

Cancela una orden que sigue en espera de boleta (BLV) o factura (FCV): no está documentada, cobrada ni
despachada. Elimina la nota de venta (NVV) en Random, deja la orden y su pago a crédito en `canceled` y
desbloquea la línea de crédito si ese pago la había bloqueado.

Quién puede cancelar:

- El usuario que realizó el pedido (`order.user.id`), hasta `cancelable_until`. El plazo empieza cuando
  se autoriza el pago a crédito y dura `ORDER_CANCELLATION_WINDOW_MINUTES` (60 por defecto).
- Admin y superadmin, con **ambos** permisos `read-all-orders` y `cancel-orders`, pueden cancelar
  cualquier pedido y no tienen ese límite de tiempo.

La sucursal para la que se compró no puede cancelar. Si A compró para B, B recibe 403.

```json
{ "order_number": 1234 }
```

`order_number` es `orders.id`, el número de orden de compra.

`GET /orders` incluye en cada orden, siempre, estos campos (pueden ser `null`):

```json
{
  "cancelable_until": "2026-10-22T13:00:00+00:00",
  "cancel_seconds_remaining": 3540
}
```

`cancelable_until` es la fecha límite en ISO 8601. `cancel_seconds_remaining` son los segundos que
quedaban al armar la respuesta; `0` significa que el plazo del comprador ya venció. Van en `null` cuando
ese usuario no puede cancelar la orden.

Respuesta `200`: `data` es la orden (`status: "canceled"`) y `message` es el texto a mostrar.

```json
{ "message": "La orden fue cancelada." }
```

`PaymentResource` ahora incluye `status`: `processing` | `completed` | `failed` | `canceled`. `canceled`
es un pago a crédito cancelado antes de que Random emitiera la factura.

Errores:

| Código | Cuerpo | Cuándo |
|---|---|---|
| `422` | `message` y `errors.order_number` | Número vacío o inválido, orden inexistente, orden que no está en espera de facturación, o plazo del comprador vencido (`La orden ya no se puede cancelar porque venció el plazo.`) |
| `403` | `{ "message": "This action is unauthorized." }` | El usuario no realizó ese pedido |
| `500` | Texto de la API | Random rechazó el borrado; la orden, el pago y la línea de crédito no cambian |

## 7. Línea de crédito: `GET /users/{user}/credit-line`

La estructura de la respuesta no cambia. `CRSD` es el límite otorgado (`CRTO` de `/web32/entidades`) y
`CRSDVU` el uso de `/gestion/credito/resumen`; el `CRSD` de ese resumen no se usa. Si el resumen responde
404, la sucursal no tiene movimientos y el uso queda en cero, pero el límite otorgado se sigue
devolviendo. Un 404 de este endpoint ahora significa que la sucursal no tiene crédito otorgado en el
maestro de entidades.

Un cliente solo puede consultar **su propia** línea de crédito (`read-own-credit-lines`), que es la que
se usa al pagar con crédito, también cuando compra para una sucursal.

## 8. Administración de usuarios

### `UserResource` (`GET /users`, `GET /users/{id}`, `POST /users/search`, etc.)

- **Nuevo** `is_synced`: `true` si el usuario proviene de Random
- **Nuevo** `branch_type`: `"P" | "S" | null`
- Las sucursales secundarias ahora son clientes (`customer`) y aparecen en los listados de clientes

### `POST /users`

- `roles` pasa a ser **obligatorio** (`array`, mínimo 1)
- El rol `customer` **no se puede asignar** (`422`)
- El RUT ya no es único (varias sucursales comparten RUT)
- El email se normaliza (minúsculas, sin espacios) antes de validar unicidad

### `PUT /users/{user}` y `PATCH /users/{user}`

- Usuarios internos (`is_synced: false`): igual que antes, pero no se puede asignar `customer`
- Usuarios sincronizados (`is_synced: true`): **solo** se permite `is_active` (y `fcm_token`). Enviar
  `name`, `email`, `phone`, `password` o `roles` responde `422` (`prohibited`). Con `PUT`, `is_active`
  es obligatorio; con `PATCH`, opcional

```json
// PATCH /users/15
{ "is_active": false }
```

### Permisos eliminados

`read-own-branches` y `read-all-branches` ya no existen (tampoco en `GET /permissions` ni en los roles).

## 9. Limitaciones conocidas del backend 1.0.0

1. Reportes y exportaciones de la administración siguen basados en `orders.user_id` (quien emite);
   pendiente de definición.

## 10. Endpoints sin cambios de comportamiento

Productos, categorías, marcas, favoritos, carrito (estructura), métodos de pago, Webpay, notificaciones,
FAQ, contenido del sitio, configuración y reportes. Las diferencias en el OpenAPI de estos endpoints son
solo de documentación.
