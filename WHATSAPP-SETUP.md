# Bot de WhatsApp — guía de configuración

El bot ya está programado en este repo. Vive en
**`https://rodriguez-digital.vercel.app/api/whatsapp`** y se publica solo con cada `git push`.

Lo que falta es conectarlo con tu cuenta de Meta (una sola vez). Tiempo: unos 30–45 minutos.

---

## Qué hace el bot

| El cliente escribe… | El bot… |
|---|---|
| "Hola", "buenas", "menú"… | Lo saluda por su nombre y le muestra el menú |
| Elige una opción (o escribe "1"–"6", "precio", "cotizar") | Responde: planes, ejemplo, cómo funciona, tiempo de entrega, cotizar |
| "Hablar con Manuel" | Le confirma y **te avisa a tu WhatsApp personal** |
| Cualquier otro mensaje (su cotización, una pregunta) | Le confirma que lo recibiste y **te lo reenvía** con un enlace para responderle |
| Audio, foto, sticker | Le explica que solo lee texto |

Los textos se cambian en **`lib/whatsapp/textos.js`**.

---

## Paso 1 — Crear la app en Meta

1. Entra a **developers.facebook.com** → **Mis apps** → **Crear app**.
2. Caso de uso: **"Conectarse con clientes a través de WhatsApp"**.
3. Vincúlala a tu portafolio comercial (si no tienes, Meta te deja crear uno: ponle "Rodríguez Digital").

## Paso 2 — Probar con el número de prueba (gratis)

1. En la app: **WhatsApp → Configuración de la API**.
2. Meta te da un **número de prueba**. Copia el **Identificador del número de teléfono** (Phone number ID).
3. En **"Para"**, agrega tu WhatsApp personal (+507 6328-4986) y confírmalo con el código.
   > Con el número de prueba solo puedes escribirle a números que agregues aquí (máximo 5).

## Paso 3 — Token permanente

El token que aparece en la página de la API vence en 24 horas. Para uno permanente:

1. **business.facebook.com → Configuración → Usuarios → Usuarios del sistema → Agregar** (rol: Administrador).
2. **Asignar activos** → tu app → control total.
3. **Generar token** → elige tu app → permisos **`whatsapp_business_messaging`** y **`whatsapp_business_management`** → caducidad: **Nunca**.
4. Copia el token y guárdalo en un lugar seguro. **No lo pegues en GitHub ni en ningún chat.**

## Paso 4 — Clave secreta de la app

**developers.facebook.com → tu app → Configuración de la app → Básica → Clave secreta de la app → Mostrar.**

## Paso 5 — Variables en Vercel

**Vercel → proyecto rodriguez-digital → Settings → Environment Variables** (marca *Production*):

| Variable | Valor |
|---|---|
| `WHATSAPP_TOKEN` | El token permanente del paso 3 |
| `WHATSAPP_PHONE_NUMBER_ID` | El ID del número del paso 2 |
| `WHATSAPP_VERIFY_TOKEN` | Una palabra secreta que inventes tú (ej. `rd-bot-2026-xyz`) |
| `WHATSAPP_APP_SECRET` | La clave del paso 4 |
| `OWNER_WHATSAPP` | `50763284986` |

Después: **Deployments → los tres puntos del último → Redeploy**, para que tome las variables.

## Paso 6 — Conectar el webhook

1. En Meta: **WhatsApp → Configuración → Webhook → Editar**.
2. **URL de devolución de llamada:** `https://rodriguez-digital.vercel.app/api/whatsapp`
3. **Token de verificación:** la misma palabra de `WHATSAPP_VERIFY_TOKEN`.
4. **Verificar y guardar.**
5. En **Campos del webhook**, suscríbete a **`messages`**.

## Paso 7 — ¡Pruébalo!

Desde tu WhatsApp personal, escríbele **"hola"** al número de prueba. Debe responderte con el menú.

> Como tú eres el dueño, el bot no se manda avisos a sí mismo cuando le escribes desde tu número.
> Para probar los avisos, pídele a alguien (que hayas agregado en el paso 2) que le escriba.

---

## Paso 8 — Pasar a tu número real (cuando todo funcione)

1. **WhatsApp → Configuración de la API → Agregar número de teléfono.** Usa un chip aparte:
   el número que conectes a la API deja de funcionar en la app normal de WhatsApp
   (salvo que uses la opción de Meta para la app de WhatsApp Business + API a la vez).
2. Verifica por SMS o llamada y espera que aprueben el **nombre visible** ("Rodríguez Digital").
3. Cambia `WHATSAPP_PHONE_NUMBER_ID` en Vercel por el ID del número nuevo y haz Redeploy.
4. Agrega un **método de pago** en Meta (te cobra solo si pasas los mensajes gratis).

## Opcional — Avisos aunque no le hayas escrito al bot

WhatsApp solo deja que el bot te mande texto libre si **tú le escribiste al bot en las últimas 24 horas**.
Para recibir avisos siempre:

1. **WhatsApp → Plantillas de mensajes → Crear plantilla**
   - Categoría: **Utilidad** · Nombre: `aviso_cliente` · Idioma: **Español**
   - Cuerpo: `Nuevo cliente en Rodríguez Digital: {{1}} escribió: {{2}}`
2. Cuando la aprueben, agrega en Vercel: `OWNER_TEMPLATE` = `aviso_cliente` y Redeploy.

Truco gratis mientras tanto: mándale "hola" a tu bot una vez al día.

---

## Costos (noviembre de 2026)

- Meta cobra por mensaje entregado. Cada número tiene **1,000 mensajes de servicio gratis al mes**
  (respuestas dentro de las 24 h después de que el cliente escribe).
- Las plantillas (como `aviso_cliente`) se cobran según su categoría y país.
- Vercel: el plan Hobby alcanza para empezar; para uso comercial revisa sus condiciones.

Consulta siempre los precios actuales en la documentación de Meta: *WhatsApp Business Platform → Pricing*.

## Probar el código

```bash
npm test
```

Las pruebas simulan los mensajes de Meta; no mandan nada a WhatsApp.
