# ROCA Studio - Contexto del Proyecto

## Resumen
Landing page + sistema de galerías privadas para clientes de un estudio de fotografía profesional en Puebla, México.

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

## Estructura de Galerías de Clientes
- Panel admin en /admin (protegido con NEXT_PUBLIC_ADMIN_PASSWORD)
- Cada cliente tiene URL: /galeria/[slug] + código de acceso
- Fotos se leen directo de Google Drive (carpeta compartida con service account)
- Thumbnails usan thumbnailLink de Drive (=s600), lightbox usa (=s1600)
- Datos de clientes guardados en Vercel Blob (clientes.json)
- La lectura del blob requiere BLOB_READ_WRITE_TOKEN en header Authorization

## Variables de Entorno en Vercel
- GOOGLE_CLIENT_EMAIL: email del service account
- GOOGLE_PRIVATE_KEY: clave privada (sin comillas, con \n literales)
- NEXT_PUBLIC_ADMIN_PASSWORD: contraseña del panel admin
- BLOB_READ_WRITE_TOKEN: token para leer/escribir en Vercel Blob
- BLOB_STORE_ID: (generado automáticamente)

## Estructura de Fotos del Portafolio (public/fotos/)
- /fotos/boda/ → 48 fotos (foto1.jpg a foto48.jpg)
- /fotos/xv/ → 35 fotos (foto1.jpg a foto35.jpg, foto34 es .jpeg)
- /fotos/newborn/ → 11 fotos
- /fotos/maternidad/ → 7 fotos
- /fotos/comercial/ → 12 fotos
- /fotos/retrato/ → 8 fotos
- /fotos/portada.jpg → Hero principal
- /fotos/cta.jpg → Sección CTA "Tu historia merece ser contada..."
- /logo.png → Logo blanco de ROCA Studio

## Datos de Contacto
- Correo: rocastudiofotografico@gmail.com
- Teléfono/WhatsApp: 222 563 5334
- Ubicación: Puebla, México
- Google Maps: https://maps.app.goo.gl/pQ3h4c6eYZryBzck8
- Facebook: https://www.facebook.com/Rocaphotography.rc/
- Instagram: https://www.instagram.com/_roca_studio/
- TikTok: https://www.tiktok.com/@roca_studio

## Convenciones
- Fotos siempre en public/fotos/[categoria]/foto1.jpg, foto2.jpg, etc.
- Nombres de carpetas: sin espacios, sin acentos, minúsculas
- El filtro "Todos" en portafolio muestra solo 4 fotos por categoría
- Slugs de galerías: nombre-del-cliente + 4 chars aleatorios (ej: nicol-a3f2)

## Notas Importantes
- Vercel es read-only: no se pueden escribir archivos en disco (por eso se usa Blob)
- El fetch al blob necesita cache: "no-store" para evitar datos viejos
- Google Drive thumbnailLink funciona para mostrar fotos, /uc?export=view no
- La private key de Google debe ir SIN comillas en Vercel env vars
