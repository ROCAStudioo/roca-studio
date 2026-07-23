====================================================
  CÓMO AGREGAR INVITACIONES DIGITALES
====================================================

1. Crea una carpeta aquí con el nombre del cliente
   (minúsculas, sin espacios, usa guiones):

   invitaciones/valentina-xv/
   invitaciones/maria-jose-boda/

2. Dentro coloca todos los archivos de la invitación:
   - index.html
   - style.css
   - script.js
   - Fotos, videos, audios, etc.

3. Haz git add, commit y push.

4. La invitación estará disponible en:
   rocastudio.site/invitacion/valentina-xv
   rocastudio.site/invitacion/maria-jose-boda

IMPORTANTE:
- El nombre de la carpeta ES la URL
- Dentro de tu index.html, las rutas a archivos
  deben ser RELATIVAS, por ejemplo:
  
  BIEN:  src="Foto1.jpg"  o  href="style.css"
  MAL:   src="/Foto1.jpg"  o  href="/style.css"

  Si usas rutas absolutas, cámbialas a:
  src="/invitacion/nombre-carpeta/Foto1.jpg"
