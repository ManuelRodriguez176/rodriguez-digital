import {
  BIENVENIDA, MENU, RESPUESTAS, RECIBIDO, NO_SOPORTADO, PALABRAS_MENU,
} from "./textos.js";

/** Quita tildes, signos y mayúsculas para comparar palabras */
export function normalizar(texto = "") {
  return texto
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const IDS_MENU = new Set(MENU.map((m) => m.id));

// Atajos: el cliente puede escribir "1", "planes", "precio", etc.
const ATAJOS = {
  1: "planes", 2: "ejemplo", 3: "como", 4: "tiempo", 5: "cotizar", 6: "humano",
  planes: "planes", plan: "planes", precio: "planes", precios: "planes", costo: "planes", cuanto: "planes",
  ejemplo: "ejemplo", ejemplos: "ejemplo", portafolio: "ejemplo",
  cotizar: "cotizar", cotizacion: "cotizar",
  manuel: "humano", humano: "humano", persona: "humano", asesor: "humano",
};

/** Saca el texto o el id de la opción elegida del mensaje que llega de WhatsApp */
export function leerMensaje(msg) {
  if (msg.type === "text") return { tipo: "texto", valor: msg.text?.body ?? "" };
  if (msg.type === "interactive") {
    const r = msg.interactive?.list_reply ?? msg.interactive?.button_reply;
    return { tipo: "opcion", valor: r?.id ?? "" };
  }
  if (msg.type === "button") return { tipo: "opcion", valor: msg.button?.payload ?? "" };
  return { tipo: "otro", valor: msg.type };
}

/**
 * Decide qué hacer con un mensaje. Es una función pura (no envía nada):
 * devuelve una lista de acciones para que el webhook las ejecute.
 *
 * Acciones:
 *  { accion: "texto", texto }
 *  { accion: "menu", texto }
 *  { accion: "avisar_dueno", motivo, texto }
 */
export function decidir(msg, nombreContacto = "") {
  const { tipo, valor } = leerMensaje(msg);

  if (tipo === "otro") {
    return [{ accion: "texto", texto: NO_SOPORTADO }, { accion: "menu", texto: "¿En qué te ayudo?" }];
  }

  let opcion = null;
  if (tipo === "opcion" && IDS_MENU.has(valor)) opcion = valor;

  if (tipo === "texto") {
    const t = normalizar(valor);
    if (!t || PALABRAS_MENU.includes(t)) {
      return [{ accion: "menu", texto: saludo(nombreContacto) }];
    }
    // Una sola palabra o número que sea un atajo
    if (ATAJOS[t]) opcion = ATAJOS[t];
  }

  if (opcion === "humano") {
    return [
      { accion: "texto", texto: RESPUESTAS.humano },
      { accion: "avisar_dueno", motivo: "Quiere hablar contigo", texto: "" },
    ];
  }

  if (opcion) {
    return [
      { accion: "texto", texto: RESPUESTAS[opcion] },
      ...(opcion === "cotizar" ? [] : [{ accion: "menu", texto: "¿Algo más? 👇" }]),
    ];
  }

  // Cualquier otro texto: es una consulta o una cotización → se le pasa a Manuel
  return [
    { accion: "avisar_dueno", motivo: "Mensaje nuevo", texto: valor },
    { accion: "menu", texto: RECIBIDO },
  ];
}

function saludo(nombre) {
  const primerNombre = nombre?.split(" ")[0];
  return primerNombre ? BIENVENIDA.replace("¡Hola!", `¡Hola, ${primerNombre}!`) : BIENVENIDA;
}
