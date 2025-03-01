# Tech Shop 🛒

**Tech Shop** es una tienda online de productos tecnológicos desarrollada con las siguientes tecnologías:

- **Frontend**: React + Vite + Bootstrap + CSS personalizado.
- **Backend**: Strapi para la creación de la API.

El proyecto se encuentra en desarrollo y actualmente cuenta con las siguientes funcionalidades:

- **Paginación**: Navegación entre páginas para una mejor organización de los productos.
- **Filtrado**: Filtrado de productos por categorías, precios, etc.
- **Carrito de compras**: Añadir, eliminar y gestionar productos en el carrito.
- **Detalles de productos**: Vista detallada de cada producto con descripción, imágenes y más.

## Características principales 🚀

- **Interfaz moderna y responsive**: Diseño adaptado a dispositivos móviles y desktop.
- **API personalizada**: Desarrollada con Strapi para gestionar productos, categorías y pedidos.
- **Estilos personalizados**: Uso de CSS para personalizar la apariencia de la tienda.
- **Rendimiento optimizado**: Gracias a Vite, la aplicación tiene un tiempo de carga rápido.
- **LocalStorage**: Almacena el carrito de compras en el navegador, asegurando su persistencia incluso después de cerrar la página o el navegador.

## Tecnologías utilizadas 💻

- **React**: Biblioteca de JavaScript para construir la interfaz de usuario.
- **Vite**: Herramienta de construcción rápida para el desarrollo moderno.
- **Bootstrap v5.2.3**: Framework de CSS para diseñar componentes responsive. 
- **Strapi**: Headless CMS para crear y gestionar la API.
- **CSS personalizado**: Estilos adicionales para personalizar la apariencia. Estilos personalizados diseñados específicamente para el proyecto y variables y fragmentos reutilizados de Bootstrap.

**Librerías**: 
- Para el spinner -> `https://uiball.com/ldrs/` *(midudev)*
- Para la alerta al pulsar '*agregar al carrito*' -> React-Toastify () -> `https://www.npmjs.com/package/react-toastify`
  
## Funcionalidades actuales ✅

1. **Paginación**: Navega entre páginas de productos.
2. **Filtrado**: Filtra productos por categoría, precio, etc.
3. **Carrito de compras**: Añade y gestiona productos en el carrito.
4. **Detalles de productos**: Visualiza información detallada de cada producto.

## Próximas funcionalidades 📅

- [ ] Integración con pasarela de pago (Stripe, PayPal, etc.).
- [ ] Sistema de autenticación y registro de usuarios.
- [ ] Búsqueda de productos por nombre o descripción.
- [ ] Sección de reseñas y valoraciones de productos.

## Instalación y configuración ⚙️

### Requisitos previos

- Node.js (v16 o superior)
- npm o yarn

### Pasos para ejecutar el proyecto

1. Clona el repositorio:
   ```
   git clone https://github.com/tuusuario/tech-shop.git
   ```
   
2. Instala las dependencias del frontend:


```
cd tech-shop/frontend
npm install
```

3. Instala las dependencias del backend (Strapi):

```
cd ../backend
npm install
```

4. Inicia el servidor de Strapi:
```
npm run develop
```

5. Inicia la aplicación de React:

```
cd ../frontend
npm run dev
```

Abre tu navegador y visita `http://localhost:3000` para ver la tienda en funcionamiento.

### Autores: 
👩‍💻 Laura Castaño

👨‍💻 Víctor Márquez


### **Licencia** 📄

Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.

Tech Shop es un proyecto en constante evolución. ¡Gracias por visitar y apoyar el desarrollo! 🚀

