describe('Flujo E2E: Autenticación', () => {

  let testUser: any;

  // Cargar datos del usuario desde el fixture antes de cada test
  beforeEach(() => {
    cy.fixture('user.json').then((user) => {
      const timestamp = Date.now() % 100000;// para crear un email único y evitar que tengamos que cambiarlo desde el json
      testUser = {
        ...user,
        email: `test${timestamp}@mail.com`,
      };
    });
  });

  it('Registra un usuario nuevo tras login fallido y permite iniciar sesión correctamente', () => {
    cy.viewport(1920, 1080); // Establece el tamaño de la ventana
    // --- Logueo fallido del usuario ---
    // 1 Abre la página de login
    cy.visit('/auth/login');
    cy.url().should('include', '/auth/login');

    // * Assert: Verifica que se vea el formulario (solo elementos críticos, ya que fueron testeados en jasmine)
    cy.get('form').should('be.visible');

    // 2 Ingresa usuario y contraseña inválidos.
    cy.get('[data-cy="login-email"]').type(testUser.email);
    cy.get('[data-cy="login-password"]').type(testUser.password);
    cy.get('[data-cy="login-submit"]').click();

    // 3 Valida mensaje de error del backend
    cy.contains('Invalid user or password').should('be.visible');
    // Esperar hasta que el mensaje de error desaparezca
    cy.contains('Invalid user or password').should('not.exist');

    // * Assert (verificación) adicional: el botón de registro sigue disponible luego del login fallido
    cy.get('[data-cy="go-to-register"]').should('exist');

    // 4 Click en "New around here? Sign up" para navegar al registro
    cy.get('[data-cy="go-to-register"]').click();
    cy.url().should('include', '/auth/register');

    // * Assert: el formulario de registro está visible y habilitado
    cy.get('[data-cy="register-name"]', { timeout: 1000 }) // Para esperar que termine la animación (previamente testeado en Jasmine)
      .should('be.visible')
      .and('not.be.disabled'); 


    // --- Registro de usuario ---
    // 5 Completa el formulario de registro
    cy.get('[data-cy="register-name"]').type(testUser.name);
    cy.get('[data-cy="register-mail"]').type(testUser.email);
    cy.get('[data-cy="register-password"]').type(testUser.password);
    cy.get('[data-cy="register-repeat-password"]').type(testUser.password);
    cy.get('[data-cy="register-street"]').type(testUser.address.street);
    cy.get('[data-cy="register-city"]').type(testUser.address.city);
    cy.get('[data-cy="register-country"]').select(testUser.address.country);
    cy.get('[data-cy="register-cp"]').type(testUser.address.cp);

    // 6 Click en el botón de registro para crear el usuario con los datos ingresados
    cy.get('[data-cy="register-submit"]').should('be.visible').click(); // Acá detecté que el botón de registro tenia un error de escritura gracias al selector .should("have.text", "Sign Up")

    // 7 Espera mensaje de éxito y redirección (ese es el timeout que le di desde mi componente)
    cy.contains('User created successfully').should('be.visible');
    cy.contains('User created successfully').should('not.exist'); // esperar redirección
    cy.url().should('include', '/auth/login');


    // --- Login exitoso ---
    // * Assert: formulario de login limpio y listo
    cy.get('[data-cy="login-email"]', { timeout: 2000 }).should('be.visible').and('have.value', '');
    cy.get('[data-cy="login-password"]').should('have.value', '');

    // 8 Completa el formulario de login con los datos del usuario recién creado
    cy.get('[data-cy="login-email"]').type(testUser.email);
    cy.get('[data-cy="login-password"]').type(testUser.password);

    // 9 Click en el botón de login para iniciar sesión
    cy.get('[data-cy="login-submit"]').click();

    // --- Verificar redirección al home ---
    // 10 Redirección a mi home y verifica que la URL incluya '/home/characters'
    cy.url().should('include', '/home/characters');

    // * Assert: lista de personajes visible para confirmar que la app cargó correctamente
    cy.get('[data-cy="characters-container"]', { timeout: 4000 })
    .should('be.visible')
    .within(() => {
      cy.get('[data-cy="character-card"]')
        .should('have.length.greaterThan', 0); // Al menos un personaje fue cargado
    });
  });
});