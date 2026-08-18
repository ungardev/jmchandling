# JMC Handling — Astro Site

> Premium ground handling services website for **Servicios Especializados JMC, C.A.**, operating at Simón Bolívar de Maiquetía International Airport (CCS), Venezuela. Certified under INAC RAV 111 with CESEA-021.

**Live site:** https://jmchandling.vercel.app

---

## Tech Stack

- **Framework:** Astro 5 (static export, `output: 'static'`)
- **Styling:** Tailwind CSS 3 + custom CSS design system
- **Components:** Astro `.astro` + React islands (`AWBTracker.jsx`)
- **i18n:** Astro built-in routing with ES (default) + EN locales
- **Fonts:** Inter (UI) + JetBrains Mono (AWB numbers)
- **Forms:** FormSubmit.co (no backend required)
- **Deployment:** Vercel (recommended) / HostGator FTP (static upload)

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev          # http://localhost:4321

# Type check
npm run check        # astro check — 0 errors expected

# Lint
npm run lint

# Format
npm run format

# Build for production
npm run build        # outputs to dist/

# Preview production build
npm run preview

# Optimize legacy assets (logos + images → WebP)
npm run optimize:assets
```

---

## Project Structure

```
src/
├── components/
│   ├── global/       Header, Footer, LangToggle
│   ├── home/         Hero, ServicesGrid, SafetySection, StatsStrip
│   ├── services/     ServiceDetail
│   ├── contact/      QuoteForm, ContactInfo
│   └── ui/           Button, Badge, Card, Section, AWBTracker.jsx
├── i18n/
│   ├── es.json       Spanish UI copy (primary)
│   ├── en.json       English UI copy (secondary)
│   └── utils.ts      i18n helpers
├── layouts/          Layout.astro (SEO, OG, JSON-LD schema)
├── pages/
│   ├── index.astro   Language redirect
│   ├── es/           index, servicios, contacto, cotizacion
│   └── en/           index, services, contact, quote
└── styles/
    └── global.css    Tailwind directives + CSS variables
```

---

## Brand Tokens

| Token | Hex | Usage |
|---|---|---|
| `cargo-deep` | `#0F3E51` | Primary brand, hero background |
| `cargo-light` | `#A0DDF5` | Light accent, mint-blue |
| `cargo-emerald` | `#10B981` | CTA / action color |
| `cargo-ink` | `#0A1F2B` | Body text on light |
| `cargo-mist` | `#F5F8FA` | Surface light |
| `cargo-white` | `#FFFFFF` | Inverse / dark text |

Tailwind classes: `bg-cargo-deep`, `text-cargo-emerald`, `border-cargo-light`, etc.

---

## i18n Conventions

- **Spanish (ES)** is the default locale — all new content starts in ES.
- Page titles, headings, body copy, buttons, form labels — both locales.
- Code, file names, class names, comments, config — English only.
- Keys use dot notation: `services.gseTitle`, `awb.tracking`, `nav.home`.
- To add a new key: add it to **both** `es.json` and `en.json`.

---

## Asset Optimization

```bash
npm run optimize:assets
```

Reads from `LOGOS/` and `jmcground/image/`, writes WebP variants to `public/assets/brand/` and `public/assets/images/`.

Requirements: `sharp` (installed with `npm install`).

---

## Deployment

### Vercel (Recommended — Immediate)

1. Push to GitHub.
2. Connect repo to Vercel (`vercel.com`).
3. Deploy — Astro static export works out of the box.

### HostGator Mexico (Post-October)

1. Run `npm run build`.
2. Upload entire `dist/` folder via cPanel File Manager or FTP to `public_html/`.
3. Ensure `index.html` is at the root of `public_html/`.

See `DEPLOYMENT.md` for detailed steps.

---

## Contact Form

Form submits via **FormSubmit.co** to:
- Primary: `carlos.wood@jmchandling.com`
- CC: `jose.moncada@jmchandling.com`

No backend required. FormSubmit.co auto-responds and forwards.

---

## AWB Tracking (Demo)

The `AWBTracker.jsx` island validates 11-digit AWB format (`000-12345678`) and shows a simulated tracking response. To connect a live API, replace the `await new Promise(...)` timeout in `handleSubmit` with a real `fetch()` call. Integration point is documented inline in the component.

---

## TODO Before Production

- [ ] Replace placeholder phone `+58 212 000 0000` with real numbers
- [ ] Verify stats KPIs (years, daily flights, staff counts)
- [ ] Add Vercel analytics / speed insights
- [ ] Set up `jmchandling.com` DNS / Cloudflare
- [ ] Connect live AWB tracking API (integration point documented in `AWBTracker.jsx`)
- [ ] Add additional station pages as they open
- [ ] Add Instagram/LinkedIn social meta tags
