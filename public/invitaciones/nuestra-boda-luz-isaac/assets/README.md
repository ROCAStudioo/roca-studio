# Archivos en assets/

| Archivo | Contenido |
|---|---|
| `photos/portada.jpg` | Portada (IS.ED-12, 1333x2000). Se encuadra con `background-position: center 28%` en css/styles.css |
| `photos/og.jpg` | Vista previa para WhatsApp (1200x630). Al publicar, `og:image` en index.html debe ser una URL absoluta (https://tu-dominio/assets/photos/og.jpg) |
| `photos/poster.jpg` | Imagen previa del video (fotograma a los 3 s) |
| `photos/foto1.jpg` ... `foto12.jpg` | Carrusel (1067x1600). Orden: 30, 24, 12, 13, 10, 103, 28, 117, 7, 48, 47, 79 de "Fotos y video" |
| `video/pedida.mp4` | Pedida de mano, H.264 + AAC, 720p, faststart (~18 MB) |
| `audio/siempre-te-busque.mp3` | "Siempre te busqué" (Monocordio). Suena al tocar "Toca para abrir"; vuelve a sonar tras pausar el video |

Los originales (`Fotos y video/`, `Low-Resolution/`, el mp3 y el video de 230 MB de la raíz) no se publican ni se suben a git (ver .gitignore).

Otros datos editables: `js/main.js` (WHATSAPP_NUMBER, CONFIRM_DEADLINE) e `index.html` (comentarios `EDITAR`).

## Reemplazar una foto
Optimiza la nueva (lado largo 1600 px, JPEG calidad ~80) y guárdala con el mismo nombre, por ejemplo `photos/foto3.jpg`.

## Agregar o quitar fotos del carrusel
En index.html, sección "Nosotros" (comentario EDITAR: fotos del carrusel), cada foto es una línea `<li class="slide">...</li>`.
- **Agregar:** copia una línea, pégala debajo y cambia `src="assets/photos/fotoN.jpg"` y el `alt`. Conserva `loading="lazy"` (salvo en la primera).
- **Quitar:** borra la línea `<li>` completa.
El contador, los puntos y el lightbox se ajustan solos. Si una imagen no existe se muestra un marco de relleno.
