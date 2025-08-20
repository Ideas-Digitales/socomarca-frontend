describe('Carga Masiva de Imágenes', () => {
  beforeEach(() => {
    // Visitar la página de carga masiva
    cy.visit('/admin/carga-masiva');
  });

  it('debería mostrar la página de carga masiva', () => {
    // Verificar que la página se carga correctamente
    cy.get('h1').should('contain', 'Carga Masiva de Imágenes');
    cy.get('p').should('contain', 'Sube un archivo ZIP con imágenes de productos');
  });

  it('debería mostrar el área de carga de archivos', () => {
    // Verificar que existe el área de carga
    cy.get('input[type="file"]').should('exist');
    cy.get('label').should('contain', 'Seleccionar archivo ZIP');
    // Verificar que no hay texto de drag & drop
    cy.get('p').should('not.contain', 'arrastra y suelta');
  });

  it('debería mostrar instrucciones de uso', () => {
    // Verificar que se muestran las instrucciones
    cy.get('h3').should('contain', 'Instrucciones para la carga masiva');
    cy.get('ul li').should('have.length', 3);
    cy.get('ul li').first().should('contain', 'El archivo debe estar en formato ZIP');
  });

  it('debería validar archivos no ZIP', () => {
    // Crear un archivo de texto (no ZIP)
    const textFile = new File(['contenido de prueba'], 'test.txt', { type: 'text/plain' });
    
    // Simular la selección del archivo
    cy.get('input[type="file"]').attachFile({
      fileContent: textFile,
      fileName: 'test.txt',
      mimeType: 'text/plain'
    });

    // Verificar que se muestra el mensaje de error
    cy.get('.text-red-600').should('contain', 'Por favor, selecciona un archivo ZIP válido');
  });

  it('debería permitir seleccionar archivos ZIP válidos', () => {
    // Crear un archivo ZIP simulado
    const zipFile = new File(['contenido zip'], 'test.zip', { type: 'application/zip' });
    
    // Simular la selección del archivo
    cy.get('input[type="file"]').attachFile({
      fileContent: zipFile,
      fileName: 'test.zip',
      mimeType: 'application/zip'
    });

    // Verificar que se muestra la información del archivo
    cy.get('.bg-gray-50').should('contain', 'test.zip');
    cy.get('button').should('contain', 'Subir y Sincronizar');
  });

  it('debería mostrar el botón de subida deshabilitado sin archivo', () => {
    // Verificar que el botón está deshabilitado inicialmente
    cy.get('button').should('be.disabled');
    cy.get('button').should('contain', 'Subir y Sincronizar');
  });

  it('debería permitir eliminar un archivo seleccionado', () => {
    // Crear y seleccionar un archivo ZIP
    const zipFile = new File(['contenido zip'], 'test.zip', { type: 'application/zip' });
    cy.get('input[type="file"]').attachFile({
      fileContent: zipFile,
      fileName: 'test.zip',
      mimeType: 'application/zip'
    });

    // Verificar que se muestra el archivo
    cy.get('.bg-gray-50').should('contain', 'test.zip');

    // Hacer clic en el botón de eliminar
    cy.get('.bg-gray-50 button').click();

    // Verificar que el archivo se eliminó
    cy.get('.bg-gray-50').should('not.exist');
    cy.get('button').should('be.disabled');
  });

  it('debería mostrar mensaje de error al intentar subir sin archivo', () => {
    // Hacer clic en el botón de subida sin archivo
    cy.get('button').click();

    // Verificar que se muestra el mensaje de error
    cy.get('.text-red-600').should('contain', 'Por favor, selecciona un archivo para subir');
  });

  it('debería tener el diseño responsive correcto', () => {
    // Verificar que la página es responsive
    cy.viewport('iphone-x');
    cy.get('.max-w-3xl').should('exist');
    
    cy.viewport('macbook-13');
    cy.get('.max-w-3xl').should('exist');
  });

  it('debería mostrar el área de carga con estilos correctos', () => {
    // Verificar estilos del área de carga
    cy.get('input[type="file"]').should('exist');
    cy.get('.text-lime-600').should('exist');
    cy.get('.bg-lime-600').should('exist');
  });

  it('debería mostrar el icono de carga correctamente', () => {
    // Verificar que se muestra el icono de nube
    cy.get('svg').should('exist');
  });

  it('debería mostrar información de debug después de un error', () => {
    // Simular un error seleccionando un archivo no válido
    const textFile = new File(['contenido de prueba'], 'test.txt', { type: 'text/plain' });
    
    cy.get('input[type="file"]').attachFile({
      fileContent: textFile,
      fileName: 'test.txt',
      mimeType: 'text/plain'
    });

    // Verificar que se muestra el mensaje de error
    cy.get('.text-red-600').should('contain', 'Por favor, selecciona un archivo ZIP válido');
    
    // Verificar que no se muestra información de debug para errores de validación
    cy.get('h4').should('not.contain', 'Información de Debug');
  });
});
