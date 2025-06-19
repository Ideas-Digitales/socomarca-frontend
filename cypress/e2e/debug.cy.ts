/// <reference types="cypress" />

// Test de debug simple para verificar el login
describe('Debug - Test Simple', () => {
  
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Login exitoso - cliente', () => {
    cy.visit('/auth/login');
    
    // Limpiar campos
    cy.get('#rut').clear();
    cy.get('#password').clear();
    
    // Llenar con credenciales válidas
    cy.get('#rut').type('202858384');
    cy.get('#password').type('password');
    
    // Esperar que el botón se habilite
    cy.get('[data-cy=btn-login]').should('not.be.disabled');
    
    // Hacer click
    cy.get('[data-cy=btn-login]').click();
    
    // Esperar y verificar redirección
    cy.wait(3000);
    cy.url().should('not.include', '/auth/login');
    
    // Verificar cookies
    cy.getCookie('token').should('exist');
    cy.getCookie('userData').should('exist');
  });

  it('Login fallido - credenciales incorrectas', () => {
    cy.visit('/auth/login');
    
    // Limpiar campos
    cy.get('#rut').clear();
    cy.get('#password').clear();
    
    // Llenar con credenciales inválidas
    cy.get('#rut').type('99.999.999-9');
    cy.get('#password').type('contrasenainvalida');
    
    // Esperar que el botón se habilite
    cy.get('[data-cy=btn-login]').should('not.be.disabled');
    
    // Hacer click
    cy.get('[data-cy=btn-login]').click();
    
    // Esperar y verificar que se queda en login
    cy.wait(3000);
    cy.url().should('include', '/auth/login');
    
    // Verificar que no hay cookies de autenticación
    cy.getCookie('token').should('not.exist');
  });

  it('Login admin exitoso', () => {
    cy.visit('/auth/login-admin');
    
    // Limpiar campos
    cy.get('#rut').clear();
    cy.get('#password').clear();
    
    // Llenar con credenciales de admin
    cy.get('#rut').type('192855179');
    cy.get('#password').type('password');
    
    // Esperar que el botón se habilite
    cy.get('[data-cy=btn-login]').should('not.be.disabled');
    
    // Hacer click
    cy.get('[data-cy=btn-login]').click();
    
    // Esperar y verificar redirección a admin
    cy.wait(3000);
    cy.url().should('include', '/admin');
    
    // Verificar cookies
    cy.getCookie('token').should('exist');
    cy.getCookie('userData').should('exist');
  });
});
