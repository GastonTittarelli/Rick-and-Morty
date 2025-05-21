# Rick & Morty App 

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


### 6. 📱 Responsive design + estilos

- Bootstrap 5 utilizado como base de diseño.
- Se agregaron estilos y ajustes personalizados con CSS.
- Totalmente adaptada para dispositivos móviles y desktop.


---

### 7. 🚀 Despliegue en Vercel
