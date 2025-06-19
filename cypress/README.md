# Tests de Autenticación con Cypress

## Descripción

Este conjunto de tests automatizados verifica el funcionamiento completo del sistema de autenticación, incluyendo login, logout, persistencia de datos y casos edge.

## Estructura de Tests

### 1. `auth.cy.ts` - Tests principales
- **Login de Cliente**: Verifica login exitoso, credenciales inválidas, validación de RUT
- **Login de Administrador**: Tests específicos para usuarios admin
- **Logout**: Verificación de cierre de sesión y limpieza de cookies
- **Navegación**: Redirecciones después de autenticación
- **Persistencia**: Mantenimiento de datos entre recargas

### 2. `auth-simple.cy.ts` - Tests básicos y estables ⭐
- **Tests simplificados** sin dependencias complejas
- **Verificaciones esenciales** de login/logout
- **Más robustos** y menos propensos a errores
- **Recomendado para empezar**

### 3. `auth-edge-cases.cy.ts` - Casos edge
- **Errores de red**: Timeout, errores de servidor
- **Validación**: Campos vacíos, longitud de contraseña
- **Estados de loading**: Botones deshabilitados, indicadores
- **Seguridad**: Ocultación de contraseñas, prevención de multiple submit
- **Accesibilidad**: Navegación por teclado, labels
- **Cookies**: Manejo de cookies corruptas

## Comandos Personalizados

### `cy.loginAsClient(rut, password)`
```typescript
cy.loginAsClient('12.312.312-3', 'password');
```
Realiza login como cliente y verifica el éxito.

### `cy.loginAsAdmin(rut, password)`
```typescript
cy.loginAsAdmin('12.312.312-3', 'password');
```
Realiza login como administrador.

### `cy.logout()`
```typescript
cy.logout();
```
Cierra sesión y verifica la limpieza completa.

### `cy.checkUserData(expectedData)`
```typescript
cy.checkUserData({
  name: 'Juan Pérez',
  email: 'juan@example.com',
  rut: '12.312.312-3',
  roles: ['cliente']
});
```
Verifica que los datos del usuario estén correctos.

## Cómo Ejecutar los Tests

### Modo interactivo (recomendado para desarrollo)
```bash
npm run test:auth:open
# o
npm run cypress:open
```

### Modo headless (para CI/CD)
```bash
# Tests básicos y estables (recomendado)
npm run test:auth:simple

# Tests completos
npm run test:auth

# Todos los tests
npm run cypress:run
```

### Solo tests específicos
```bash
# Tests básicos
npm run test:auth:simple

# Tests principales
npm run test:auth
```

## Configuración

### Datos de prueba
Los tests usan las credenciales del modo QA:
- **RUT**: `12.312.312-3`
- **Contraseña**: `password`

### URLs base
- Cliente: `http://localhost:3000/auth/login`
- Admin: `http://localhost:3000/auth/login-admin`

## Elementos que deben tener data-cy

Para que los tests funcionen correctamente, asegúrate de que estos elementos tengan los atributos `data-cy`:

```html
<!-- Botón de login -->
<button data-cy="btn-login">Iniciar Sesión</button>

<!-- Modal de logout -->
<button data-cy="confirm-logout">Continuar</button>
<button data-cy="cancel-logout">Cancelar</button>
```

## Casos de Test Cubiertos

### ✅ Funcionalidad Básica
- [x] Login exitoso cliente
- [x] Login exitoso admin
- [x] Logout completo
- [x] Credenciales inválidas
- [x] Persistencia después de recarga
- [x] Redirecciones correctas

### ✅ Validaciones
- [x] Formato de RUT
- [x] Campos obligatorios
- [x] Longitud de contraseña

### ✅ Seguridad
- [x] Limpieza de cookies en logout
- [x] Prevención de acceso sin auth
- [x] Manejo de tokens expirados

### ✅ UX/UI
- [x] Estados de loading
- [x] Mensajes de error
- [x] Navegación por teclado
- [x] Accesibilidad

### ✅ Casos Edge
- [x] Errores de red
- [x] Cookies corruptas
- [x] Multiple submit
- [x] Timeouts

## Estructura de Archivos

```
cypress/
├── e2e/
│   ├── auth.cy.ts              # Tests principales
│   ├── auth-edge-cases.cy.ts   # Casos edge
│   └── client_login.cy.ts      # Test original (deprecado)
├── support/
│   ├── commands.ts             # Comandos personalizados
│   ├── index.d.ts             # Definiciones TypeScript
│   └── e2e.ts                 # Configuración
└── cypress.config.ts          # Configuración principal
```

## Mejores Prácticas

1. **Limpieza**: Cada test limpia cookies y localStorage antes de ejecutar
2. **Atomicidad**: Cada test es independiente
3. **Comandos reutilizables**: Funcionalidad común en comandos personalizados
4. **Datos de test**: Usar datos consistentes del modo QA
5. **Esperas inteligentes**: Usar `cy.wait()` y `should()` apropiadamente

## Debugging

Para debuggear tests:

1. **Modo interactivo**: Usa `npm run test:auth:open`
2. **Screenshots**: Se toman automáticamente en fallos
3. **Videos**: Disponibles en modo headless
4. **Console logs**: Visibles en DevTools del navegador de Cypress

## Integración CI/CD

Para integrar en pipelines:

```yaml
# Ejemplo para GitHub Actions
- name: Cypress Tests
  run: |
    npm ci
    npm run build
    npm start &
    npm run test:auth
```

## Notas Importantes

- Los tests asumen que QA_MODE=true está configurado
- Requiere que el servidor de desarrollo esté corriendo
- Los datos de prueba deben coincidir con el mock configurado
- Las cookies se verifican como parte integral de la autenticación
