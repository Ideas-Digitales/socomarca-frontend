/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    loginAsClient(rut: string, password: string): Chainable<Element>;
    loginAsClientSuccess(rut: string, password: string): Chainable<Element>;
    loginAsAdmin(rut: string, password: string): Chainable<Element>;
    loginAsSuperAdmin(rut: string, password: string): Chainable<Element>;
    logout(): Chainable<Element>;
    checkUserData(expectedData: {
      name?: string;
      email?: string;
      rut?: string;
      roles?: string[];
    }): Chainable<Element>;
  }
}
