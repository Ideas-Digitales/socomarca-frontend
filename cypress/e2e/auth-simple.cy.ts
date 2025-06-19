/// <reference types="cypress" />

describe('Autenticación - Tests Básicos', () => {
  
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Login Cliente - Tests Básicos', () => {
    it('Debe hacer login exitoso con credenciales válidas', () => {
      cy.visit('/auth/login');
      
      // Llenar formulario
      cy.get('#rut').type('12.312.312-3');
      cy.get('#password').type('password');
      cy.get('[data-cy=btn-login]').click();
      
      // Verificar redirección
      cy.url().should('not.include', '/auth/login');
      
      // Verificar cookies
      cy.getCookie('token').should('exist');
      cy.getCookie('userData').should('exist');
    });

    it('Debe rechazar credenciales inválidas', () => {
      cy.visit('/auth/login');
      
      cy.get('#rut').type('11.111.111-1');
      cy.get('#password').type('wrongpassword');
      cy.get('[data-cy=btn-login]').click();
      
      // Debe mantenerse en login
      cy.url().should('include', '/auth/login');
    });

    it('Debe mantener sesión después de recargar', () => {
      // Login
      cy.visit('/auth/login');
      cy.get('#rut').type('12.312.312-3');
      cy.get('#password').type('password');
      cy.get('[data-cy=btn-login]').click();
      
      // Esperar navegación
      cy.url().should('not.include', '/auth/login');
      
      // Recargar página
      cy.reload();
      
      // Debe seguir logueado
      cy.url().should('not.include', '/auth/login');
      cy.getCookie('token').should('exist');
    });
  });

  describe('Login Admin - Tests Básicos', () => {
    it('Debe hacer login de admin exitoso', () => {
      cy.visit('/auth/login-admin');
      
      cy.get('#rut').type('12.312.312-3');
      cy.get('#password').type('password');
      cy.get('[data-cy=btn-login]').click();
      
      // Debe ir a admin
      cy.url().should('include', '/admin');
      cy.getCookie('token').should('exist');
    });
  });

  describe('Logout - Tests Básicos', () => {
    it('Debe cerrar sesión correctamente', () => {
      // Primero hacer login
      cy.visit('/auth/login');
      cy.get('#rut').type('12.312.312-3');
      cy.get('#password').type('password');
      cy.get('[data-cy=btn-login]').click();
      
      // Esperar que esté logueado
      cy.url().should('not.include', '/auth/login');
      
      // Hacer logout
      cy.contains('Cerrar sesión').click();
      cy.get('[data-cy=confirm-logout]').click();
      
      // Verificar redirección
      cy.url().should('include', '/auth/login');
      
      // Verificar cookies eliminadas
      cy.getCookie('token').should('not.exist');
      cy.getCookie('userData').should('not.exist');
    });
  });

  describe('Validaciones - Tests Básicos', () => {
    it('Debe validar campos requeridos', () => {
      cy.visit('/auth/login');
      
      // Intentar submit sin datos
      cy.get('[data-cy=btn-login]').click();
        // Los campos deben ser requeridos
      cy.get('#rut').should('be.focused');
    });

    it('Debe formatear RUT correctamente', () => {
      cy.visit('/auth/login');
      
      cy.get('#rut').type('123123123');
      cy.get('#rut').should('have.value', '12.312.312-3');
    });
  });

  describe('Estados UI - Tests Básicos', () => {
    it('Debe mostrar loading durante login', () => {
      cy.visit('/auth/login');
      
      cy.get('#rut').type('12.312.312-3');
      cy.get('#password').type('password');
      cy.get('[data-cy=btn-login]').click();
      
      cy.get('[data-cy=btn-login]').should('be.disabled');
    });

    it('Debe ocultar contraseña por defecto', () => {
      cy.visit('/auth/login');
      
      cy.get('#password').should('have.attr', 'type', 'password');
    });
  });
});
