import { CONFIG } from "./config.js";

/** Arma un enlace wa.me con el mensaje ya escrito. */
export function waLink(texto) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;
}

/**
 * Conecta todos los elementos con la clase .js-wa.
 * Si tienen data-plan, el mensaje menciona ese plan.
 */
export function initWhatsAppLinks(root = document) {
  root.querySelectorAll(".js-wa").forEach((el) => {
    const plan = el.dataset.plan;
    el.href = waLink(plan ? CONFIG.mensajes.plan(plan) : CONFIG.mensajes.general);
    el.target = "_blank";
    el.rel = "noopener";
  });
}
