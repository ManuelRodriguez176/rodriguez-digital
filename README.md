# Rodríguez Digital

Página web de **Rodríguez Digital**: páginas web con chatbot de cotizaciones por WhatsApp para negocios en Panamá.

Es HTML, CSS y JavaScript puro (sin frameworks ni build), listo para desplegar en Vercel.

## Estructura

```
├── index.html          Página de inicio
├── privacidad.html     Política de privacidad y licencias
├── css/
│   ├── base.css        Variables de color, reset y tipografía
│   ├── components.css  Botones, navegación, formulario, footer, botón flotante
│   ├── sections.css    Secciones del inicio (hero, planes, pasos, FAQ, contacto)
│   └── legal.css       Estilos de la página de privacidad
└── js/
    ├── config.js       ⚙️ Datos del negocio (WhatsApp, correo, mensajes)
    ├── whatsapp.js     Arma los enlaces wa.me
    ├── formulario.js   Formulario de cotización → WhatsApp
    ├── contacto.js     Enlaces de correo y año del footer
    └── main.js         Punto de entrada: inicializa todo
```

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

El sitio no tiene base de datos ni guarda formularios: los mensajes se arman en el navegador y se abren en WhatsApp. Ver `privacidad.html`.

## Licencias

- Fuentes Space Grotesk e Inter: SIL Open Font License 1.1 (Google Fonts).
- El logo de WhatsApp es marca de Meta; se usa solo para indicar el canal de contacto.
