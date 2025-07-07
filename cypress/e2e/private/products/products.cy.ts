/// <reference types="cypress" />

describe('Productos y Carrito - Test Completo', () => {
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

    // Ir a la página principal donde están los productos
    cy.visit('/');
    
    // Esperar a que carguen los productos
    cy.get('[data-cy="products-container"]', { timeout: 15000 }).should('be.visible');
    cy.get('[data-cy="product-card"]', { timeout: 15000 }).should('have.length.greaterThan', 0);
  });

  it('Debug - Verificar elementos del carrito después de agregar producto', () => {
    // Agregar producto al carrito
    cy.get('[data-cy="product-card"]').first().within(() => {
      cy.get('[data-cy="quantity-increase-btn"]').click();
      cy.get('[data-cy="add-to-cart-btn"]').click();
    });

    // Esperar y verificar contador
    cy.get('[data-cy="cart-counter"]', { timeout: 15000 }).should('be.visible');
    cy.wait(3000);

    // Ir al carrito
    cy.get('[data-cy="cart-link"]').click();
    cy.wait(3000);

    // Debug: verificar qué elementos existen
    cy.get('body').then(($body) => {
      cy.log('=== DEBUG: Verificando elementos del carrito ===');
      
      // Verificar si existen tablas (versión desktop)
      if ($body.find('table').length > 0) {
        cy.log('ENCONTRADA: Tabla (versión desktop)');
        cy.get('table tbody tr').then(($rows) => {
          cy.log(`Filas en tabla: ${$rows.length}`);
        });
      }
      
      // Verificar elementos data-cy específicos de desktop
      if ($body.find('.hidden.lg\\:block table tbody [data-cy="cart-item"]').length > 0) {
        cy.log('ENCONTRADOS: Elementos [data-cy="cart-item"] en versión desktop');
        cy.get('.hidden.lg\\:block table tbody [data-cy="cart-item"]').then(($items) => {
          cy.log(`Cantidad de items desktop: ${$items.length}`);
        });
      } else {
        cy.log('NO ENCONTRADOS: Elementos [data-cy="cart-item"] en versión desktop');
      }
      
      // Verificar elementos data-cy específicos de mobile
      if ($body.find('.lg\\:hidden [data-cy="cart-item"]').length > 0) {
        cy.log('ENCONTRADOS: Elementos [data-cy="cart-item"] en versión mobile');
        cy.get('.lg\\:hidden [data-cy="cart-item"]').then(($items) => {
          cy.log(`Cantidad de items mobile: ${$items.length}`);
        });
      } else {
        cy.log('NO ENCONTRADOS: Elementos [data-cy="cart-item"] en versión mobile');
      }
      
      // Verificar si hay mensaje de carrito vacío
      if ($body.find('[data-cy="empty-cart-message"]').length > 0) {
        cy.log('ENCONTRADO: Mensaje de carrito vacío');
      }
      
      // Verificar clases de componentes
      if ($body.find('.hidden.lg\\:block').length > 0) {
        cy.log('ENCONTRADO: Componente desktop (.hidden.lg:block)');
      }
      
      if ($body.find('.lg\\:hidden').length > 0) {
        cy.log('ENCONTRADO: Componente mobile (.lg:hidden)');
      }
    });

    // Verificar elementos del carrito usando selector específico para desktop
    cy.get('body').then(($body) => {
      if ($body.find('.hidden.lg\\:block table tbody [data-cy="cart-item"]').length > 0) {
        cy.log('SUCCESS: cart-item desktop encontrado');
        cy.get('.hidden.lg\\:block table tbody [data-cy="cart-item"]').should('exist');
      } else {
        cy.log('FAILED: cart-item desktop no encontrado - forzando verificación');
        cy.get('.hidden.lg\\:block table tbody [data-cy="cart-item"]').should('exist');
      }
    });
  });

  it('Debe agregar un producto al carrito, verificar que está agregado y eliminarlo', () => {
    // Obtener el primer producto y agregarlo al carrito
    cy.get('[data-cy="product-card"]').first().within(() => {
      // Verificar que el producto tiene información básica
      cy.get('[data-cy="product-name"]').should('be.visible');
      cy.get('[data-cy="product-price"]').should('be.visible');
      
      // Aumentar la cantidad a 1
      cy.get('[data-cy="quantity-increase-btn"]').click();
      cy.get('[data-cy="quantity-input"]').should('have.value', '1');
      
      // Agregar al carrito
      cy.get('[data-cy="add-to-cart-btn"]').should('not.be.disabled').click();
    });

    // Esperar un momento para que se procese la acción
    cy.wait(3000);

    // Ir directamente al carrito para verificar el contenido
    cy.get('[data-cy="cart-link"]').click();
    cy.url().should('include', '/carro-de-compra');
    
    // Esperar a que la página del carrito cargue completamente
    cy.wait(3000);
    
    // Verificar que el producto está en el carrito - solo la versión desktop en este viewport
    cy.get('.hidden.lg\\:block table tbody [data-cy="cart-item"]', { timeout: 15000 }).should('exist');
    cy.get('.hidden.lg\\:block table tbody [data-cy="cart-item"]', { timeout: 15000 }).should('have.length', 1);
    
    // Verificar que el contador del carrito aparece ahora que estamos en la página del carrito
    cy.get('[data-cy="cart-counter"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-cy="cart-counter"]').should('contain', '1');
    
    cy.get('.hidden.lg\\:block table tbody [data-cy="cart-item"]').first().within(() => {
      cy.get('[data-cy="cart-item-name"]', { timeout: 10000 }).should('be.visible');
      cy.get('[data-cy="cart-item-price"]', { timeout: 10000 }).should('be.visible');
      cy.get('[data-cy="cart-item-quantity"]', { timeout: 10000 }).should('be.visible').and('contain', '1');
    });

    // Eliminar el producto del carrito - usar la versión desktop
    cy.get('.hidden.lg\\:block table tbody [data-cy="cart-item"]').first().within(() => {
      cy.get('[data-cy="delete-product-btn"]').click();
    });

    // Verificar que el carrito está vacío
    cy.get('[data-cy="empty-cart-message"]', { timeout: 15000 }).should('be.visible');
    cy.get('[data-cy="empty-cart-message"]').should('contain', 'Tu carrito está vacío');
  });

  it('Debe cambiar la cantidad del producto en el carrito', () => {
    // Obtener el primer producto y agregarlo al carrito con cantidad 2
    cy.get('[data-cy="product-card"]').first().within(() => {
      // Aumentar la cantidad a 2
      cy.get('[data-cy="quantity-increase-btn"]').click();
      cy.get('[data-cy="quantity-increase-btn"]').click();
      cy.get('[data-cy="quantity-input"]').should('have.value', '2');
      
      // Agregar al carrito
      cy.get('[data-cy="add-to-cart-btn"]').should('not.be.disabled').click();
    });

    // Esperar a que el carrito se actualice
    cy.get('[data-cy="cart-counter"]', { timeout: 15000 }).should('be.visible');
    cy.wait(3000);

    // Ir al carrito
    cy.get('[data-cy="cart-link"]').click();
    cy.url().should('include', '/carro-de-compra');
    cy.wait(2000);
    
    // Verificar que el producto está en el carrito con cantidad 2 - solo versión desktop
    cy.get('.hidden.lg\\:block table tbody [data-cy="cart-item"]', { timeout: 15000 }).should('have.length', 1);
    cy.get('.hidden.lg\\:block table tbody [data-cy="cart-item"]').first().within(() => {
      cy.get('[data-cy="cart-item-quantity"]', { timeout: 10000 }).should('contain', '2');
      
      // Incrementar cantidad
      cy.get('[data-cy="increase-quantity-btn"]').click();
      cy.get('[data-cy="cart-item-quantity"]').should('contain', '3');
      
      // Decrementar cantidad
      cy.get('[data-cy="decrease-quantity-btn"]').click();
      cy.get('[data-cy="cart-item-quantity"]').should('contain', '2');
    });

    // Vaciar todo el carrito
    cy.get('[data-cy="empty-cart-btn"]').click();
    cy.get('[data-cy="empty-cart-message"]', { timeout: 15000 }).should('be.visible');
  });

  it('Debe mostrar el modo lista y modo grid de productos', () => {
    // Cambiar a modo lista
    cy.get('[data-cy="view-mode-list"]').click();
    cy.get('[data-cy="products-container"]').should('have.class', 'flex-col');

    // Cambiar a modo grid
    cy.get('[data-cy="view-mode-grid"]').click();
    cy.get('[data-cy="products-container"]').should('have.class', 'grid');
  });

  it('Debe permitir cerrar sesión en vista móvil', () => {
    // Cambiar a viewport móvil para probar el logout
    cy.viewport(375, 667);
    cy.wait(1000);

    // Verificar que el botón del menú móvil está disponible
    cy.get('[data-cy="mobile-menu-btn"]', { timeout: 10000 }).should('be.visible').click();
    
    // Hacer clic en logout
    cy.get('[data-cy="logout-btn"]').should('be.visible').click();
    
    // Confirmar logout
    cy.get('[data-cy="confirm-logout-btn"]').should('be.visible').click();
    
    // Verificar que se redirige al login
    cy.url({ timeout: 10000 }).should('include', '/auth/login');
  });
});
