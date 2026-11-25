/**
 * Paneles: secciones que se abren como ventana sobre el inicio.
 * Se controlan con el ancla de la URL (#servicios, #planes...),
 * así los enlaces se pueden compartir y el botón "atrás" funciona.
 */
const TRANSICION_MS = 400;

export function initPanels() {
  const layer = document.querySelector(".panel-layer");
  if (!layer) return;

  const panels = [...layer.querySelectorAll(".panel")];
  const home = document.querySelector(".home");
  let activo = null;
  let ultimoFoco = null;

  function abrir(panel) {
    if (activo === panel) return;
    if (activo) ocultar(activo, true);
    else ultimoFoco = document.activeElement;

    activo = panel;
    panel.hidden = false;
    document.body.classList.add("panel-open");
    home?.setAttribute("aria-hidden", "true");
    home?.setAttribute("inert", "");
    layer.scrollTop = 0;

    requestAnimationFrame(() => {
      // El navegador salta solo al #ancla; lo regresamos arriba para que se vea el borde y el botón ×
      layer.scrollTop = 0;
      requestAnimationFrame(() => {
        layer.scrollTop = 0;
        panel.classList.add("is-active");
      });
    });
    panel.focus({ preventScroll: true });
    document.title = `${panel.dataset.title} — Rodríguez Digital`;
  }

  function ocultar(panel, inmediato = false) {
    panel.classList.remove("is-active");
    if (inmediato) panel.hidden = true;
    else setTimeout(() => { if (activo !== panel) panel.hidden = true; }, TRANSICION_MS);
  }

  function cerrar() {
    if (!activo) return;
    const panel = activo;
    activo = null;
    ocultar(panel);
    document.body.classList.remove("panel-open");
    home?.removeAttribute("aria-hidden");
    home?.removeAttribute("inert");
    document.title = TITULO_INICIAL;
    ultimoFoco?.focus?.({ preventScroll: true });
  }

  // Quita el #ancla de la URL sin agregar un paso extra al historial
  function limpiarHash() {
    if (location.hash) history.pushState(null, "", location.pathname + location.search);
    cerrar();
  }

  function sincronizar() {
    const id = decodeURIComponent(location.hash.slice(1));
    const panel = id && document.getElementById(id);
    if (panel && panels.includes(panel)) abrir(panel);
    else if (id && panel && panels.some((p) => p.contains(panel))) {
      // Ancla interna (ej. #licencias): abre su panel y baja hasta ella
      abrir(panels.find((p) => p.contains(panel)));
      setTimeout(() => panel.scrollIntoView({ behavior: "smooth" }), TRANSICION_MS);
    } else cerrar();
  }

  const TITULO_INICIAL = document.title;

  // Cerrar: botón ×, clic fuera de la ventana o tecla Escape
  layer.addEventListener("click", (e) => {
    if (e.target.closest(".panel-close") || e.target === layer) limpiarHash();
  });

  document.addEventListener("keydown", (e) => {
    if (!activo) return;
    if (e.key === "Escape") limpiarHash();
    if (e.key === "Tab") atraparFoco(e, activo);
  });

  window.addEventListener("hashchange", sincronizar);
  window.addEventListener("popstate", sincronizar);
  sincronizar();
}

// Mantiene el Tab dentro del panel abierto (accesibilidad)
function atraparFoco(e, panel) {
  const focusables = panel.querySelectorAll(
    'a[href], button:not([disabled]), input, select, textarea, summary, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusables.length) return;
  const primero = focusables[0];
  const ultimo = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}
