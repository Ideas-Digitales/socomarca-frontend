/// <reference types="cypress" />

// Test para debug - verificar qué mensajes de error se muestran
describe('Debug - Verificar mensajes de error', () => {
  
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Debe mostrar el error actual para debug', () => {
    cy.visit('/auth/login');
    
    // Limpiar campos
    cy.get('#rut').clear();
    cy.get('#password').clear();
    
    // Usar credenciales incorrectas
    cy.get('#rut').type('11.111.111-1');
    cy.get('#password').type('wrongpassword');
    
    // Esperar que el botón se habilite
    cy.get('[data-cy=btn-login]').should('not.be.disabled');
    cy.get('[data-cy=btn-login]').click();
    
    // Esperar un poco para que aparezca el error
    cy.wait(2000);
    
    // Capturar todo el contenido de la página para debug
    cy.get('body').then(($body) => {
      console.log('HTML del body:', $body.html());
      
      // Buscar elementos que podrían contener errores
      const errorElements = $body.find('[class*="red"], [class*="error"], [class*="danger"], div:contains("error"), div:contains("inválid"), div:contains("credencial")');
      
      if (errorElements.length > 0) {
        errorElements.each((index, element) => {
          console.log(`Elemento de error ${index}:`, element.outerHTML);
          console.log(`Texto del elemento:`, element.textContent);
        });
      } else {
        console.log('No se encontraron elementos de error específicos');
      }
      
      // Verificar que sigue en la página de login
      cy.url().should('include', '/auth/login');
    });
  });

  it('Test con credenciales válidas para comparar', () => {
    cy.visit('/auth/login');
    
    // Limpiar campos
    cy.get('#rut').clear();
    cy.get('#password').clear();
    
    // Usar credenciales correctas
    cy.get('#rut').type('202858384');
    cy.get('#password').type('password');
    
    // Esperar que el botón se habilite
    cy.get('[data-cy=btn-login]').should('not.be.disabled');
    cy.get('[data-cy=btn-login]').click();
    
    // Este debería redirigir exitosamente
    cy.url().should('not.include', '/auth/login');
  });
});
