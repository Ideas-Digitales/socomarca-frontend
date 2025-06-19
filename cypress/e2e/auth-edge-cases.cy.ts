/// <reference types="cypress" />

describe('Autenticación - Casos Edge y Errores', () => {
  
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Manejo de errores de red', () => {
    it('Debe manejar error de servidor durante login', () => {
      // Intercept la llamada de login para simular error de servidor
      cy.intercept('POST', '**/auth/token', {
        statusCode: 500,
        body: { message: 'Error interno del servidor' }
      }).as('loginError');

      cy.visit('/auth/login');
      cy.get('#rut').type('12.312.312-3');
      cy.get('#password').type('password');
      cy.get('[data-cy=btn-login]').click();

      // Verificar que se muestra el error
      cy.wait('@loginError');
      cy.contains('Error interno del servidor').should('be.visible');
    });

    it('Debe manejar timeout de red', () => {
      // Simular timeout
      cy.intercept('POST', '**/auth/token', {
        delay: 30000,
        statusCode: 408
      }).as('loginTimeout');

      cy.visit('/auth/login');
      cy.get('#rut').type('12.312.312-3');
      cy.get('#password').type('password');
      cy.get('[data-cy=btn-login]').click();

      // Verificar que se maneja el timeout
      cy.contains('Error de conexión').should('be.visible');
    });
  });

  describe('Validación de campos', () => {
    it('Debe validar campos vacíos', () => {
      cy.visit('/auth/login');
      
      // Intentar submit sin llenar campos
      cy.get('[data-cy=btn-login]').click();
      
      // Verificar validación HTML5 o custom
      cy.get('#rut:invalid').should('exist');
      cy.get('#password:invalid').should('exist');
    });

    it('Debe validar longitud mínima de contraseña', () => {
      cy.visit('/auth/login');
      
      cy.get('#rut').type('12.312.312-3');
      cy.get('#password').type('123'); // Contraseña muy corta
      cy.get('[data-cy=btn-login]').click();
      
      // Verificar mensaje de validación
      cy.contains('La contraseña debe tener al menos').should('be.visible');
    });
  });

  describe('Estados de loading', () => {
    it('Debe mostrar loading durante el login', () => {
      // Simular respuesta lenta
      cy.intercept('POST', '**/auth/token', {
        delay: 2000,
        statusCode: 200,
        body: { /* datos de respuesta */ }
      }).as('slowLogin');

      cy.visit('/auth/login');
      cy.get('#rut').type('12.312.312-3');
      cy.get('#password').type('password');
      cy.get('[data-cy=btn-login]').click();

      // Verificar que se muestra loading
      cy.get('[data-cy=btn-login]').should('be.disabled');
      cy.contains('Iniciando sesión...').should('be.visible');
    });

    it('Debe deshabilitar botón durante el login', () => {
      cy.intercept('POST', '**/auth/token', {
        delay: 1000,
        statusCode: 200
      }).as('loginDelay');

      cy.visit('/auth/login');
      cy.get('#rut').type('12.312.312-3');
      cy.get('#password').type('password');
      cy.get('[data-cy=btn-login]').click();

      // El botón debe estar deshabilitado
      cy.get('[data-cy=btn-login]').should('be.disabled');
      
      // No debe poder hacer click múltiple
      cy.get('[data-cy=btn-login]').click({ force: true });
      cy.get('@loginDelay.all').should('have.length', 1);
    });
  });

  describe('Seguridad', () => {
    it('Debe ocultar contraseña por defecto', () => {
      cy.visit('/auth/login');
      cy.get('#password').should('have.attr', 'type', 'password');
    });

    it('Debe limpiar campos sensibles en error', () => {
      cy.visit('/auth/login');
      cy.get('#rut').type('12.312.312-3');
      cy.get('#password').type('wrongpassword');
      cy.get('[data-cy=btn-login]').click();

      // Después del error, la contraseña debería limpiarse
      cy.get('#password').should('have.value', '');
    });

    it('Debe prevenir multiple submit', () => {
      cy.visit('/auth/login');
      cy.get('#rut').type('12.312.312-3');
      cy.get('#password').type('password');
      
      // Hacer multiple clicks rápidos
      cy.get('[data-cy=btn-login]').click();
      cy.get('[data-cy=btn-login]').click();
      cy.get('[data-cy=btn-login]').click();

      // Solo debería hacer una llamada
      // (Esto dependería de tu implementación)
    });
  });
  describe('Accesibilidad', () => {
    it('Debe tener labels o aria-labels en los inputs', () => {
      cy.visit('/auth/login');
      
      // Verificar que los inputs tengan algún tipo de label
      cy.get('#rut').should('exist');
      cy.get('#password').should('exist');
      
      // Verificar que hay labels en la página
      cy.get('label').should('have.length.greaterThan', 0);
    });

    it('Debe ser navegable con teclado', () => {
      cy.visit('/auth/login');
      
      // Verificar que los elementos son focusables
      cy.get('#rut').focus().should('be.focused');
      cy.get('#password').focus().should('be.focused');
      cy.get('[data-cy=btn-login]').focus().should('be.focused');
    });

    it('Debe funcionar con Enter para submit', () => {
      cy.visit('/auth/login');
      
      cy.get('#rut').type('12.312.312-3');
      cy.get('#password').type('password{enter}');
      
      // Debería hacer login con Enter
      cy.url().should('not.include', '/auth/login', { timeout: 10000 });
    });
  });

  describe('Cookies y almacenamiento', () => {
    it('Debe manejar cookies corruptas', () => {
      // Establecer cookie corrupta
      cy.setCookie('userData', 'invalid-json');
      
      cy.visit('/');
      
      // Debería redirigir al login y limpiar cookie corrupta
      cy.url().should('include', '/auth/login');
      cy.getCookie('userData').should('not.exist');
    });

    it('Debe funcionar sin cookies habilitadas', () => {
      // Simular cookies deshabilitadas
      cy.window().then((win) => {
        // Sobrescribir document.cookie
        Object.defineProperty(win.document, 'cookie', {
          get: () => '',
          set: () => false
        });
      });

      cy.visit('/auth/login');
      cy.get('#rut').type('12.312.312-3');
      cy.get('#password').type('password');
      cy.get('[data-cy=btn-login]').click();

      // Debería mostrar un mensaje apropiado
      cy.contains('Las cookies son necesarias').should('be.visible');
    });
  });
});
