# Rodríguez Digital

Página web de **Rodríguez Digital**: páginas web con chatbot de cotizaciones por WhatsApp para negocios en Panamá.

Es HTML, CSS y JavaScript puro (sin frameworks ni build), listo para desplegar en Vercel.

## Estructura

Diseño y código 100% propios: sin plantillas, sin jQuery y sin librerías de íconos.

```
├── index.html          Página única: inicio + secciones que se abren como ventana
├── favicon.svg
├── css/
│   ├── base.css        Variables de color, reset, tipografía y fondo
│   ├── components.css  Botones, íconos, formulario, chips, botón flotante
│   ├── home.css        Inicio: logo, título y menú en tarjetas
│   └── panel.css       Ventanas de cada sección (planes, FAQ, chat de ejemplo, tablas)
└── js/
    ├── config.js       ⚙️ Datos del negocio (WhatsApp, correo, mensajes)
    ├── paneles.js      Abre/cierra las secciones según el #ancla (Esc, clic fuera, botón atrás)
    ├── whatsapp.js     Arma los enlaces wa.me
    ├── formulario.js   Formulario de cotización → WhatsApp
    ├── contacto.js     Enlaces de correo y año del pie
    └── main.js         Punto de entrada: inicializa todo
```

Cada sección tiene su propia dirección: `/#servicios`, `/#planes`, `/#trabajos`, `/#contacto`, `/#privacidad`. Sirven para compartir un enlace directo (por ejemplo, mandarle `/#planes` a un cliente).

Los íconos son SVG propios definidos al inicio de `index.html` con `<symbol>` y se usan con `<svg class="ico"><use href="#i-nombre"/></svg>`.

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

## Licencias

- Diseño, código, íconos y textos: propios de Rodríguez Digital.
- Fuentes Space Grotesk e Inter (Google Fonts): SIL Open Font License 1.1 (no exige crédito visible).
- WhatsApp es marca de Meta; se menciona solo como canal de contacto.
