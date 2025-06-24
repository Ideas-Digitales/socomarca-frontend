# Tests de Cypress - Autenticación

Este directorio contiene los tests de end-to-end (E2E) para la funcionalidad de autenticación de la aplicación Socomarca.

## Estructura de Tests

### Tests Principales

1. **`debug.cy.ts`** - Tests básicos de debugging ⭐ **EMPEZAR AQUÍ**
   - Login exitoso de cliente
   - Login fallido con credenciales incorrectas  
   - Login exitoso de admin
   - Ideal para verificar que todo funciona correctamente

2. **`auth-basic.cy.ts`** - Tests básicos de autenticación
   - Login de cliente, admin y superadmin
   - Validación de credenciales incorrectas
   - Persistencia de sesión después de recargar

3. **`auth.cy.ts`** - Suite completa de tests de autenticación
   - Tests de login para todos los roles
   - Tests de logout
   - Tests de navegación después de autenticación
   - Tests de persistencia de datos

4. **`auth-edge-cases.cy.ts`** - Casos edge y validaciones
   - Validación de campos
   - Estados de loading
   - Seguridad básica
   - Accesibilidad
   - Manejo de cookies

## Credenciales de Prueba

```javascript
const TEST_CREDENTIALS = {
  cliente: { rut: '202858384', password: 'password' },
  admin: { rut: '192855179', password: 'password' },
  superadmin: { rut: '238439256', password: 'password' }
};
```

## Comandos Disponibles

### Ejecución de Tests

```bash
# Test de debugging (recomendado empezar aquí)
pnpm run test:debug

# Tests básicos
pnpm run test:auth:basic

# Suite completa de autenticación
pnpm run test:auth

# Casos edge
pnpm run test:auth:edge

# Todos los tests principales
pnpm run test:all

# Abrir Cypress UI
pnpm run test:auth:open
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
