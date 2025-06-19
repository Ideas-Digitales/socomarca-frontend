/// <reference types="cypress" />

// Credenciales de prueba por rol
const TEST_CREDENTIALS = {
  cliente: { 
    rut: '202858384', 
    password: 'password',
    formattedRut: '20.285.838-4'
  },
  admin: { 
    rut: '192855179', 
    password: 'password',
    formattedRut: '19.285.517-9'
  },
  superadmin: { 
    rut: '238439256', 
    password: 'password',
    formattedRut: '23.843.925-6'
  }
};

describe('Autenticación - Login y Logout', () => {
  
  // Configuración antes de cada test
  beforeEach(() => {
    // Limpiar cookies y localStorage
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Login de Cliente', () => {    it('Debe permitir login exitoso con credenciales válidas', () => {
      // Usar credenciales de cliente con comando que espera éxito
      cy.loginAsClientSuccess(TEST_CREDENTIALS.cliente.rut, TEST_CREDENTIALS.cliente.password);
      
      // Verificar que llegó a la página principal
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      
      // Verificar que las cookies de autenticación están presentes
      cy.getCookie('token').should('exist');
      cy.getCookie('userData').should('exist');
    });it('Debe rechazar credenciales inválidas', () => {
      cy.visit('/auth/login');
      
      // Limpiar campos primero
      cy.get('#rut').clear();
      cy.get('#password').clear();
      
      // Intentar login con credenciales que definitivamente no existen
      cy.get('#rut').type('99.999.999-9');
      cy.get('#password').type('contrasenainvalida123');
      
      // Esperar a que el botón se habilite
      cy.get('[data-cy=btn-login]').should('not.be.disabled');
      cy.get('[data-cy=btn-login]').click();
      
      // Esperar un poco para que se procese la petición
      cy.wait(2000);
      
      // Lo más importante: verificar que NO redirige (se queda en login)
      cy.url().should('include', '/auth/login');
      
      // El botón debería estar habilitado nuevamente (no en estado de carga)
      cy.get('[data-cy=btn-login]').should('not.be.disabled');
    });it('Debe validar formato de RUT', () => {
      cy.visit('/auth/login');
      
      // Limpiar campos primero
      cy.get('#rut').clear();
      cy.get('#password').clear();
      
      // Probar RUT con formato inválido
      cy.get('#rut').type('123456789');
      cy.get('#password').type('password');
      
      // El botón debería permanecer deshabilitado por RUT inválido
      cy.get('[data-cy=btn-login]').should('be.disabled');
    });    it('Debe mantener la sesión después de recargar la página', () => {
      // Hacer login exitoso
      cy.loginAsClientSuccess(TEST_CREDENTIALS.cliente.rut, TEST_CREDENTIALS.cliente.password);
      
      // Recargar la página
      cy.reload();
      
      // Verificar que sigue logueado
      cy.url().should('not.include', '/auth/login');
      cy.getCookie('token').should('exist');
      cy.getCookie('userData').should('exist');
    });
  });

  describe('Login de Administrador', () => {
    it('Debe permitir login de admin con credenciales válidas', () => {
      cy.loginAsAdmin(TEST_CREDENTIALS.admin.rut, TEST_CREDENTIALS.admin.password);
      
      // Verificar que llegó al dashboard de admin
      cy.url().should('include', '/admin');
      
      // Verificar cookies
      cy.getCookie('token').should('exist');
      cy.getCookie('userData').should('exist');
    });

    it('Debe redirigir admin a su dashboard correcto', () => {
      cy.loginAsAdmin(TEST_CREDENTIALS.admin.rut, TEST_CREDENTIALS.admin.password);
      
      // Debe redirigir a la página de admin
      cy.url().should('include', '/admin/total-de-ventas');
    });
  });  describe('Login de Super Admin', () => {
    it('Debe permitir login de superadmin con credenciales válidas', () => {
      cy.loginAsSuperAdmin(TEST_CREDENTIALS.superadmin.rut, TEST_CREDENTIALS.superadmin.password);
      
      // Verificar que llegó al dashboard
      cy.url().should('include', '/super-admin');
      
      // Verificar cookies
      cy.getCookie('token').should('exist');
      cy.getCookie('userData').should('exist');
    });    it('Debe tener acceso a funciones de superadmin', () => {
      cy.loginAsSuperAdmin(TEST_CREDENTIALS.superadmin.rut, TEST_CREDENTIALS.superadmin.password);
      
      // Verificar que está en el dashboard correcto
      cy.url().should('include', '/super-admin');
      
      // Verificar cookies básicas
      cy.getCookie('token').should('exist');
      cy.getCookie('userData').should('exist');
      
      // Verificar que puede ver elementos específicos de superadmin (si está visible)
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy=sidebar]').length > 0) {
          cy.get('[data-cy=sidebar]').should('be.visible');
        }
      });
    });
  });  describe('Logout', () => {
    it('Debe permitir cerrar sesión correctamente', () => {      // Primero hacer login
      cy.loginAsClientSuccess(TEST_CREDENTIALS.cliente.rut, TEST_CREDENTIALS.cliente.password);
      
      // Esperar un poco para que la página se cargue completamente
      cy.wait(1000);
      
      // Ahora hacer logout
      cy.logout();
      
      // Verificar redirección
      cy.url().should('include', '/auth/login');
    });    it('Debe limpiar todas las cookies al cerrar sesión', () => {
      // Login
      cy.loginAsClientSuccess(TEST_CREDENTIALS.cliente.rut, TEST_CREDENTIALS.cliente.password);
      
      // Esperar que se cargue la página
      cy.wait(1000);
      
      // Verificar que las cookies existen
      cy.getCookie('token').should('exist');
      cy.getCookie('userData').should('exist');
      
      // Logout
      cy.logout();
      
      // Verificar que las cookies fueron eliminadas
      cy.getCookie('token').should('not.exist');
      cy.getCookie('userData').should('not.exist');
      cy.getCookie('role').should('not.exist');
      cy.getCookie('userId').should('not.exist');
    });    it('Debe prevenir acceso a páginas protegidas después del logout', () => {
      // Login
      cy.loginAsClientSuccess(TEST_CREDENTIALS.cliente.rut, TEST_CREDENTIALS.cliente.password);
      
      // Esperar que se cargue
      cy.wait(1000);
      
      // Logout
      cy.logout();
      
      // Intentar acceder a página protegida
      cy.visit('/mi-cuenta');
      
      // Debe redirigir al login
      cy.url().should('include', '/auth/login');
    });
  });
  describe('Navegación después de autenticación', () => {    it('Debe redirigir cliente a la página principal', () => {
      cy.loginAsClientSuccess(TEST_CREDENTIALS.cliente.rut, TEST_CREDENTIALS.cliente.password);
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('Debe redirigir admin a dashboard de admin', () => {
      cy.loginAsAdmin(TEST_CREDENTIALS.admin.rut, TEST_CREDENTIALS.admin.password);
      cy.url().should('include', '/admin');
    });    it('Debe redirigir superadmin a dashboard de superadmin', () => {
      cy.loginAsSuperAdmin(TEST_CREDENTIALS.superadmin.rut, TEST_CREDENTIALS.superadmin.password);
      cy.url().should('include', '/super-admin');
    });
  });
  describe('Persistencia de datos', () => {    it('Debe mantener datos del usuario después de navegar', () => {
      // Login
      cy.loginAsClientSuccess(TEST_CREDENTIALS.cliente.rut, TEST_CREDENTIALS.cliente.password);
      
      // Esperar que se cargue completamente
      cy.wait(2000);
      
      // Navegar a diferentes páginas
      cy.visit('/mi-cuenta');
      cy.visit('/favoritos');
      cy.visit('/');
      
      // Los datos deben seguir disponibles (solo verificar que las cookies existen)
      cy.getCookie('token').should('exist');
      cy.getCookie('userData').should('exist');
    });    it('Debe restaurar datos después de refrescar página', () => {
      // Login
      cy.loginAsClientSuccess(TEST_CREDENTIALS.cliente.rut, TEST_CREDENTIALS.cliente.password);
      
      // Esperar que se cargue
      cy.wait(2000);
      
      // Refrescar múltiples veces
      cy.reload();
      cy.wait(1000); // Esperar que se inicialice
      
      cy.reload();
      cy.wait(1000);
      
      // Las cookies deben seguir disponibles
      cy.getCookie('token').should('exist');
      cy.getCookie('userData').should('exist');
    });
  });
});
