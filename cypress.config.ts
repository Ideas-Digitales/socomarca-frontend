import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',    setupNodeEvents() {
      // implement node event listeners here
    },
    // Configuraciones adicionales para mejorar los tests
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    viewportWidth: 1280,
    viewportHeight: 720,
  },
});
