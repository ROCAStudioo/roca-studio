# ROCA Studio - Contexto del Proyecto

## Resumen
Landing page + sistema de galerías privadas + invitaciones digitales para un estudio de fotografía profesional en Puebla, México.

## URLs
- Sitio en vivo: https://rocastudio.site
- Panel admin: https://rocastudio.site/admin
- Repositorio: https://github.com/ROCAStudioo/roca-studio
- Dominio: rocastudio.site (Namecheap)
- Hosting: Vercel

## Stack Técnico
- Next.js 16 + TypeScript + Tailwind CSS v4 + Framer Motion
- Vercel Blob Storage (privado) para datos de clientes/galerías
- Google Drive API para servir fotos de galerías privadas (5 TB)
- Google Service Account para autenticación con Drive
- EmailJS para formulario de cotización y selección de fotos

## Credenciales EmailJS
- Service ID: service_iys6mhm
- Template selección fotos: template_sh5fy6o
- Template cotización: template_0huw00i
- Public Key: kcJABHUOM-iklLOPj

## Sistema de Galerías de Clientes
- Panel admin en /admin (protegido con NEXT_PUBLIC_ADMIN_PASSWORD)
- Cada cliente tiene URL: /galeria/[slug] + código de acceso
- Fotos se leen directo de Google Drive (carpeta compartida con service account)
- Si hay subcarpetas en Drive → se muestran como pestañas en la galería
- Si no hay subcarpetas → todas las fotos en una sola sección
- Paginación automática para más de 1000 fotos
- Thumbnails: thumbnailLink de Drive =s600, lightbox =s1600
- Datos de clientes guardados en Vercel Blob (clientes.json)
- La lectura del blob requiere BLOB_READ_WRITE_TOKEN en header Authorization

## Sistema de Selección de Fotos
- El cliente activa "Modo selección" en su galería
- Puede marcar fotos para edición (✓) y para cuadro (🖼️)
- Límites configurables por cliente desde el admin (limiteEdicion, limiteCuadro)
- La opción de cuadro se puede desactivar por cliente (incluyeCuadro: false)
- Al enviar → llega correo a rocastudiofotografico@gmail.com vía EmailJS
- También se abre WhatsApp con mensaje corto de confirmación
- Panel flotante muestra conteo en tiempo real

## Campos del Admin para crear galería
- Nombre del cliente
- Tipo de evento
- Fecha del evento
- ID de carpeta en Google Drive
- Límite fotos para edición (default: 150)
- Límite fotos para cuadro (default: 1)
- Checkbox: ¿Incluye foto para cuadro?

## Sistema de Invitaciones Digitales
- Ruta: /invitacion/[nombre-carpeta]
- Archivos en: public/invitaciones/[nombre-carpeta]/
- Requiere <base href="/invitacion/nombre-carpeta/"> en el <head> del index.html
- Los archivos se sirven como estáticos (CDN Vercel) → videos sin cortes
- Instrucciones en: public/invitaciones/README.txt
- Para pedir nueva invitación: "Hazme una invitación digital para [evento] de [nombre]..."

## Variables de Entorno en Vercel
- GOOGLE_CLIENT_EMAIL: roca-studio-web@roca-studio.iam.gserviceaccount.com
- GOOGLE_PRIVATE_KEY: clave privada (sin comillas, con \n literales)
- NEXT_PUBLIC_ADMIN_PASSWORD: contraseña del panel admin
- BLOB_READ_WRITE_TOKEN: token para leer/escribir en Vercel Blob
- BLOB_STORE_ID: (generado automáticamente)
- NEXT_PUBLIC_EMAILJS_SERVICE_ID: service_iys6mhm
- NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: template_sh5fy6o
- NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: kcJABHUOM-iklLOPj

## Estructura de Fotos del Portafolio (public/fotos/)
- /fotos/boda/ → 48 fotos (foto1.jpg a foto48.jpg)
- /fotos/xv/ → 35 fotos (foto1.jpg a foto35.jpg, foto34 es .jpeg)
- /fotos/newborn/ → 11 fotos
- /fotos/maternidad/ → 7 fotos
- /fotos/comercial/ → 12 fotos
- /fotos/retrato/ → 8 fotos
- /fotos/portada.jpg → Hero principal
- /fotos/ROC05200-Editar.jpg → Sección CTA "Tu historia merece ser contada..."
- /logo.png → Logo blanco de ROCA Studio

## Páginas existentes
- / → Landing page principal
- /admin → Panel de administración
- /galeria/[slug] → Galería privada del cliente
- /invitacion/[...slug] → Invitaciones digitales
- /privacidad → Aviso de privacidad
- /cookies → Política de cookies

## Datos de Contacto
- Correo: rocastudiofotografico@gmail.com
- Teléfono/WhatsApp: 222 563 5334 (+522225635334)
- Ubicación: Puebla, México
- Google Maps: https://maps.app.goo.gl/pQ3h4c6eYZryBzck8
- Facebook: https://www.facebook.com/Rocaphotography.rc/
- Instagram: https://www.instagram.com/_roca_studio/
- TikTok: https://www.tiktok.com/@roca_studio

## Convenciones
- Fotos en public/fotos/[categoria]/foto1.jpg, foto2.jpg...
- Nombres de carpetas: sin espacios, sin acentos, minúsculas
- Filtro "Todos" en portafolio: 4 fotos por categoría
- Slugs de galerías: nombre-del-cliente + 4 chars aleatorios (ej: nicol-a3f2)
- Al agregar nueva categoría al portafolio: actualizar categorias[] y fotos[] en Portafolio.tsx

## Notas Importantes
- Vercel es read-only → no se pueden escribir archivos en disco (usar Blob)
- fetch al blob necesita cache:"no-store" para evitar datos cacheados
- Google Drive thumbnailLink funciona para mostrar fotos, /uc?export=view no
- La private key de Google debe ir SIN comillas en Vercel env vars
- bg-fixed no funciona en iOS Safari (parallax)
- Videos en invitaciones deben estar en public/ para servirse como estáticos
