/// <reference types="cypress" />
// Registrar un usuario nuevo
Cypress.Commands.add('registerUser', () => {
  cy.fixture('user.json').then((user) => {
    cy.intercept('POST', '/user/register', { fixture: 'register-success.json' }).as('register');
  cy.visit('/auth/register');

  cy.get('[data-cy="register-name"]').type(user.name);
  cy.get('[data-cy="register-mail"]').type(user.email);
  cy.get('[data-cy="register-password"]').type(user.password);
  cy.get('[data-cy="register-repeat-password"]').type(user.password);
  cy.get('[data-cy="register-street"]').type(user.address.street);
  cy.get('[data-cy="register-city"]').type(user.address.city);
  cy.get('[data-cy="register-country"]').select(user.address.country);
  cy.get('[data-cy="register-cp"]').type(user.address.cp);

  cy.get('[data-cy="register-submit"]').click();
  cy.wait('@register');

  cy.url().should('include', '/auth/login');

  });
});

// Loguear un usuario existente
Cypress.Commands.add('loginUser', (success: boolean = true) => {
  cy.fixture('user.json').then((user) => {
    const fixtureFile = success ? 'login-success.json' : 'login-error.json';
    cy.intercept('POST', '/user/login', { fixture: fixtureFile }).as('login');

    if (success) {
      cy.intercept('GET', '/user/profile', { fixture: 'profile-success.json' }).as('getProfile');
      cy.intercept('GET', '/characters', { fixture: 'characters.json' }).as('getCharacters');
    }

    cy.visit('/auth/login');
    cy.get('[data-cy="login-email"]').type(user.email);
    cy.get('[data-cy="login-password"]').type(user.password);
    cy.get('[data-cy="login-submit"]').click();

    cy.wait('@login');

    if (success) {
      cy.wait('@getProfile');
    }
  });
});

// Verificar la lista de personajes en el home
Cypress.Commands.add('verifyCharactersLoaded', () => {
  cy.intercept('GET', '/characters', { fixture: 'characters.json' }).as('getCharacters');

  cy.wait('@getCharacters');

  cy.get('[data-cy="characters-container"]', { timeout: 4000 })
    .should('be.visible')
    .within(() => {
      cy.get('[data-cy="character-card"]').should('have.length.greaterThan', 0);
    });
});