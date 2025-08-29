describe('Flujo E2E: Autenticación', () => {

  beforeEach(() => {
    cy.viewport(1920, 1080);
  });

  it('Login fallido: rechaza credenciales inválidas y muestra error', () => {
    cy.loginUser(false); 
    cy.contains('Invalid user or password').should('be.visible');
    cy.contains('Invalid user or password').should('not.exist');
  });

  it('Registro exitoso: crea un usuario nuevo', () => {
    cy.registerUser();
  });

  it('Login exitoso: permite loguearse con el usuario recién creado y muestra personajes', () => {
    cy.loginUser(true);
    cy.contains('Authenticated user').should('be.visible');

    cy.get('[data-cy="characters-container"]').should('exist');
    cy.get('[data-cy="character-card"]').should('have.length.greaterThan', 0);
  });
});
