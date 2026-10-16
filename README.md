# Muestra web · LimpiaPro Express

Sitio de muestra para enseñar a clientes potenciales cómo puede verse la web de su negocio: rápido, pensado primero para celular y con contacto directo por WhatsApp.

**LimpiaPro Express es una marca ficticia.** Las fotos son de stock (ver `ASSET-LICENSES.md`). Los botones de WhatsApp y el cotizador abren un chat con Gerald (+506 7298 7020), quien diseñó esta muestra.

## Qué incluye

- HTML, CSS y JavaScript sin librerías ni recursos externos: fuentes e imágenes locales.
- Animaciones con CSS moderno (scroll-driven animations, view transitions) y una alternativa liviana para navegadores sin soporte. Respeta "reducir movimiento".
- Cotizador de 3 pasos que arma el mensaje de WhatsApp con lo elegido.
- Barra fija de WhatsApp en celular y medición real del tiempo de carga en el dispositivo del visitante.
- Funciona sin JavaScript: el contenido se lee completo y los enlaces de WhatsApp siguen funcionando.
- Content Security Policy estricta vía `<meta>` (solo recursos propios, Trusted Types).

## Publicación

GitHub Pages sirve la raíz del repositorio (`.nojekyll`). Archivos públicos: `index.html`, `styles.css`, `app.js`, `assets/`, `README.md`, `ASSET-LICENSES.md`.
