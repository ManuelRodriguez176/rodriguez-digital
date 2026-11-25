// Pruebas del bot: npm test   (no llama a WhatsApp de verdad, simula fetch)
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

process.env.WHATSAPP_TOKEN = "token-prueba";
process.env.WHATSAPP_PHONE_NUMBER_ID = "123";
process.env.WHATSAPP_VERIFY_TOKEN = "palabra-secreta";
process.env.WHATSAPP_APP_SECRET = "secreto-app";
process.env.OWNER_WHATSAPP = "50763284986";

const { GET, POST } = await import("../api/whatsapp.js");
const { decidir, normalizar } = await import("../lib/whatsapp/bot.js");
const { MENU } = await import("../lib/whatsapp/textos.js");

let enviados = [];
let fallarTextoA = null;
globalThis.fetch = async (url, opts) => {
  const body = JSON.parse(opts.body);
  enviados.push({ url, body });
  if (fallarTextoA && body.to === fallarTextoA && body.type === "text") {
    return new Response("fuera de las 24 h", { status: 400 });
  }
  return Response.json({ messages: [{ id: "wamid.out" }] });
};
beforeEach(() => { enviados = []; fallarTextoA = null; delete process.env.OWNER_TEMPLATE; });

let n = 0;
function webhook(msg, nombre = "Carlos Pérez") {
  const cuerpo = JSON.stringify({
    object: "whatsapp_business_account",
    entry: [{ changes: [{ field: "messages", value: {
      contacts: [{ wa_id: msg.from, profile: { name: nombre } }],
      messages: [{ id: `wamid.${++n}`, timestamp: "0", ...msg }],
    } }] }],
  });
  const firma = "sha256=" + createHmac("sha256", "secreto-app").update(cuerpo).digest("hex");
  return new Request("https://x/api/whatsapp", { method: "POST", body: cuerpo, headers: { "x-hub-signature-256": firma } });
}
const texto = (body, from = "50761112222") => ({ from, type: "text", text: { body } });
const sinLeidos = () => enviados.filter((e) => e.body.status !== "read");

test("GET: verifica el webhook con la palabra correcta", async () => {
  const ok = GET(new Request("https://x/api/whatsapp?hub.mode=subscribe&hub.verify_token=palabra-secreta&hub.challenge=777"));
  assert.equal(ok.status, 200);
  assert.equal(await ok.text(), "777");
  const mal = GET(new Request("https://x/api/whatsapp?hub.mode=subscribe&hub.verify_token=otra&hub.challenge=777"));
  assert.equal(mal.status, 403);
});

test("POST: rechaza mensajes sin firma válida de Meta", async () => {
  const r = await POST(new Request("https://x/api/whatsapp", { method: "POST", body: "{}", headers: { "x-hub-signature-256": "sha256=00" } }));
  assert.equal(r.status, 401);
  assert.equal(enviados.length, 0);
});

test("'Hola' responde con saludo personalizado y el menú", async () => {
  const r = await POST(webhook(texto("Hola!!")));
  assert.equal(r.status, 200);
  const [lista] = sinLeidos();
  assert.equal(lista.body.type, "interactive");
  assert.match(lista.body.interactive.body.text, /¡Hola, Carlos!/);
  assert.equal(lista.body.interactive.action.sections[0].rows.length, MENU.length);
  assert.ok(enviados.some((e) => e.body.status === "read"), "marca el mensaje como leído");
});

test("Elegir 'Planes' en la lista manda los precios y vuelve a mostrar el menú", async () => {
  await POST(webhook({ from: "50761112222", type: "interactive", interactive: { type: "list_reply", list_reply: { id: "planes", title: "Planes" } } }));
  const [precios, menu] = sinLeidos();
  assert.match(precios.body.text.body, /\$150/);
  assert.equal(menu.body.type, "interactive");
});

test("Atajos escritos: '1', 'precio', 'Cotizar'", () => {
  assert.match(decidir(texto("1"))[0].texto, /Planes/);
  assert.match(decidir(texto("¿Precio?"))[0].texto, /Planes/);
  const cot = decidir(texto("Cotizar"));
  assert.match(cot[0].texto, /cotizar/i);
  assert.equal(cot.length, 1, "después de cotizar no manda menú, espera los datos");
});

test("Un mensaje libre se le reenvía a Manuel con enlace para responder", async () => {
  await POST(webhook(texto("Soy Ana, tengo una barbería en Arraiján y quiero una página")));
  const aviso = sinLeidos().find((e) => e.body.to === "50763284986");
  assert.ok(aviso, "le llega aviso a Manuel");
  assert.match(aviso.body.text.body, /barbería en Arraiján/);
  assert.match(aviso.body.text.body, /wa\.me\/50761112222/);
  const alCliente = sinLeidos().find((e) => e.body.to === "50761112222");
  assert.match(alCliente.body.interactive.body.text, /Recibido/);
});

test("'Hablar con Manuel' avisa al dueño", async () => {
  await POST(webhook({ from: "50761112222", type: "interactive", interactive: { type: "list_reply", list_reply: { id: "humano" } } }));
  const aviso = sinLeidos().find((e) => e.body.to === "50763284986");
  assert.match(aviso.body.text.body, /Quiere hablar contigo/);
});

test("Si el texto libre a Manuel falla (fuera de 24 h), usa la plantilla", async () => {
  process.env.OWNER_TEMPLATE = "aviso_cliente";
  fallarTextoA = "50763284986";
  await POST(webhook(texto("Necesito una página para mi fonda")));
  const plantilla = sinLeidos().find((e) => e.body.type === "template");
  assert.equal(plantilla.body.template.name, "aviso_cliente");
  assert.equal(plantilla.body.template.components[0].parameters.length, 2);
});

test("Mensajes de Manuel a su propio bot no generan avisos", async () => {
  await POST(webhook(texto("prueba de mensaje libre", "50763284986")));
  assert.equal(sinLeidos().filter((e) => e.body.type === "text").length, 0);
});

test("Audios o fotos: explica que solo lee texto", async () => {
  await POST(webhook({ from: "50761112222", type: "audio", audio: { id: "1" } }));
  assert.match(sinLeidos()[0].body.text.body, /solo puedo leer mensajes de texto/);
});

test("No responde dos veces al mismo mensaje reenviado por Meta", async () => {
  const msg = { id: "wamid.repetido", ...texto("hola") };
  const cuerpo = JSON.stringify({ entry: [{ changes: [{ value: { messages: [msg] } }] }] });
  const firma = "sha256=" + createHmac("sha256", "secreto-app").update(cuerpo).digest("hex");
  const req = () => new Request("https://x", { method: "POST", body: cuerpo, headers: { "x-hub-signature-256": firma } });
  await POST(req()); await POST(req());
  assert.equal(sinLeidos().length, 1);
});

test("Límites de WhatsApp en el menú (título 24, descripción 72, máx. 10 filas)", () => {
  assert.ok(MENU.length <= 10);
  for (const f of MENU) {
    assert.ok([...f.title].length <= 24, `título largo: ${f.title}`);
    assert.ok([...f.description].length <= 72, `descripción larga: ${f.description}`);
  }
});

test("normalizar quita tildes y signos", () => {
  assert.equal(normalizar("¡Buenos Días!"), "buenos dias");
});
