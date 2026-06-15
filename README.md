# 🍷 Bar El Poleo de Deborah - Sitio Web Oficial

Este es el repositorio oficial del sitio web de **Bar El Poleo de Deborah**, un encantador rincón en la Plaza de Pau Casals de Covibar (Rivas-Vaciamadrid), famoso por sus desayunos tradicionales, raciones abundantes en la terraza peatonal y guisos caseros diarios.

## 🚀 Cómo ejecutar en local

El proyecto está configurado con **Vite** para ofrecer una experiencia de desarrollo ultra rápida y recarga en tiempo real (HMR).

### Requisitos previos
- Tener instalado [Node.js](https://nodejs.org/) (v18 o superior recomendado).

### Instrucciones
1. Abre tu terminal en el directorio del proyecto.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre [http://localhost:5173/](http://localhost:5173/) en tu navegador para ver la página.

---

## 🌐 Cómo publicar la web gratis en GitHub Pages

Dado que la web está estructurada como un sitio estático moderno con rutas relativas para todos sus recursos, puedes publicarla de forma completamente gratuita utilizando **GitHub Pages** directamente desde este repositorio.

### Instrucciones para publicar en GitHub Pages:

1. Ve a la página de este repositorio en GitHub.
2. Entra en la pestaña **Settings** (Configuración) en el menú superior.
3. En la barra lateral izquierda, dentro de la sección *Code and automation*, haz clic en **Pages**.
4. En la sección **Build and deployment**:
   - **Source**: Selecciona `Deploy from a branch` (desplegar desde una rama).
   - **Branch**: Selecciona `main` y la carpeta `/ (root)` (raíz).
   - Haz clic en **Save** (Guardar).
5. ¡Listo! En unos minutos, GitHub compilará y publicará tu sitio. Aparecerá un enlace en la parte superior de la página de configuración con la dirección pública (por ejemplo: `https://antartisconsulting.github.io/barpoleodedeborah/`).

---

## 🛠️ Tecnologías Utilizadas

- **HTML5 & CSS3**: Estructura semántica y diseño visual a medida (Vanilla CSS).
- **JavaScript (Vanilla)**: Lógica interactiva para el menú móvil, filtro de categorías del menú, estado del bar en tiempo real (abierto/cerrado) según la zona horaria de Madrid, y asistente de pedidos mediante integración con la API de WhatsApp.
- **Vite**: Entorno de ejecución y bundling local.
- **FontAwesome**: Iconografía premium.
- **Google Fonts**: Tipografías modernas (Outfit, Playfair Display, Inter).
