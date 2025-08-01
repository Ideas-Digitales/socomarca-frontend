import { testCredentials } from '../../shared/test-credentials';

describe('Página de Ofertas del Supermercado', () => {
  beforeEach(() => {
    // Login como administrador
    cy.visit('/auth/login-admin');
    cy.get('[data-cy="email-input"]').type(testCredentials.admin.email);
    cy.get('[data-cy="password-input"]').type(testCredentials.admin.password);
    cy.get('[data-cy="login-button"]').click();
    
    // Esperar a que se complete el login
    cy.url().should('include', '/admin');
    
    // Navegar a la página de notificaciones
    cy.visit('/admin/notificaciones');
  });

  it('debería mostrar la página de ofertas correctamente', () => {
    cy.get('h1').should('contain', 'Gestión de Ofertas del Supermercado');
    cy.get('[data-cy="new-notification-button"]').should('be.visible');
  });

  it('debería permitir crear una nueva oferta', () => {
    // Abrir el modal de crear oferta
    cy.get('[data-cy="new-notification-button"]').click();
    
    // Llenar el formulario
    cy.get('[data-cy="notification-title-input"]').type('🥬 Test Offer');
    cy.get('[data-cy="notification-message-input"]').type('This is a test supermarket offer message');
    cy.get('[data-cy="notification-type-select"]').select('info');
    
    // Crear la oferta
    cy.get('[data-cy="create-notification-button"]').click();
    
    // Verificar que se muestra el mensaje de éxito
    cy.get('[data-cy="success-message"]').should('contain', 'Oferta creada exitosamente');
  });

  it('debería mostrar las ofertas existentes', () => {
    // Verificar que se muestran las ofertas mock
    cy.get('[data-cy="notification-item"]').should('have.length.at.least', 1);
    cy.get('[data-cy="notification-title"]').should('contain', 'Black Friday');
  });

  it('debería permitir eliminar una oferta', () => {
    // Hacer clic en el botón de eliminar de la primera oferta
    cy.get('[data-cy="delete-notification-button"]').first().click();
    
    // Confirmar la eliminación
    cy.on('window:confirm', () => true);
    
    // Verificar que se muestra el mensaje de éxito
    cy.get('[data-cy="success-message"]').should('contain', 'Oferta eliminada exitosamente');
  });

  it('debería validar campos requeridos', () => {
    // Abrir el modal de crear oferta
    cy.get('[data-cy="new-notification-button"]').click();
    
    // Intentar crear sin llenar campos requeridos
    cy.get('[data-cy="create-notification-button"]').click();
    
    // Verificar que se muestran errores de validación
    cy.get('[data-cy="notification-title-input"]').should('have.attr', 'required');
    cy.get('[data-cy="notification-message-input"]').should('have.attr', 'required');
  });

  it('debería mostrar el estado de carga', () => {
    // Recargar la página para ver el estado de carga
    cy.reload();
    
    // Verificar que se muestra el spinner de carga
    cy.get('[data-cy="loading-spinner"]').should('be.visible');
  });
}); 