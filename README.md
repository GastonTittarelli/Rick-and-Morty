# Rick & Morty App v3.0

Aplicación desarrollada en Angular, NestJS y CSS, con base de datos PostgreSQL. El proyecto consume la API pública de Rick & Morty y extiende sus funcionalidades con autenticación, favoritos y comentarios personalizados. Se trabajó con buenas prácticas, arquitectura modular, servicios reutilizables, validaciones a nivel frontend y backend, interceptores, guards, pipes personalizados, diseño responsive y backend propio con persistencia de datos.

---

## 🔗 Enlaces

- **Deploy en Vercel:** https://rick-and-morty-blond-three.vercel.app/
ℹ️ Nota: debido a que los entornos están hosteados en servidores gratuitos, la aplicación puede tardar algunos segundos en activarse al primer acceso. (demora hasta 30 segundos para loguear o registrar usuario apenas ingresas a la página)

---

## ✨ Funcionalidades desarrolladas

### 1. 🧍‍♂️ Sección de personajes (`/characters`)

- Se accede desde la ruta `/characters`.
- Muestra cards con imagen y nombre de cada personaje.
- Implementa **paginación**, evitando cargar todos los personajes de una sola vez.
- Paginación integrada usando la información que devuelve la propia API (20 personajes por página).
- Cada card es clickeable y lleva al detalle del personaje.

🛠️ Implementado usando `*ngFor`, `routerLink`.

---

### 2. 🧬 Detalle de personaje (`/characters/:id`)

- Al hacer clic en una card, se navega a `/characters/:id`.
- Se muestran todos los detalles del personaje en esta vista.

---

### 3. ❌ Vista 404 personalizada (`/404`)

- Página personalizada que informa que la ruta no fue encontrada.
- Implementado en el módulo de ruteo (`AppRoutingModule`) con `path: '**'`.

---

### 4. 📺 Sección de episodios (`/episodes`)

- Nueva sección donde se listan todos los episodios de la serie.
- Cada episodio se muestra en una card con nombre y número.
- Al hacer clic se accede al detalle del episodio (`/episodes/:id`).
- Se visualizan los personajes que participan en ese episodio.
- Permite **marcar como favorito** un episodio, relacionándolo con el usuario autenticado.

---

### 5. 💬 Comentarios en episodios

- En la vista de cada episodio, los usuarios pueden:
  - Agregar comentarios.
  - Editar o eliminar sus propios comentarios.
- Los usuarios administradores pueden:
  - Eliminar cualquier comentario.
  - Habilitar o deshabilitar la sección de comentarios.

---

### 6. 👤 Vista de perfil de usuario (`/profile`)

- Vista accesible para usuarios autenticados.
- Muestra los datos del usuario logueado.
- Permite editar su información personal y subir una foto de perfil.
- Muestra la lista de episodios marcados como favoritos.

---

### 7. 🔐 Autenticación de usuarios

- Se implementaron vistas de **Login** y **Register** conectadas al backend.
- Formularios reactivos con validaciones de campos requeridos.
- Guardado de sesión:
  - Si el usuario selecciona "Recordarme", los datos se almacenan en `localStorage`, permitiendo que la sesión persista incluso al cerrar la pestaña o navegador.
  - Si no se selecciona esa opción, la sesión se guarda en `sessionStorage` y se elimina al cerrar el navegador.
  - Además, si se selecciona "Recordarme", el correo se recuerda para próximos ingresos incluso después de cerrar sesión.
- Uso de `Guards` para proteger rutas:
  - Usuarios no autenticados no pueden acceder a rutas privadas.
  - Usuarios autenticados no pueden acceder a vistas de login/register.
- Animación de transición visual entre las vistas de login y registro para una mejor experiencia de usuario.

---

### 8. ⚙️ Backend y base de datos

- Backend desarrollado con **NestJS** y base de datos relacional **PostgreSQL**.
- Configuración completa de **módulos**, **controladores**, **servicios** y **entidades** para cada funcionalidad (usuarios, favoritos, comentarios).
- Validaciones a nivel backend mediante **DTOs**, decoradores y `ValidationPipe`.
- Implementación de **JWT** para autenticación:
  - Generación y validación de tokens.
  - Protección de rutas mediante `Guards`.
- Uso de **Docker** para levantar la base de datos localmente.
- Persistencia garantizada con:
  - **Render** para el backend.
  - **Neon** para la base de datos en la nube.

---

### 9. 🔄 Interceptor HTTP

- Se implementó un **interceptor global** para capturar las respuestas del backend.
- Permite mostrar mensajes de éxito, error o advertencia en función de la respuesta del servidor.

---

### 10. 🛠️ Servicios globales

- **Servicio de mensajes** centralizado para mostrar alertas personalizadas según comportamiento de la app.
- **Servicio de usuarios** para gestionar login, registro, sesión, perfil y favoritos.
- **Servicio de API** para obtener personajes y episodios desde la API pública, con paginación, usando `HttpClient`.
- **Servicio de formularios** (`FormErrorsService`) que gestiona errores y validaciones personalizadas como:
  - Coincidencia de contraseñas (`passwordMatchValidator`).
  - Validación de grupos de campos (`addressGroupValidator`).

---

### 11. 🧪 Testeo y cobertura

#### Unit Testing con Jasmine + Karma
- Se desarrollaron pruebas unitarias bajo el enfoque **Given – When – Then**, garantizando la claridad en los escenarios de prueba.  
- La aplicación alcanza un **>95% de coverage** en *statements, branches, functions y lines*.  
- Se testearon **módulos, componentes, servicios, interceptores, guards y pipes personalizados**.  

#### End-to-End Testing con Cypress
- Se implementó un flujo **E2E completo para la autenticación de usuarios** (login y registro).  
- Los servicios fueron **mockeados con `cy.intercept`**, evitando dependencias externas y asegurando consistencia en los tests.  
- Se utilizaron **comandos personalizados** (`custom.commands.js`) para simplificar la reutilización de pasos repetitivos dentro de los escenarios de prueba.  


### 12. 🌐 Pipes personalizados

- Se creó un pipe llamado `TranslateStatusPipe` para traducir el estado (`status`) y género (`gender`) del personaje del inglés al español.

---

### 13. 🎨 Colores dinámicos con `ngClass`

- Según el estado del personaje (`status`), el color de fondo cambia dinámicamente.

---

### 14. 📱 Responsive design + estilos

- Bootstrap 5 utilizado como base de diseño.
- Se agregaron estilos y ajustes personalizados con CSS.
- Totalmente adaptada para dispositivos móviles y pantallas de escritorio.

---

