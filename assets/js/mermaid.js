/* =========================
   Mermaid theming helpers
========================= */

function getMermaidTheme() {
  const styles = getComputedStyle(document.documentElement);
  const v = name => styles.getPropertyValue(name).trim();

  const diagramTextOnSurface = v("--text");

  return {
    /* ======================================================
       Core
       ====================================================== */
    background: "transparent",
    fontFamily: v("--font-sans") || "trebuchet ms, verdana, arial",
    fontSize: "14px",

    primaryColor: v("--accent-dark"),
    primaryTextColor: v("--text"),
    primaryBorderColor: v("--border-soft"),

    secondaryColor: v("--accent-blue"),
    secondaryBorderColor: "color-mix(in oklab, " + v("--accent-blue") + " 30%, transparent)",
    secondaryTextColor: "color-mix(in oklab, " + v("--text") + " 90%, transparent)",

    tertiaryColor: v("--accent-live"),
    tertiaryBorderColor: "color-mix(in oklab, " + v("--accent-live") + " 55%, transparent)",
    tertiaryTextColor: "color-mix(in oklab, " + v("--text") + " 92%, transparent)",
    
    lineColor: v("--accent-muted"),
    textColor: v("--text"),

    nodeTextColor: diagramTextOnSurface,
    labelTextColor: diagramTextOnSurface,
    classText: diagramTextOnSurface,
    timelineTextColor: diagramTextOnSurface,
    
    /* ======================================================
       Severity Palette (theme-driven)
       ====================================================== */
    infoColor: v("--accent-blue"),
    successColor: v("--accent-green"),
    warningColor: v("--accent-amber"),
    dangerColor: v("--accent-red"),

    /* ======================================================
       Flowcharts / Graphs
       ====================================================== */
    clusterBkg: v("--accent-surface"),
    clusterBorder: v("--accent-border"),
    titleColor: v("--text"),
    edgeLabelBackground: v("--bg"),

    defaultLinkColor: v("--accent-muted"),

    /* ======================================================
       Sequence Diagrams
       ====================================================== */
    actorBkg: v("--accent-dark"),
    actorBorder: v("--border-soft"),
    actorTextColor: v("--text"),
    actorLineColor: v("--accent-muted"),

    /* Normal signals (info) */
    signalColor: v("--accent-blue"),
    signalTextColor: v("--text"),

    /* Activations (success) */
    activationBkgColor: v("--accent-green-soft"),
    activationBorderColor: v("--accent-green"),

    /* Labels / loops */
    labelBoxBkgColor: v("--accent-surface"),
    labelBoxBorderColor: v("--accent-border"),
    loopTextColor: v("--text"),

    /* Errors (danger) */
    errorBkgColor: v("--accent-red"),
    errorTextColor: v("--text"),

    /* ======================================================
       Notes (warnings by default)
       ====================================================== */
    noteBkgColor: v("--accent-surface"),
    noteBorderColor: v("--accent-border-warm"),
    noteTextColor: v("--text"),

    /* ======================================================
       Pie Charts (fully theme-driven)
       ====================================================== */
    pie1: v("--accent-blue"),
    pie2: v("--accent-green"),
    pie3: v("--accent-amber"),
    pie4: v("--accent-red"),
    pie5: v("--accent-purple"),
    pie6: v("--accent-slate"),

    pieTitleTextColor: v("--text"),
    pieSectionTextColor: v("--text"),
    pieLegendTextColor: v("--text-muted"),

    pieStrokeColor: v("--panel"),
    pieStrokeWidth: "1.5px",
    pieOuterStrokeColor: v("--panel"),
    pieOuterStrokeWidth: "1.5px",
    pieOpacity: "0.95",

    /* ======================================================
       State / Class Diagrams
       ====================================================== */
    labelColor: v("--text"),
    altBackground: v("--panel-soft"),
  };
}

/* =========================
   Mermaid core
========================= */

function configureMermaid(startOnLoad = false) {
  if (!window.mermaid) return;

  mermaid.initialize({
    startOnLoad,
    // securityLevel: 'loose',
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
