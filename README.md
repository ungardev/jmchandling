# JMC Handling — Astro Site

> Premium ground handling services website for **Servicios Especializados JMC, C.A.**, operating at Simón Bolívar de Maiquetía International Airport (CCS), Venezuela. Certified under INAC RAV 111 with CESEA-021.

**Live site:** https://jmchandling.vercel.app

---

## Tech Stack

- **Framework:** Astro 5 (static export, `output: 'static'`)
- **Styling:** Tailwind CSS 3 + custom CSS design system
- **Components:** Astro `.astro` components with static HTML-first interactions
- **Content model:** Typed service families and proof points in `src/data/siteContent.ts`
- **i18n:** Astro built-in routing with ES (default) + EN locales
- **Fonts:** Inter (UI) + JetBrains Mono (operational codes and metadata)
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
│   ├── contact/      QuoteForm, ContactInfo, FormStatus
│   └── ui/           Button, Badge, Card, Section
├── data/
│   └── siteContent.ts  Typed capability families and services
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
| `cargo-emerald` | `#5BA8C7` | CTA / action color and operational accent |
| `cargo-ink` | `#0A1F2B` | Body text on light |
| `cargo-mist` | `#F5F8FA` | Surface light |
| `cargo-white` | `#FFFFFF` | Inverse / dark text |

Tailwind classes: `bg-cargo-deep`, `text-cargo-emerald`, `border-cargo-light`, etc.

---

## i18n Conventions

- **Spanish (ES)** is the default locale — all new content starts in ES.
- Page titles, headings, body copy, buttons, form labels — both locales.
- Code, file names, class names, comments, config — English only.
- Keys use dot notation: `services.gseTitle`, `services.families.rampTitle`, `nav.home`.
- Arrays remain arrays; do not pass them through the string translation helper.
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

## Content and claims

The public catalog is generated from `src/data/siteContent.ts` and localized through `src/i18n/es.json` and `src/i18n/en.json`. Operational claims must be confirmed with JMC before publishing. In particular, keep the 2012 incorporation date separate from the 2015 Maiquetía operation date and do not publish unverified services, phone numbers, hours or response promises.

The previous `jmcground/` implementation is historical reference material only. It is not part of the Astro build.

---

## TODO Before Production

- [ ] Confirm public phone, hours, station scope and response expectation with operations
- [ ] Confirm 2012 incorporation vs. 2015 Maiquetía operation claims
- [ ] Set up `jmchandling.com` DNS / canonical domain when approved
- [ ] Add Vercel analytics / speed insights
- [ ] Add additional station pages only when operational content is validated
- [ ] Confirm social profiles and add approved social metadata
