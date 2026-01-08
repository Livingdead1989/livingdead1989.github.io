/* =========================
   Mermaid theming helpers
========================= */

function getMermaidTheme() {
  const styles = getComputedStyle(document.documentElement);

  return {
    background: "transparent",

    /* Core nodes */
    primaryColor: styles.getPropertyValue("--panel").trim(),
    primaryTextColor: styles.getPropertyValue("--text").trim(),
    primaryBorderColor: styles
      .getPropertyValue("--accent-border-strong")
      .trim(),

    /* Secondary nodes */
    secondaryColor: styles.getPropertyValue("--panel-soft").trim(),
    secondaryTextColor: styles.getPropertyValue("--text").trim(),

    /* Subgraphs */
    clusterBkg: styles.getPropertyValue("--bg").trim(),
    clusterBorder: styles.getPropertyValue("--border-soft").trim(),

    /* Lines & labels */
    lineColor: styles.getPropertyValue("--accent-muted").trim(),
    labelTextColor: styles.getPropertyValue("--text-muted").trim(),

    /* Typography */
    fontFamily: styles.getPropertyValue("--font-sans").trim(),
    fontSize: "14px"
  };
}


/* =========================
   Mermaid core
========================= */

function configureMermaid(startOnLoad = false) {
  if (!window.mermaid) return;

  mermaid.initialize({
    startOnLoad,
    theme: "base",
    themeVariables: getMermaidTheme()
  });
}


function renderMermaid() {
  if (!window.mermaid) return;

  document.querySelectorAll(".mermaid").forEach(el => {
    // Preserve original source exactly once
    if (!el.dataset.source) {
      el.dataset.source = el.textContent.trim();
    }

    if (!el.dataset.source) return;

    el.removeAttribute("data-processed");
    el.innerHTML = el.dataset.source;
  });

  try {
    mermaid.run();
  } catch (err) {
    console.error("[Mermaid] render failed:", err);
  }
}


/* =========================
   Init + lifecycle
========================= */

function initMermaid() {
  if (!window.mermaid) return;

  configureMermaid(true);
}


/* =========================
   Theme change handling
========================= */

document.addEventListener("theme:changed", () => {
  if (!window.mermaid) return;

  // Optional visual smoothing hook
  document.documentElement.classList.add("theme-transition");

  configureMermaid(false);
  renderMermaid();

  setTimeout(() => {
    document.documentElement.classList.remove("theme-transition");
  }, 400);
});


/* =========================
   DOM ready
========================= */

document.addEventListener("DOMContentLoaded", initMermaid);
