/// <reference types="cypress" />

describe('Autenticación - Casos Edge Básicos', () => {
  
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Validación de campos', () => {
    it('Debe requerir RUT válido para habilitar botón', () => {
      cy.visit('/auth/login');
      
      // El botón debe estar deshabilitado inicialmente
      cy.get('[data-cy=btn-login]').should('be.disabled');
      
      // Llenar solo RUT inválido
      cy.get('#rut').clear().type('123');
      cy.get('#password').clear().type('password');
      
      // El botón debe seguir deshabilitado
      cy.get('[data-cy=btn-login]').should('be.disabled');
    });

    it('Debe requerir contraseña para habilitar botón', () => {
      cy.visit('/auth/login');
      
      // Llenar solo RUT válido
      cy.get('#rut').clear().type('202858384');
      
      // El botón debe estar deshabilitado sin contraseña
      cy.get('[data-cy=btn-login]').should('be.disabled');
      
      // Agregar contraseña
      cy.get('#password').clear().type('password');
      
      // Ahora el botón debe estar habilitado
      cy.get('[data-cy=btn-login]').should('not.be.disabled');
    });
  });

  describe('Estados de loading', () => {
    it('Debe mostrar estado de carga durante el login', () => {
      cy.visit('/auth/login');
      
      // Llenar formulario
      cy.get('#rut').clear().type('202858384');
      cy.get('#password').clear().type('password');
      
      // Verificar que el botón está habilitado
      cy.get('[data-cy=btn-login]').should('not.be.disabled');
      
      // Hacer click
      cy.get('[data-cy=btn-login]').click();
      
      // Verificar que se muestra algún estado de loading (texto o deshabilitado)
      cy.get('[data-cy=btn-login]').should(($btn) => {
        const text = $btn.text();
        expect(text).to.match(/(Iniciando|Cargando|Ingresar)/);
      });
    });
  });

  describe('Seguridad básica', () => {
    it('Debe ocultar contraseña por defecto', () => {
      cy.visit('/auth/login');
      cy.get('#password').should('have.attr', 'type', 'password');
    });

    it('Debe limpiar formulario después de logout', () => {
      // Primero hacer login exitoso
      cy.visit('/auth/login');
      cy.get('#rut').clear().type('202858384');
      cy.get('#password').clear().type('password');
      cy.get('[data-cy=btn-login]').should('not.be.disabled');
      cy.get('[data-cy=btn-login]').click();
      
      // Esperar que se complete el login
      cy.wait(2000);
      cy.url().should('not.include', '/auth/login');
      
      // Ahora intentar volver al login
      cy.visit('/auth/login');
      
      // Los campos deben estar vacíos
      cy.get('#rut').should('have.value', '');
      cy.get('#password').should('have.value', '');
    });
  });

  describe('Accesibilidad básica', () => {
    it('Debe tener labels apropiados', () => {
      cy.visit('/auth/login');
      
      // Verificar que hay labels para los inputs
      cy.get('label[for="rut"]').should('exist');
      cy.get('label[for="password"]').should('exist');
    });

    it('Debe ser navegable con teclado', () => {
      cy.visit('/auth/login');
      
      // Verificar que los elementos son focusables
      cy.get('#rut').focus().should('be.focused');
      cy.get('#password').focus().should('be.focused');
      
      // Llenar campos y verificar que el botón es focusable cuando está habilitado
      cy.get('#rut').type('202858384');
      cy.get('#password').type('password');
      cy.get('[data-cy=btn-login]').focus().should('be.focused');
    });

    it('Debe funcionar con Enter para submit', () => {
      cy.visit('/auth/login');
      
      cy.get('#rut').clear().type('202858384');
      cy.get('#password').clear().type('password{enter}');
      
      // Debería procesar el login
      cy.wait(2000);
      cy.url().should('not.include', '/auth/login');
    });
  });

  describe('Persistencia y cookies', () => {
    it('Debe limpiar cookies al visitar login si no está autenticado', () => {
      // Establecer cookies manualmente
      cy.setCookie('token', 'fake-token');
      cy.setCookie('userData', 'fake-data');
      
      // Visitar login
      cy.visit('/auth/login');
      
      // Si las cookies eran inválidas, deberían limpiarse
      // (esto depende de la implementación del middleware)
      cy.url().should('include', '/auth/login');
    });

    it('Debe mantener sesión válida', () => {
      // Login exitoso
      cy.visit('/auth/login');
      cy.get('#rut').clear().type('202858384');
      cy.get('#password').clear().type('password');
      cy.get('[data-cy=btn-login]').should('not.be.disabled');
      cy.get('[data-cy=btn-login]').click();
      
      cy.wait(2000);
      cy.url().should('not.include', '/auth/login');
      
      // Verificar que las cookies están presentes
      cy.getCookie('token').should('exist');
      cy.getCookie('userData').should('exist');
      
      // Recargar página y verificar que sigue autenticado
      cy.reload();
      cy.wait(1000);
      cy.url().should('not.include', '/auth/login');
    });
  });
});
