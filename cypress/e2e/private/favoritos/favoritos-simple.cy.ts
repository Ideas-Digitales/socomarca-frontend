/// <reference types="cypress" />

describe('Favoritos - Test Simplificado', () => {
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
    cy.get('[data-cy="favoritos-section"]', { timeout: 10000 }).should('be.visible');

    // Crear lista
    cy.get('[data-cy="crear-nueva-lista"]').click();
    cy.get('[data-cy="input-nombre-lista"]').clear().type(nombreLista);
    cy.get('[data-cy="btn-crear-lista"]').click();
    
    // Esperar a que se cierre el modal
    cy.get('[data-cy="input-nombre-lista"]').should('not.exist');

    // Verificar que la lista aparece con el nombre correcto
    cy.contains(nombreLista, { timeout: 20000 }).should('be.visible');
    
    // Esperar hasta que el botón "Revisar lista" esté disponible (no deshabilitado)
    // Buscar específicamente la lista que acabamos de crear
    cy.get('[data-cy="lista-favorita"]')
      .contains(nombreLista)
      .closest('[data-cy="lista-favorita"]')
      .should('have.attr', 'data-optimistic', 'false')
      .within(() => {
        cy.get('[data-cy="btn-revisar-lista"]')
          .should('be.visible')
          .should('not.be.disabled')
          .click();
      });

    // Ahora estamos en la página de detalle de la lista que creamos
    // Eliminar la lista
    cy.get('[data-cy="btn-eliminar-lista"]', { timeout: 10000 })
      .should('be.visible')
      .click();
      
    cy.get('[data-cy="btn-confirmar-eliminacion"]', { timeout: 10000 })
      .should('be.visible')
      .click();

    // Verificar redirección automática
    cy.url({ timeout: 20000 }).should('eq', 'http://localhost:3000/mi-cuenta?section=favoritos');
    cy.get('[data-cy="favoritos-section"]', { timeout: 10000 }).should('be.visible');
    
    // Verificar que la lista ya no existe
    cy.get('body').should('not.contain', nombreLista);
  });

  it('Debe crear una lista, cambiar su nombre y luego eliminarla', () => {
    const nombreListaInicial = `Lista Inicial ${Date.now()}`;
    const nombreListaEditado = `Lista Editada ${Date.now()}`;

    // Ir a favoritos
    cy.visit('/mi-cuenta?section=favoritos');
    cy.get('[data-cy="favoritos-section"]', { timeout: 10000 }).should('be.visible');

    // Crear lista
    cy.get('[data-cy="crear-nueva-lista"]').click();
    cy.get('[data-cy="input-nombre-lista"]').clear().type(nombreListaInicial);
    cy.get('[data-cy="btn-crear-lista"]').click();
    
    // Esperar a que se cierre el modal
    cy.get('[data-cy="input-nombre-lista"]').should('not.exist');

    // Verificar que la lista aparece con el nombre inicial
    cy.contains(nombreListaInicial, { timeout: 20000 }).should('be.visible');
    
    // Entrar a la lista para editarla
    cy.get('[data-cy="lista-favorita"]')
      .contains(nombreListaInicial)
      .closest('[data-cy="lista-favorita"]')
      .should('have.attr', 'data-optimistic', 'false')
      .within(() => {
        cy.get('[data-cy="btn-revisar-lista"]')
          .should('be.visible')
          .should('not.be.disabled')
          .click();
      });

    // Editar el nombre de la lista
    cy.get('[data-cy="btn-editar-lista"]', { timeout: 10000 })
      .should('be.visible')
      .click();

    // Cambiar el nombre en el modal de edición
    cy.get('[data-cy="input-editar-nombre-lista"]', { timeout: 10000 })
      .should('be.visible')
      .clear()
      .type(nombreListaEditado);

    cy.get('[data-cy="btn-guardar-nombre-lista"]')
      .should('be.visible')
      .click();

    // Verificar que el modal se cerró y el nombre se actualizó
    cy.get('[data-cy="modal-editar-lista"]').should('not.exist');
    cy.contains(`Productos de ${nombreListaEditado}`, { timeout: 10000 }).should('be.visible');

    // Eliminar la lista con el nombre editado
    cy.get('[data-cy="btn-eliminar-lista"]', { timeout: 10000 })
      .should('be.visible')
      .click();
      
    cy.get('[data-cy="btn-confirmar-eliminacion"]', { timeout: 10000 })
      .should('be.visible')
      .click();

    // Verificar redirección automática
    cy.url({ timeout: 20000 }).should('eq', 'http://localhost:3000/mi-cuenta?section=favoritos');
    cy.get('[data-cy="favoritos-section"]', { timeout: 10000 }).should('be.visible');
    
    // Verificar que la lista ya no existe (ni con el nombre inicial ni con el editado)
    cy.get('body').should('not.contain', nombreListaInicial);
    cy.get('body').should('not.contain', nombreListaEditado);
  });
});
