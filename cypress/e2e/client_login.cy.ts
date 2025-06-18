describe('Mi primer test', () => {
  it('Visita el sitio y verifica el título', () => {
    cy.visit('http://localhost:3000/auth/login');
    cy.get('#rut')
      .type('202858384')
      .should('have.value', '20.285.838-4');
    cy.get('#password')
      .type('password')
      .should('have.value', 'password');
    cy.get('[data-cy=btn-login]').click();
    cy.url().should('include', '/'); 
  });
});
