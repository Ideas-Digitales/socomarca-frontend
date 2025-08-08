/// <reference types="cypress" />

import { TEST_CREDENTIALS } from '../../shared/test-credentials';

// Pasos: Iniciar sesión como superadmin, navegar a la página de categorías, verificar que se encuentre el botón de exportar con el texto "Descargar Excel". Se selecciona el botón y se descarga el archivo. Se verifica que el archivo se haya descargado correctamente.

describe('Admin - Categorías - Exportar Excel', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    // Limpiar archivos descargados previos
    cy.task('clearDownloads');
  });

  it('Debe permitir exportar archivo Excel desde la página de categorías', () => {
    // Paso 1: Iniciar sesión como superadmin usando comando personalizado
    cy.loginAsSuperAdmin(
      TEST_CREDENTIALS.superadmin.rut,
      TEST_CREDENTIALS.superadmin.password
    );

    // Paso 2: Navegar a la página de categorías
    cy.visit('/admin/categorias');

    // Verificar que estamos en la ruta correcta
    cy.url().should('include', '/admin/categorias');

    // Esperar a que se cargue la página
    cy.wait(3000);

    // Paso 3: Verificar que existe el botón de exportar
    cy.get('button')
      .contains('Descargar Excel')
      .should('be.visible')
      .and('not.be.disabled');

    // Paso 4: Hacer clic en el botón de descargar
    cy.get('button').contains('Descargar Excel').click();

    // Verificar que el botón se deshabilita y muestra "Descargando..."
    cy.get('button')
      .contains('Descargando...')
      .should('be.visible')
      .and('be.disabled');

    // Paso 5: Verificar que el archivo se descargó correctamente
    // Esperar a que la descarga se complete (aumentado a 10 segundos)
    cy.wait(10000);

    // Verificar que se descargó un archivo con el patrón esperado
    cy.task('getDownloadedFiles').then((files) => {
      const fileList = files as string[];
      // Buscar archivos que coincidan con el patrón de categorías
      const categoriasFiles = fileList.filter(
        (file) =>
          file.includes('categorias_') &&
          file.endsWith('.xlsx')
      );

      // Si no hay archivos, mostrar cuáles archivos se encontraron para debug
      if (categoriasFiles.length === 0) {
        cy.log('Archivos encontrados:', JSON.stringify(fileList));
        throw new Error(`No se encontraron archivos con patrón 'categorias_'. Archivos encontrados: ${fileList.join(', ')}`);
      }

      expect(categoriasFiles.length).to.be.greaterThan(0);
      return categoriasFiles[0];
    }).then((fileName) => {
      // Verificar que el archivo no esté vacío
      cy.task('getFileSize', fileName).should('be.greaterThan', 0);
    });

    // Verificar que el botón de exportar se habilita nuevamente
    cy.get('button')
      .contains('Descargar Excel')
      .should('be.visible')
      .and('not.be.disabled');

    // Cerrar sesión
    cy.get('span').contains('Cerrar sesión').click();

    cy.get('button').contains('Continuar').click();

    // Verificar que se cerró sesión después de 5 segundos
    cy.wait(5000);

    // Verificar que se redirigió a la página de login
    cy.url().should('include', '/login');
  });
});
