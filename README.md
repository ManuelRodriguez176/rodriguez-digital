# Rodríguez Digital

Página web de **Rodríguez Digital**: páginas web con chatbot de cotizaciones por WhatsApp para negocios en Panamá.

Es HTML, CSS y JavaScript puro (sin frameworks ni build), listo para desplegar en Vercel.

## Estructura

```
├── index.html            Página única (secciones tipo ventana: Servicios, Planes, Trabajos, Contacto, Privacidad)
├── favicon.svg
├── assets/               Plantilla "Dimension" de HTML5 UP (no editar; ver LICENSE-HTML5UP.txt)
│   ├── css/  js/  webfonts/  sass/
├── images/               Fondo de la plantilla
├── css/
│   └── custom.css        Estilos propios: marca, planes, chat de ejemplo, FAQ, botón de WhatsApp
└── js/                   Módulos propios
    ├── config.js         ⚙️ Datos del negocio (WhatsApp, correo, mensajes)
    ├── whatsapp.js       Arma los enlaces wa.me
    ├── formulario.js     Formulario de cotización → WhatsApp
    ├── contacto.js       Enlaces de correo y año del footer
    └── main.js           Punto de entrada: inicializa todo
```

Las secciones se abren con el ancla del enlace: `/#servicios`, `/#planes`, `/#trabajos`, `/#contacto`, `/#privacidad`.

## Cambiar tus datos

Todo está en **`js/config.js`**: número de WhatsApp (507 + número, sin `+`), correo y mensajes predeterminados. Se actualizan en todo el sitio.

## Probar en local

Los módulos de JavaScript no funcionan abriendo el archivo con doble clic. Usa un servidor:

```bash
npx serve .
# o
python -m http.server 8000
```

## Desplegar en Vercel

1. En Vercel: **Add New → Project** e importa este repositorio.
2. Framework preset: **Other**. Sin comando de build.
3. Deploy. Cada `git push` vuelve a publicar.

## Privacidad

El sitio no tiene base de datos ni guarda formularios: los mensajes se arman en el navegador y se abren en WhatsApp. Ver la sección `/#privacidad`.

## Licencias y créditos

- Diseño basado en **[Dimension](https://html5up.net/dimension)** de [HTML5 UP](https://html5up.net), licencia Creative Commons Attribution 3.0. El crédito "Diseño: HTML5 UP" del pie de página es obligatorio por esa licencia: no lo quites.
- Íconos: Font Awesome Free (íconos CC BY 4.0, fuentes SIL OFL 1.1, código MIT).
- jQuery: MIT.
- Fuente Source Sans Pro (Google Fonts): SIL Open Font License 1.1.
- El logo de WhatsApp es marca de Meta; se usa solo para indicar el canal de contacto.
