import { CONFIG } from "./config.js";

/** Rellena los enlaces de correo marcados con .js-email */
export function initEmailLinks(root = document) {
  root.querySelectorAll(".js-email").forEach((el) => {
    el.href = `mailto:${CONFIG.correo}`;
    if (!el.dataset.keepText) el.textContent = CONFIG.correo;
  });
}

/** Pone el año actual en los elementos .js-year */
export function initYear(root = document) {
  root.querySelectorAll(".js-year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}
