import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Comprueba que el mensaje viene de Meta (cabecera X-Hub-Signature-256).
 * Evita que cualquiera llame al webhook haciéndose pasar por WhatsApp.
 */
export function firmaValida(cuerpoCrudo, cabecera, secreto) {
  if (!secreto || !cabecera?.startsWith("sha256=")) return false;
  const esperada = createHmac("sha256", secreto).update(cuerpoCrudo, "utf8").digest("hex");
  const recibida = cabecera.slice("sha256=".length);
  if (recibida.length !== esperada.length) return false;
  return timingSafeEqual(Buffer.from(recibida, "hex"), Buffer.from(esperada, "hex"));
}
