import { waLink } from "./whatsapp.js";

/**
 * Formulario de cotización: no guarda nada, solo arma
 * el mensaje y abre WhatsApp.
 */
export function initQuoteForm(selector = "#quote") {
  const form = document.querySelector(selector);
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const datos = new FormData(form);

    let msg =
      `Hola, soy ${datos.get("nombre")}.\n` +
      `Negocio: ${datos.get("negocio")}\n` +
      `Plan: ${datos.get("plan")}`;
    if (datos.get("nota")) msg += `\nNota: ${datos.get("nota")}`;

    // location.href en vez de window.open: Safari en iPhone bloquea ventanas emergentes
    window.location.href = waLink(msg);
  });
}
