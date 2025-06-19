/// <reference types="cypress" />

// Test básico de autenticación sin elementos complejos
describe('Autenticación - Tests Básicos', () => {
  
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
  it('Login de cliente - flujo básico', () => {
    cy.visit('/auth/login');
    
    // Limpiar campos primero
    cy.get('#rut').clear();
    cy.get('#password').clear();
    
    // Llenar formulario con credenciales de cliente
    cy.get('#rut').type('202858384');
    cy.get('#password').type('password');
    
    // Esperar a que el botón se habilite
    cy.get('[data-cy=btn-login]').should('not.be.disabled');
    cy.get('[data-cy=btn-login]').click();
    
    // Verificar redirección exitosa
    cy.url().should('not.include', '/auth/login');
    
    // Verificar cookies de autenticación
    cy.getCookie('token').should('exist');
    cy.getCookie('userData').should('exist');
  });
  it('Login de admin - flujo básico', () => {
    cy.visit('/auth/login-admin');
    
    // Limpiar campos primero
    cy.get('#rut').clear();
    cy.get('#password').clear();
    
    // Llenar formulario con credenciales de admin
    cy.get('#rut').type('192855179');
    cy.get('#password').type('password');
    
    // Esperar a que el botón se habilite
    cy.get('[data-cy=btn-login]').should('not.be.disabled');
    cy.get('[data-cy=btn-login]').click();
    
    // Verificar redirección a admin
    cy.url().should('include', '/admin');
    
    // Verificar cookies
    cy.getCookie('token').should('exist');
    cy.getCookie('userData').should('exist');
  });
  it('Login de superadmin - flujo básico', () => {
    cy.visit('/auth/login-admin');
    
    // Limpiar campos primero
    cy.get('#rut').clear();
    cy.get('#password').clear();
    
    // Llenar formulario con credenciales de superadmin
    cy.get('#rut').type('238439256');
    cy.get('#password').type('password');
    
    // Esperar a que el botón se habilite
    cy.get('[data-cy=btn-login]').should('not.be.disabled');
    cy.get('[data-cy=btn-login]').click();
    
    // Verificar redirección a super-admin
    cy.url().should('include', '/super-admin');
    
    // Verificar cookies
    cy.getCookie('token').should('exist');
    cy.getCookie('userData').should('exist');
  });  it('Debe rechazar credenciales inválidas', () => {
    cy.visit('/auth/login');
    
    // Limpiar campos primero
    cy.get('#rut').clear();
    cy.get('#password').clear();
    
    // Usar credenciales que definitivamente no existen
    cy.get('#rut').type('99.999.999-9');
    cy.get('#password').type('contrasenainvalida123');
    
    // Esperar a que el botón se habilite (RUT válido pero credenciales incorrectas)
    cy.get('[data-cy=btn-login]').should('not.be.disabled');
    cy.get('[data-cy=btn-login]').click();
    
    // Esperar que se procese la petición
    cy.wait(2000);
    
    // Debe mantenerse en login (esto es lo más importante)
    cy.url().should('include', '/auth/login');
    
    // El botón debería estar disponible nuevamente
    cy.get('[data-cy=btn-login]').should('not.be.disabled');
  });
  it('Persistencia de sesión después de recargar', () => {
    // Login
    cy.visit('/auth/login');
    
    // Limpiar campos primero
    cy.get('#rut').clear();
    cy.get('#password').clear();
    
    cy.get('#rut').type('202858384');
    cy.get('#password').type('password');
    
    // Esperar a que el botón se habilite
    cy.get('[data-cy=btn-login]').should('not.be.disabled');
    cy.get('[data-cy=btn-login]').click();
    
    // Esperar navegación
    cy.url().should('not.include', '/auth/login');
    
    // Recargar página
    cy.reload();
    
    // Verificar que sigue autenticado
    cy.getCookie('token').should('exist');
    cy.getCookie('userData').should('exist');
    cy.url().should('not.include', '/auth/login');
  });
});
