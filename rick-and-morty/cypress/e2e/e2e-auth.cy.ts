describe('Flujo E2E: Autenticación', () => {

  let testUser: any;

  // Cargar datos del usuario desde el fixture antes de cada test
  beforeEach(() => {
    cy.fixture('user.json').then((user) => {
      testUser = user;
    });
  });

  it('Registra un usuario nuevo tras login fallido y permite iniciar sesión correctamente', () => {
    // --- Logueo fallido del usuario ---
    // 1 Abre la página de login
    cy.visit('/auth/login');
    cy.url().should('include', '/auth/login');

    // 2 Verifica que se vea el formulario (solo elemento crítico, ya que fue testeado en jasmine)
    cy.get('form').should('be.visible');

    // 3 Ingresa usuario y contraseña inválidos
    cy.get('input[formControlName="mail"]').type(testUser.email);
    cy.get('input[formControlName="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();

    // 4 Valida mensaje de error del backend
    cy.contains('Invalid user or password').should('be.visible');
    // Esperar 1.5 segundos antes de continuar (mas o menos el tiempo que el usuario tarda en reaccionar)
    cy.wait(1500);

    // 5 Click en "New around here? Sign up" para navegar al registro
    cy.contains('New around here? Sign up').click();
    cy.url().should('include', '/auth/register');

    // 6 Espera que termine la animación (animación testeada previamente con jasmine)
    cy.wait(500);


    // --- Registro de usuario ---
    // 7 Completa el formulario de registro
    cy.get('input[formControlName="name"]').type(testUser.name);
    cy.get('.register-form input[formControlName="mail"]').type(testUser.email);

    cy.get('.register-form input[formControlName="password"]').type(testUser.password);
    cy.get('.register-form input[formControlName="repeatPassword"]').type(testUser.password);

    cy.get('input[formControlName="street"]').type(testUser.address.street);
    cy.get('input[formControlName="city"]').type(testUser.address.city);
    cy.get('select[formControlName="country"]').select(testUser.address.country);
    cy.get('input[formControlName="cp"]').type(testUser.address.cp);

    // 8 Click en el botón de registro para crear el usuario con los datos ingresados
    cy.get('button[type="submit"]').should('be.visible').click();

    // 9 Espera mensaje de éxito y redirección (ese es el timeout que le di desde mi componente)
    cy.contains('User created successfully', { timeout: 1500 }).should('be.visible');
    cy.wait(2000); // esperar redirección
    cy.url().should('include', '/auth/login');


    // --- Login exitoso ---
    // 10 Completa el formulario de login con los datos del usuario recién creado
    cy.get('input[formControlName="mail"]').type(testUser.email);
    cy.get('input[formControlName="password"]').type(testUser.password);

    // 11 Click en el botón de login para iniciar sesión
    cy.get('button[type="submit"]').click();

    // --- Verificar redirección al home ---
    // 12 Redirección a mi home y verifica que la URL incluya '/home/characters'
    cy.url().should('include', '/home/characters');
  });
});