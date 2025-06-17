describe('Mi primer test', () => {
  it('Visita el sitio y verifica el título', () => {
    cy.visit('http://localhost:3000/'); // Cambia por tu URL
    cy.get('#rut')
      .type('202858384')
      .should('have.value', '20.285.838-4');
    cy.get('#password')
      .type('password')
      .should('have.value', 'password');
    cy.get('[data-cy=btn-login]').click();
    cy.url().should('include', '/'); // Verifica que la URL cambie a /dashboard
  });
});
