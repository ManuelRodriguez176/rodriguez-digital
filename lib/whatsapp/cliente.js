// Cliente mínimo de la WhatsApp Cloud API (sin dependencias)

const VERSION = () => process.env.GRAPH_VERSION || "v23.0";

async function enviar(cuerpo) {
  const { WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = process.env;
  const url = `https://graph.facebook.com/${VERSION()}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messaging_product: "whatsapp", ...cuerpo }),
  });

  if (!res.ok) {
    const detalle = await res.text();
    const error = new Error(`WhatsApp API ${res.status}: ${detalle}`);
    error.status = res.status;
    throw error;
  }
  return res.json();
}

export const enviarTexto = (to, texto) =>
  enviar({ to, type: "text", text: { body: texto, preview_url: true } });

export const enviarLista = (to, texto, boton, filas, tituloSeccion = "Opciones") =>
  enviar({
    to,
    type: "interactive",
    interactive: {
      type: "list",
      body: { text: texto },
      action: {
        button: boton,
        sections: [{ title: tituloSeccion, rows: filas }],
      },
    },
  });

export const enviarPlantilla = (to, nombre, parametros = [], idioma = "es") =>
  enviar({
    to,
    type: "template",
    template: {
      name: nombre,
      language: { code: idioma },
      components: parametros.length
        ? [{ type: "body", parameters: parametros.map((text) => ({ type: "text", text })) }]
        : [],
    },
  });

export const marcarLeido = (messageId) =>
  enviar({ status: "read", message_id: messageId });
