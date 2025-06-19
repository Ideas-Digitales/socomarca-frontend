/// <reference types="cypress" />

// Comandos personalizados para autenticación
Cypress.Commands.add('loginAsClient', (rut, password) => {
  cy.visit('/auth/login');
  
  // Limpiar campos primero
  cy.get('#rut').clear();
  cy.get('#password').clear();
  
  // Escribir RUT y esperar que se valide
  cy.get('#rut').type(rut);
  
  // Escribir contraseña
  cy.get('#password').type(password);
  
  // Esperar a que el botón se habilite (el RUT debe ser válido)
  cy.get('[data-cy=btn-login]').should('not.be.disabled');
  
  // Hacer click en el botón
  cy.get('[data-cy=btn-login]').click();
  
  // Esperar un poco para que se procese
  cy.wait(2000);
  
  // Verificar que la autenticación fue exitosa O que falló correctamente
  cy.url().then((currentUrl) => {
    if (currentUrl.includes('/auth/login')) {
      // Si sigue en login, significa que las credenciales fueron rechazadas
      cy.log('Login failed as expected');
      return;
    } else {
      // Si no está en login, verificar que las cookies estén presentes
      cy.getCookie('token').should('exist');
      cy.getCookie('userData').should('exist');
    }
  });
});

Cypress.Commands.add('loginAsClientSuccess', (rut, password) => {
  cy.visit('/auth/login');
  
  // Limpiar campos primero
  cy.get('#rut').clear();
  cy.get('#password').clear();
  
  // Escribir RUT y esperar que se valide
  cy.get('#rut').type(rut);
  
  // Escribir contraseña
  cy.get('#password').type(password);
  
  // Esperar a que el botón se habilite (el RUT debe ser válido)
  cy.get('[data-cy=btn-login]').should('not.be.disabled');
  
  // Hacer click en el botón
  cy.get('[data-cy=btn-login]').click();
  
  // Esperar a que la autenticación se complete exitosamente
  cy.url().should('not.include', '/auth/login');
  
  // Verificar que las cookies de autenticación estén presentes
  cy.getCookie('token').should('exist');
  cy.getCookie('userData').should('exist');
});

Cypress.Commands.add('loginAsAdmin', (rut, password) => {
  cy.visit('/auth/login-admin');
  
  // Limpiar campos primero
  cy.get('#rut').clear();
  cy.get('#password').clear();
  
  // Escribir RUT y esperar que se valide
  cy.get('#rut').type(rut);
  
  // Escribir contraseña
  cy.get('#password').type(password);
  
  // Esperar a que el botón se habilite
  cy.get('[data-cy=btn-login]').should('not.be.disabled');
  
  // Hacer click en el botón
  cy.get('[data-cy=btn-login]').click();
  
  // Esperar a que redirija a admin
  cy.url().should('include', '/admin');
  
  // Verificar cookies
  cy.getCookie('token').should('exist');
  cy.getCookie('userData').should('exist');
});

Cypress.Commands.add('loginAsSuperAdmin', (rut, password) => {
  cy.visit('/auth/login-admin');
  
  // Limpiar campos primero
  cy.get('#rut').clear();
  cy.get('#password').clear();
  
  // Escribir RUT y esperar que se valide
  cy.get('#rut').type(rut);
  
  // Escribir contraseña
  cy.get('#password').type(password);
  
  // Esperar a que el botón se habilite
  cy.get('[data-cy=btn-login]').should('not.be.disabled');
  
  // Hacer click en el botón
  cy.get('[data-cy=btn-login]').click();
  
  // Esperar a que redirija a super-admin
  cy.url().should('include', '/super-admin');
  
  // Verificar cookies
  cy.getCookie('token').should('exist');
  cy.getCookie('userData').should('exist');
});

Cypress.Commands.add('logout', () => {
  // Buscar y hacer click en el botón de cerrar sesión
  // Primero intentar encontrar el enlace "Cerrar sesión"
  cy.get('body').then(($body) => {
    if ($body.find('a:contains("Cerrar sesión")').length > 0) {
      // Si existe un enlace "Cerrar sesión", hacer click
      cy.contains('a', 'Cerrar sesión').click({ force: true });
    } else if ($body.find('button:contains("Cerrar sesión")').length > 0) {
      // Si existe un botón "Cerrar sesión", hacer click
      cy.contains('button', 'Cerrar sesión').click({ force: true });
    } else {
      // Buscar en elementos li que contengan "Cerrar"
      cy.contains('li', 'Cerrar').click({ force: true });
    }
  });
  
  // Esperar a que aparezca el modal de confirmación
  cy.get('[data-cy=confirm-logout]', { timeout: 10000 }).should('be.visible');
  cy.get('[data-cy=confirm-logout]').click();
  
  // Verificar que se redirigió al login
  cy.url().should('include', '/auth/login');
  
  // Verificar que las cookies fueron eliminadas
  cy.getCookie('token').should('not.exist');
  cy.getCookie('userData').should('not.exist');
});

Cypress.Commands.add('checkUserData', (expectedData) => {
  // Verificar que los datos del usuario están disponibles en cookies
  cy.getCookie('userData').then((cookie) => {
    if (cookie) {
      try {
        // Intentar decodificar la cookie si está codificada
        let cookieValue = cookie.value;
        
        // Si la cookie está codificada en URL, decodificarla
        if (cookieValue.includes('%')) {
          cookieValue = decodeURIComponent(cookieValue);
        }
        
        const userData = JSON.parse(cookieValue);
        
        if (expectedData.name) {
          expect(userData.name).to.include(expectedData.name);
        }
        if (expectedData.email) {
          expect(userData.email).to.equal(expectedData.email);
        }
        if (expectedData.rut) {
          expect(userData.rut).to.equal(expectedData.rut);
        }
        if (expectedData.roles) {
          expect(userData.roles).to.deep.equal(expectedData.roles);
        }      } catch (error: any) {
        // Si hay error al parsear JSON, mostrar información útil
        cy.log('Error parsing userData cookie:', error);
        cy.log('Cookie value:', cookie.value);
        throw new Error(`Failed to parse userData cookie: ${error.message}`);
      }
    } else {
      throw new Error('userData cookie not found');
    }
  });
});