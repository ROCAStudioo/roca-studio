====================================================
  CÓMO AGREGAR INVITACIONES DIGITALES
  ROCA Studio
====================================================

URL final: rocastudio.site/invitacion/nombre-del-cliente


====================================================
  PASOS
====================================================

1. Crea la carpeta de la invitación aquí:
   public/invitaciones/nombre-del-cliente/

   REGLAS del nombre de carpeta:
   - Minúsculas
   - Sin espacios (usa guiones)
   - Sin acentos ni ñ
   Ejemplos: misxv-ada, boda-diana-saul, familia-garcia

2. Dentro debe haber un archivo index.html

3. Agrega esta línea en el <head> del index.html
   (después del <title>):

   <base href="/invitacion/nombre-del-cliente/">

   Esto hace que todas las rutas relativas
   (fotos, videos, css, js) funcionen correctamente.

4. Haz deploy:
   git add .
   git commit -m "Invitación nombre-del-cliente"
   git push

5. La invitación estará en:
   rocastudio.site/invitacion/nombre-del-cliente


====================================================
  EJEMPLO COMPLETO
====================================================

Carpeta:
  public/invitaciones/misxv-ada/
  ├── index.html
  ├── style.css
  ├── script.js
  ├── foto1.jpg
  ├── foto2.jpg
  ├── video_portada_ligero.mp4
  └── audio.mp3

En el index.html:
  <head>
      ...
      <title>XV Años - Ada</title>
      <base href="/invitacion/misxv-ada/">
      <link rel="stylesheet" href="style.css">
      ...
  </head>

URL:
  rocastudio.site/invitacion/misxv-ada


====================================================
  CÓMO PEDIRLE A KIRO QUE HAGA UNA INVITACIÓN
====================================================

Solo dile:

  "Hazme una invitación digital para [evento]
   de [nombre]. La fecha es [fecha], el lugar es
   [lugar]. Que quede en la carpeta
   public/invitaciones/[nombre-carpeta]/"

Kiro la creará lista para hacer push.


====================================================
  NOTAS IMPORTANTES
====================================================

• Los videos pesados (>50 MB) funcionan pero GitHub
  muestra una advertencia. No afecta el funcionamiento.

• Para mejor rendimiento de videos, comprímelos
  antes de subirlos (720p es suficiente para web).

• Los archivos se sirven desde el CDN de Vercel
  como archivos estáticos (rápido y con streaming).

• Si la invitación no carga correctamente, revisa
  que el <base href="..."> tenga el nombre exacto
  de la carpeta.

• Las rutas dentro del HTML deben ser RELATIVAS:
  BIEN: src="foto1.jpg" o src="video.mp4"
  MAL:  src="/foto1.jpg" o src="C:/Users/..."
