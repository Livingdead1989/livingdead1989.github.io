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
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  const applyTheme = theme => {
    document.body.dataset.theme = theme;
    toggle.setAttribute('aria-pressed', theme === 'dark');
    localStorage.setItem('theme', theme);
  };

  toggle.addEventListener('click', () => {
    const nextTheme =
      document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) applyTheme(savedTheme);
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

  /* ✅ Close menu when a link is clicked */
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
   Init everything
========================= */

initSectionObserver();
initThemeToggle();
initMobileNav();
initScrollTopButton();
