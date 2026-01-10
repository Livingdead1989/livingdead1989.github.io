/* =========================
   Section visibility + nav
========================= */

function initSectionObserver() {
  const sections = document.querySelectorAll('section');
  const navLinks = [...document.querySelectorAll('nav a')];

  if (!sections.length || !navLinks.length) return;

  const linkMap = new Map(
    navLinks.map(link => [link.getAttribute('href'), link])
  );

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('visible');

        const activeLink = linkMap.get(`#${entry.target.id}`);
        navLinks.forEach(link =>
          link.toggleAttribute('aria-current', link === activeLink)
        );
      });
    },
    { threshold: 0.25 }
  );

  sections.forEach(section => observer.observe(section));
}

/* =========================
   Theme toggle
========================= */

function initThemeToggle() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  const root = document.documentElement;

  const applyTheme = theme => {
    const root = document.documentElement;

    // Enable transitions for this change only
    root.classList.add("theme-transition");

    root.dataset.theme = theme;
    localStorage.setItem("theme", theme);

    document.dispatchEvent(
      new CustomEvent("theme:changed", { detail: theme })
    );

    // Remove transition class after animation window
    window.setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 500);
  };

  // Restore persisted theme (fallback once)
  const savedTheme = localStorage.getItem("theme") || "dark";
  applyTheme(savedTheme);

  toggle.addEventListener("click", () => {
    const next =
      root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
  });
}




/* =========================
   Mobile navigation
========================= */

function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-links');

  if (!toggle || !menu) return;

  const focusableSelectors = `
    a[href],
    button:not([disabled]),
    [tabindex]:not([tabindex="-1"])
  `;

  let lastFocusedElement = null;

  function openMenu() {
    lastFocusedElement = document.activeElement;

    menu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');

    document.addEventListener('keydown', handleKeydown);

    const focusables = menu.querySelectorAll(focusableSelectors);
    if (focusables.length) {
      focusables[0].focus();
    }
  }

  function closeMenu() {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');

    document.removeEventListener('keydown', handleKeydown);

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      closeMenu();
      return;
    }

    if (e.key !== 'Tab') return;

    const focusables = menu.querySelectorAll(focusableSelectors);
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  /* Close menu when a link is clicked */
  menu.addEventListener('click', e => {
    if (e.target.tagName === 'A') {
      closeMenu();
    }
  });
}

/* =========================
   Scroll-to-top button
========================= */

function initScrollTopButton() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const ring = btn.querySelector('.progress-ring__progress');
  const radius = 18;
  const circumference = 2 * Math.PI * radius;

  function update() {
    const scrollY = window.scrollY;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

    if (ring) {
      ring.style.strokeDasharray = circumference;
      ring.style.strokeDashoffset =
        circumference - progress * circumference;
    }

    btn.classList.toggle('is-visible', progress > 0.35);
  }

  window.addEventListener('scroll', update, { passive: true });
  update();

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  });
}


/* =========================
   Code Blocks
========================= */

function initCodeBlocks() {
  const pres = document.querySelectorAll('.post-content pre');
  if (!pres.length) return;

  pres.forEach(pre => {
    // Prevent double-processing
    if (pre.dataset.enhanced === 'true') return;
    pre.dataset.enhanced = 'true';

    const code = pre.querySelector('code');

    /* =========================
       Copy button
    ========================= */

    if (code && navigator.clipboard) {
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-button';
      copyBtn.type = 'button';
      copyBtn.textContent = 'Copy';

      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(code.textContent);
          copyBtn.textContent = 'Copied';
          copyBtn.classList.add('copied');

          setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.classList.remove('copied');
          }, 1600);
        } catch {
          copyBtn.textContent = 'Error';
        }
      });

      pre.appendChild(copyBtn);
    }

    /* =========================
       Language detection
    ========================= */

    if (!pre.dataset.lang) {
      let parent = pre.parentElement;

      while (parent && parent !== document.body) {
        const langClass = [...parent.classList].find(c =>
          c.startsWith('language-')
        );
        if (langClass) {
          pre.dataset.lang = langClass.replace('language-', '');
          break;
        }
        parent = parent.parentElement;
      }
    }

    /* =========================
       Auto-collapse long blocks
    ========================= */

    const maxHeight = 352; // ~22rem
    if (pre.scrollHeight > maxHeight) {
      pre.classList.add('is-collapsed');

      const toggle = document.createElement('button');
      toggle.className = 'code-toggle';
      toggle.type = 'button';
      toggle.textContent = 'Show more';

      toggle.addEventListener('click', () => {
        const expanded = pre.classList.toggle('is-expanded');
        pre.classList.toggle('is-collapsed', !expanded);
        toggle.textContent = expanded ? 'Show less' : 'Show more';
      });

      pre.appendChild(toggle);
    }
  });
}

/* =========================
     Table of Contents (TOC)
  ========================= */

function initTOC() {
  const tocContainer = document.querySelector(".toc-container");
  const tocHeader = tocContainer?.querySelector(".toc-header");
  const toc = document.querySelector("ul.toc");

  /* =========================
     TOC container toggle
  ========================= */

  if (tocContainer && tocHeader) {
    tocHeader.addEventListener("click", e => {
      // Only block clicks on actual links (not icons / spans)
      if (e.target.closest("a")) return;

      const isOpen = tocContainer.classList.toggle("is-open");
      tocHeader.setAttribute("aria-expanded", String(isOpen));
    });
  }

  if (!toc) return;

  /* =========================
     Nested section toggles
  ========================= */

  const tocItems = toc.querySelectorAll("li");

  tocItems.forEach(li => {
    if (li.dataset.tocInit === "true") return;
    li.dataset.tocInit = "true";

    const nested = li.querySelector(":scope > ul");
    if (!nested) return;

    const button = document.createElement("button");
    button.className = "toc-toggle";
    button.type = "button";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Toggle subsections");

    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 24 24"
           fill="none"
           stroke="currentColor"
           stroke-width="2"
           stroke-linecap="round"
           stroke-linejoin="round"
           class="toc-icon"
           aria-hidden="true">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    `;

    const link = li.querySelector(":scope > a");
    link?.after(button);

    button.addEventListener("click", e => {
      e.preventDefault();

      const isExpanded = li.classList.contains("is-expanded");
      const parentList = li.parentElement;

      // Collapse siblings
      parentList
        .querySelectorAll(":scope > li.is-expanded")
        .forEach(item => {
          if (item !== li) {
            item.classList.remove("is-expanded");
            item.querySelector(".toc-toggle")
              ?.setAttribute("aria-expanded", "false");
          }
        });

      // Toggle current
      li.classList.toggle("is-expanded", !isExpanded);
      button.setAttribute("aria-expanded", String(!isExpanded));
    });
  });

  /* =========================
     Auto-expand active hash
  ========================= */

  const currentHash = decodeURIComponent(location.hash);
  if (!currentHash) return;

  const activeLink = toc.querySelector(`a[href="${currentHash}"]`);
  if (!activeLink) return;

  let currentLi = activeLink.closest("li");

  while (currentLi && currentLi.closest("ul.toc")) {
    currentLi.classList.add("is-expanded");
    currentLi.querySelector(".toc-toggle")
      ?.setAttribute("aria-expanded", "true");

    currentLi = currentLi.parentElement.closest("li");
  }
}


/* =========================
   Init everything
========================= */

document.addEventListener("DOMContentLoaded", () => {
  initSectionObserver();
  initThemeToggle();
  initMobileNav();
  initScrollTopButton();
  initCodeBlocks();
  initTOC();
});

