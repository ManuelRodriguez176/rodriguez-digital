// ============================================================
//  TEXTOS DEL BOT — cambia aquí lo que responde el bot
//  Límites de WhatsApp: título de fila 24 caracteres,
//  descripción 72, botón de respuesta 20.
// ============================================================

export const NEGOCIO = {
  nombre: "Rodríguez Digital",
  dueno: "Manuel",
  web: "https://rodriguez-digital.vercel.app",
  ejemplo: "https://soldadura-efrain-rodriguez.vercel.app",
};

export const BIENVENIDA =
  `¡Hola! 👋 Gracias por escribir a *${NEGOCIO.nombre}*.\n\n` +
  "Hacemos páginas web para negocios de Panamá, con un chatbot que te manda las cotizaciones a WhatsApp.\n\n" +
  "Elige una opción del menú 👇";

// Opciones del menú (lista interactiva)
export const MENU = [
  { id: "planes", title: "💰 Planes y precios", description: "Desde $150, pago en dos partes" },
  { id: "ejemplo", title: "👀 Ver un ejemplo", description: "Una página que ya hicimos" },
  { id: "como", title: "🛠️ Cómo funciona", description: "Los pasos, de la idea a tu página" },
  { id: "tiempo", title: "⏱️ Tiempo de entrega", description: "Cuánto tarda tu página" },
  { id: "cotizar", title: "📝 Cotizar mi página", description: "Cuéntanos de tu negocio" },
  { id: "humano", title: "🙋 Hablar con Manuel", description: "Te responde personalmente" },
];

export const RESPUESTAS = {
  planes:
    "*💰 Planes*\n\n" +
    "*Básica — $150 a $250* (pago único)\n" +
    "Página adaptada al celular con tus servicios, fotos, horario, mapa y botón de WhatsApp.\n\n" +
    "*Con chatbot — $300 a $450* (pago único) ⭐\n" +
    "Todo lo de la Básica + chatbot que pregunta lo necesario y te manda la cotización a tu WhatsApp.\n\n" +
    "*Mantenimiento — $15 a $30 al mes*\n" +
    "Página siempre en línea, dominio renovado y cambios pequeños.\n\n" +
    "Pagas 50% al empezar y 50% al entregar. El dominio (tunegocio.com) cuesta unos $10–15 al año y queda a tu nombre.",

  ejemplo:
    "*👀 Ejemplo real*\n\n" +
    "Taller de soldadura Servicios Efraín Rodríguez:\n" +
    `${NEGOCIO.ejemplo}\n\n` +
    "Prueba su chatbot: pide una cotización y mira cómo llega todo ordenado al WhatsApp del taller.\n\n" +
    `Y aquí está nuestra página: ${NEGOCIO.web}`,

  como:
    "*🛠️ Cómo funciona*\n\n" +
    "1️⃣ *Hablamos* de tu negocio y qué quieres mostrar.\n" +
    "2️⃣ *Nos mandas el material*: fotos, logo si tienes, servicios y horario.\n" +
    "3️⃣ *Te mostramos un avance* y pides los cambios.\n" +
    "4️⃣ *¡En línea!* Publicamos tu página y te enseñamos a recibir cotizaciones.",

  tiempo:
    "*⏱️ Tiempo de entrega*\n\n" +
    "• Básica: 3 a 5 días después de recibir tu material.\n" +
    "• Con chatbot: alrededor de una semana.",

  cotizar:
    "*📝 ¡Vamos a cotizar!*\n\n" +
    "Escríbeme en un solo mensaje:\n" +
    "• Tu nombre\n• Nombre y tipo de negocio\n• Qué te gustaría en tu página\n\n" +
    `Se lo paso a ${NEGOCIO.dueno} y te responde con el precio. 🙌`,

  humano:
    `*🙋 Listo*\n\nLe avisé a ${NEGOCIO.dueno}. Te va a responder por aquí lo antes posible.\n\n` +
    "Si quieres, escribe tu consulta mientras tanto.",
};

export const RECIBIDO =
  `✅ ¡Recibido! Le pasé tu mensaje a ${NEGOCIO.dueno} y te responde por aquí lo antes posible.\n\n` +
  "Mientras tanto, puedes ver el menú 👇";

export const NO_SOPORTADO =
  "Por ahora solo puedo leer mensajes de texto 🙏. Escríbeme lo que necesitas o elige una opción del menú.";

// Palabras que muestran el menú
export const PALABRAS_MENU = [
  "hola", "buenas", "buenos dias", "buenas tardes", "buenas noches",
  "menu", "inicio", "opciones", "info", "informacion", "hi", "hello",
];
