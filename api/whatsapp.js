// ============================================================
//  Webhook de WhatsApp — https://rodriguez-digital.vercel.app/api/whatsapp
//  GET  → Meta verifica el webhook (una sola vez, al configurarlo)
//  POST → Meta manda cada mensaje nuevo
// ============================================================
import { firmaValida } from "../lib/whatsapp/firma.js";
import { decidir } from "../lib/whatsapp/bot.js";
import { MENU } from "../lib/whatsapp/textos.js";
import { enviarTexto, enviarLista, enviarPlantilla, marcarLeido } from "../lib/whatsapp/cliente.js";

// IDs de mensajes ya atendidos (Meta a veces reenvía el mismo mensaje)
const atendidos = new Set();

export function GET(request) {
  const url = new URL(request.url);
  const modo = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const reto = url.searchParams.get("hub.challenge");

  if (modo === "subscribe" && token && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(reto, { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

export async function POST(request) {
  const crudo = await request.text();

  if (!firmaValida(crudo, request.headers.get("x-hub-signature-256"), process.env.WHATSAPP_APP_SECRET)) {
    return new Response("Firma inválida", { status: 401 });
  }

  let datos;
  try { datos = JSON.parse(crudo); } catch { return new Response("JSON inválido", { status: 400 }); }

  const tareas = [];
  for (const entry of datos.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value ?? {};
      const contactos = Object.fromEntries((value.contacts ?? []).map((c) => [c.wa_id, c.profile?.name ?? ""]));
      for (const msg of value.messages ?? []) {
        if (atendidos.has(msg.id)) continue;
        atendidos.add(msg.id);
        if (atendidos.size > 500) atendidos.delete(atendidos.values().next().value);
        tareas.push(atender(msg, contactos[msg.from] ?? ""));
      }
      // value.statuses (enviado/entregado/leído) se ignoran a propósito
    }
  }

  // Se responde 200 siempre que la firma sea válida, para que Meta no reintente
  const resultados = await Promise.allSettled(tareas);
  for (const r of resultados) if (r.status === "rejected") console.error("[whatsapp]", r.reason);
  return new Response("OK", { status: 200 });
}

async function atender(msg, nombre) {
  const cliente = msg.from;
  const dueno = process.env.OWNER_WHATSAPP;
  marcarLeido(msg.id).catch(() => {});

  for (const paso of decidir(msg, nombre)) {
    if (paso.accion === "texto") {
      await enviarTexto(cliente, paso.texto);
    } else if (paso.accion === "menu") {
      await enviarLista(cliente, paso.texto, "Ver opciones", MENU.map(({ id, title, description }) => ({ id, title, description })), "Rodríguez Digital");
    } else if (paso.accion === "avisar_dueno" && dueno && cliente !== dueno) {
      await avisarDueno(dueno, { cliente, nombre, motivo: paso.motivo, texto: paso.texto });
    }
  }
}

/**
 * Le avisa a Manuel de un cliente nuevo.
 * WhatsApp solo deja mandar texto libre si Manuel le escribió al bot en las últimas 24 h.
 * Si no, usa la plantilla aprobada OWNER_TEMPLATE (si está configurada).
 */
async function avisarDueno(dueno, { cliente, nombre, motivo, texto }) {
  const quien = nombre ? `${nombre} (+${cliente})` : `+${cliente}`;
  const aviso =
    `🔔 *${motivo}*\n👤 ${quien}\n` +
    (texto ? `💬 "${texto.slice(0, 900)}"\n` : "") +
    `\nResponder: https://wa.me/${cliente}`;

  try {
    await enviarTexto(dueno, aviso);
  } catch (error) {
    const plantilla = process.env.OWNER_TEMPLATE;
    if (!plantilla) throw error;
    // Plantilla con 2 variables: {{1}} = quién escribió, {{2}} = mensaje
    await enviarPlantilla(dueno, plantilla, [quien, (texto || motivo).slice(0, 900)], process.env.OWNER_TEMPLATE_LANG || "es");
  }
}
