# AGENTS.md — JMC Handling Site Conventions

This file documents conventions and constraints for any AI agent working on this codebase.
Last updated: 2026-08-19

---

## Brand Tokens

All design decisions MUST use these tokens. Never hardcode hex values.

| Token | Hex | Usage |
|---|---|---|
| `cargo-deep` | `#0F3E51` | Primary brand, hero background, nav glass |
| `cargo-light` | `#A0DDF5` | Light accent, mint-blue |
| `cargo-emerald` | `#5BA8C7` | CTAs, action color, badges (brandboard aqua, WCAG AA on deep) |
| `cargo-ink` | `#0A1F2B` | Body text on light surfaces |
| `cargo-mist` | `#F5F8FA` | Light surface backgrounds |
| `cargo-white` | `#FFFFFF` | Inverse text |

Tailwind classes: `bg-cargo-deep`, `text-cargo-emerald`, `border-cargo-light`, etc.

---

## Typography

- UI font: **Inter** (weights 300–800). Loaded via Google Fonts in `Layout.astro`.
- Mono font: **JetBrains Mono** (AWB numbers). Same loading strategy.
- DO NOT use Poppins, Roboto, or any other font unless explicitly approved.
- Font scale: `text-xs` (12px) · `text-sm` (14px) · `text-base` (16px) · `text-lg` (18px) · `text-xl` (20px) · `text-2xl`–`text-6xl`

---

## i18n Rules

### Dictionary files
- `src/i18n/es.json` — Spanish (default locale, PRIMARY)
- `src/i18n/en.json` — English (secondary locale)
- Both files MUST have identical key trees. Never add a key to only one file.

### Key naming
Dot-notation, lowercase: `services.gseTitle`, `awb.track`, `nav.home`

Top-level namespaces: `nav`, `utilityBar`, `hero`, `stats`, `services`, `safety`, `awb`, `quote`, `contact`, `footer`, `form`, `common`, `meta`

### Translation function
```ts
import { useTranslations } from '../i18n/utils';
const t = useTranslations('es' | 'en');
t('services.gseTitle'); // returns string
```

### Adding new copy
1. Add key to BOTH `es.json` AND `en.json`
2. If adding a new page section, add meta keys to `meta.homeTitle`, `meta.homeDesc`, etc.
3. Do NOT hardcode Spanish or English strings in Astro components — always use `t()`.

### Locale routing
- Default route prefix: `/es/` (Spanish)
- Secondary: `/en/`
- Root `/` redirects to `/es/` via Accept-Language detection
- `switchLocalePath(path, target)` in `utils.ts` swaps the locale prefix

---

## Component Conventions

### File naming
- Astro components: `PascalCase.astro` (e.g. `ServiceDetail.astro`)
- React islands: `PascalCase.jsx` (e.g. `AWBTracker.jsx`)
- UI primitives: `PascalCase.astro` (e.g. `Button.astro`)

### Props typing
Every Astro component MUST export an `interface Props` and destructure from `Astro.props`:

```astro
---
import type { Locale } from '../../i18n/utils';

export interface Props {
  locale: Locale;
  variant?: 'primary' | 'secondary';
  class?: string;
}

const { locale, variant = 'primary', class: className = '' } = Astro.props;
---
```

### HTML lang attribute
Layout sets `<html lang={locale}>` automatically. Pages pass `locale` to Layout.

---

## CSS / Tailwind Conventions

### Custom utility classes (defined in `src/styles/global.css`)
- `.glass` — glassmorphism panel (blur + translucent white border)
- `.glass-dark` — dark glass variant for nav
- `.text-gradient-emerald` — emerald→light gradient text
- `.btn-primary`, `.btn-secondary`, `.btn-ghost` — button variants
- `.card-service` — hover-lift service card
- `.badge-cert` — certification badge pill
- `.nav-link` — nav link with underline hover animation
- `.skip-to-content` — accessibility skip link
- `.section-pad` — section vertical padding

### DO NOT
- Hardcode hex colors in components (use Tailwind `text-cargo-*`, `bg-cargo-*`)
- Use `@apply` in component-scoped styles (use utility classes)
- Use `!important` except for accessibility overrides
- Use arbitrary values like `bg-[#0F3E51]` (use the token)

---

## Accessibility (WCAG 2.1 AA)

- Every `<img>` must have `alt` text (decorative images: `alt=""` + `aria-hidden="true"`)
- Every interactive element must be keyboard reachable
- `focus-visible` must use emerald outline: `outline: 2px solid var(--color-cargo-emerald)`
- `prefers-reduced-motion` media query in `global.css` disables animations globally
- Skip-to-content link in `Layout.astro`
- Form inputs: `label` + `aria-label` on icon-only buttons
- Color contrast: emerald-on-deep = 4.7:1 ✓, white-on-deep = 13.6:1 ✓

---

## File Structure

```
src/
├── components/
│   ├── global/     Header.astro, Footer.astro, LangToggle.astro
│   ├── home/       Hero.astro, ServicesGrid.astro, SafetySection.astro, StatsStrip.astro
│   ├── services/    ServiceDetail.astro
│   ├── contact/     QuoteForm.astro, ContactInfo.astro
│   └── ui/          Button.astro, Badge.astro, Card.astro, Section.astro, AWBTracker.jsx
├── i18n/           es.json, en.json, utils.ts
├── layouts/        Layout.astro
├── pages/
│   ├── index.astro         (redirect)
│   ├── es/  {index,servicios,contacto,cotizacion}.astro
│   └── en/  {index,services,contact,quote}.astro
└── styles/       global.css
```

---

## Commands

```bash
npm install           # Install dependencies
npm run dev          # Dev server :4321
npm run check        # astro check — 0 errors
npm run build        # Static build → dist/
npm run preview      # Preview dist/
npm run format       # Prettier format
npm run lint         # ESLint
npm run optimize:assets  # Convert LOGOS/ + jmcground/image/ → WebP
```

---

## Deployment

See `DEPLOYMENT.md` for detailed steps (Vercel + HostGator).

Key constraint: `output: 'static'` in `astro.config.mjs`. Never switch to `server` or `hybrid` without updating deployment docs.

---

## Known Integration Points

### AWB Tracking
`src/components/ui/AWBTracker.jsx` — simulated tracking. Replace `await new Promise(...)` with a real `fetch()` to a cargo tracking API. Integration point documented inline.

### Contact Form
`src/components/contact/QuoteForm.astro` — FormSubmit.co. No backend. To change recipients: update `action`, `_cc`, and `_subject` hidden inputs.

---

## DO's and DON'Ts

### DO
- Use Tailwind utility classes for all styling
- Use the `cargo-*` design tokens consistently
- Add new i18n keys to both `es.json` AND `en.json`
- Use `aria-label` on icon-only buttons
- Use `loading="lazy"` on non-hero images
- Test keyboard navigation after adding interactive components

### DON'T
- Hardcode hex colors in HTML/Tailwind
- Add Spanish/English strings directly in Astro templates
- Use `var(--color-cargo-*)` in Tailwind classes (use `cargo-*` directly)
- Create new pages without adding them to the sitemap
- Use `<script>` tags without `is:inline` unless the script needs bundling
- Remove `prefers-reduced-motion` from `global.css`
