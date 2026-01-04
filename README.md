# NetworkingDream

**NetworkingDream** is a personal knowledge hub focused on networking, infrastructure, systems engineering, and thoughtful experimentation.  
It blends technical writing, practical projects, and a carefully designed interface that prioritises clarity, motion restraint, and accessibility.

🌐 **Live site:** https://networkingdream.com/

---

## ✨ Features

- **Custom theme system**
  - Dark theme by default
  - Opt-in light theme
  - Centralised design tokens via `theme.css`

- **Modern, minimal UI**
  - Subtle motion and hover effects
  - Accent-driven visual hierarchy
  - Responsive layouts for desktop and mobile

- **SVG-first branding**
  - Custom logo built with inline SVG
  - CSS-driven theming via design tokens
  - iOS-safe animation handling

- **Content-focused**
  - Blog posts
  - Projects and experiments
  - Status and utility links

- **Accessibility-aware**
  - Reduced motion support
  - Semantic HTML
  - ARIA where appropriate

---

## 🧱 Tech Stack

- **Static site generator:** Jekyll  
- **Hosting:** GitHub Pages  
- **Styling:** Vanilla CSS with CSS custom properties  
- **Icons:** SVG  
- **No frameworks** — intentionally lightweight and dependency-free

---

## 🎨 Design Philosophy

- Calm over flashy  
- Motion with intent, not noise  
- Dark-first, but light-friendly  
- Visual consistency via tokens, not overrides  

Design tokens are centralised in `theme.css` and shared across navigation, cards, buttons, logo/icons, and code blocks.

---

## 🖼 Logo & Branding

The NetworkingDream logo is a custom SVG designed to:

- Scale cleanly from favicon to hero
- Inherit site colours via CSS variables

Variants include:
- Primary inline SVG
- Favicon
- Apple touch icon
- Safari pinned tab mask icon

---

## 📁 Repository Structure (high level)

├── _includes/        # Shared partials (nav, footer, icons)  
├── _layouts/         # Page layouts  
├── assets/  
│   ├── css/  
│   │   └── theme.css # Global design tokens  
│   ├── icons/  
│   └── images/  
├── blog/  
├── projects/  
└── index.html  

---

## 🚀 Local Development

bundle install  
bundle exec jekyll serve  

Then open:  
http://localhost:4000/

---

## 📱 Browser Support Notes

- Fully supported on modern desktop browsers
- iOS Safari quirks handled explicitly (SVG animation & shadows)
- Reduced-motion respected via `prefers-reduced-motion`

---

## 📌 Status

This site is a **living project** — content, design, and structure evolve over time as ideas mature.

---

## 📄 License

Content © NetworkingDream  
Code is provided for educational and personal reference.

---

If you find something useful here, feel free to explore, adapt ideas, and experiment responsibly.
