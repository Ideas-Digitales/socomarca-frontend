/// <reference types="cypress" />

describe('Favoritos - Test Simple', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.viewport(1280, 720);

    // Login básico
    cy.visit('/auth/login');
    cy.get('#rut').clear().type('202858384');
    cy.get('#password').clear().type('password');
    cy.get('[data-cy=btn-login]').click();

    // Esperar redirección exitosa
    cy.url().should('not.include', '/auth/login');
    cy.wait(2000);
  });

  it('Debe crear y eliminar una lista de favoritos', () => {
    const nombreLista = `Lista Test ${Date.now()}`;

    // Ir a favoritos
    cy.visit('/mi-cuenta?section=favoritos');
    cy.get('[data-cy="favoritos-section"]', { timeout: 10000 }).should(
      'be.visible'
    );

    // Crear lista
    cy.get('[data-cy="crear-nueva-lista"]').click();
    cy.get('[data-cy="input-nombre-lista"]').clear().type(nombreLista);
    cy.get('[data-cy="btn-crear-lista"]').click();    // Verificar que la lista aparece
    cy.contains(nombreLista, { timeout: 10000 }).should('be.visible');

    // Ir a detalle de la lista específica que acabamos de crear
    cy.contains(nombreLista)
      .closest('[data-cy="lista-favorita"]')
      .find('[data-cy="btn-revisar-lista"]')
      .click();
    // Eliminar la lista
    cy.get('[data-cy="btn-eliminar-lista"]', { timeout: 10000 })
      .should('be.visible')
      .click();

    // Confirmar eliminación
    cy.get('[data-cy="btn-confirmar-eliminacion"]', { timeout: 10000 })
      .should('be.visible')
      .click();

    // Esperar a que el backend procese y redireccione automáticamente
    cy.url({ timeout: 20000 }).should(
      'eq',
      'http://localhost:3000/mi-cuenta?section=favoritos'
    );

    // Esperar a que cargue la sección de favoritos después de la redirección
    cy.get('[data-cy="favoritos-section"]', { timeout: 10000 }).should(
      'be.visible'
    );

    const body = cy.get('body');
    console.log(body);
    // Verificar que la lista ya no existe
    cy.get('body').should('not.contain', nombreLista);
  });
});
