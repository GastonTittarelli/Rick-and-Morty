/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      registerUser(): Chainable<void>;
      loginUser(success?: boolean): Chainable<void>;
      verifyCharactersLoaded(): Chainable<void>;
    }
  }
}

export {};