/// <reference types="cypress" />

import { TEST_CREDENTIALS } from '../../shared/test-credentials';

// Pasos: Iniciar sesión como superadmin, verificar que se encuentre en la ruta de ".../admin/total-de-ventas", verificar que se encuentre el botón de exportar con el texto "Descargar datos". Se selecciona el botón y se descarga el archivo. Se verifica que el archivo se haya descargado correctamente.

describe('Admin - Total de Ventas - Exportar Excel', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    // Limpiar archivos descargados previos
    cy.task('clearDownloads');
  });

  it('Debe permitir exportar archivo Excel desde la página de total de ventas', () => {
    // Paso 1: Iniciar sesión como superadmin usando comando personalizado
    cy.loginAsSuperAdmin(
      TEST_CREDENTIALS.superadmin.rut,
      TEST_CREDENTIALS.superadmin.password
    );

    // Paso 2: Navegar a la página de total de ventas
    cy.visit('/admin/total-de-ventas');

    // Verificar que estamos en la ruta correcta
    cy.url().should('include', '/admin/total-de-ventas');

    // Paso 3: Verificar que existe el botón de exportar
    cy.get('[data-cy=download-btn]')
      .should('be.visible')
      .and('not.be.disabled');

    // Paso 4: Hacer clic en el botón de descargar
    cy.get('[data-cy=download-btn]').click();

    // Verificar que el botón se deshabilita
    cy.get('[data-cy=download-btn]')
      .should('contain.text', 'Descargando...')
      .and('be.disabled');

    // Modal de éxito
    cy.get('h3').contains('¡Descarga exitosa!');

    // Paso 5: Verificar que el archivo se descargó correctamente
    // Esperar a que la descarga se complete
    cy.wait(5000);

    // Verificar que se descargó un archivo con el patrón esperado
    cy.task('getDownloadedFiles').then((files) => {
      const fileList = files as string[];
      // Buscar archivos que coincidan con el patrón de total de ventas
      const totalVentasFiles = fileList.filter(
        (file) =>
          file.includes('reporte-total-ventas') &&
          (file.endsWith('.xlsx') || file.endsWith('.csv'))
      );

      // Si no hay archivos, mostrar cuáles archivos se encontraron para debug
      if (totalVentasFiles.length === 0) {
        cy.log('Archivos encontrados:', JSON.stringify(fileList));
        throw new Error(`No se encontraron archivos con patrón 'reporte-total-ventas'. Archivos encontrados: ${fileList.join(', ')}`);
      }

      expect(totalVentasFiles.length).to.be.greaterThan(0);
      return totalVentasFiles[0];
    }).then((fileName) => {
      // Verificar que el archivo no esté vacío
      cy.task('getFileSize', fileName).should('be.greaterThan', 0);
    });

    // Verificar que aparece el modal de éxito y presionar el botón de aceptar
    cy.get('button').contains('Aceptar').click();

    // Verificar que el botón de exportar se habilita nuevamente
    cy.get('[data-cy=download-btn]')
      .should('contain.text', 'Descargar datos')
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
