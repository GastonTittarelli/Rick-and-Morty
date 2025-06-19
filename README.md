# Rick & Morty App v2.0

Aplicación desarrollada en Angular Node.js y CSS. El proyecto consume la API pública de Rick & Morty y presenta distintos desafíos implementados con buenas prácticas, uso de servicios, componentes, pipes personalizados, manejo de rutas y diseño responsive.

---


## 🔗 Enlaces

- **Deploy en Vercel:** https://rick-and-morty-blond-three.vercel.app/

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


### 4. 🌐 Pipes personalizados

- Se creó un pipe llamado `TranslateStatusPipe` para traducir el estado (`status`) y género (`gender`) del personaje del inglés al español.

---


### 5. 🎨 Colores dinámicos con `ngClass`

- Según el estado del personaje (`status`), el color de fondo cambia

---


### 6. 🔐 Autenticación de usuarios

- Se implementaron vistas de **Login** y **Register**.
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

### 7. 📢 Servicios globales

- Servicio de mensajes centralizado para mostrar mensajes de alerta dependiendo del comportamiento de la aplicación. Mensajes de éxito, error o advertencia obtenidos desde el backend.
- Servicio de usuarios centralizado para manejar la lógica de autenticación en toda la aplicación.
- Servicio de API para obtener personajes y detalles desde la API pública de Rick & Morty, con paginación, usando `HttpClient`.
- Servicio utilitario de formularios (`FormErrorsService`) que gestiona errores y validaciones personalizadas como:
  - Coincidencia de contraseñas (`passwordMatchValidator`)
  - Validación de dirección (`addressGroupValidator`)

---

### 8. 📱 Responsive design + estilos

- Bootstrap 5 utilizado como base de diseño.
- Se agregaron estilos y ajustes personalizados con CSS.
- Totalmente adaptada para dispositivos móviles y desktop.

---