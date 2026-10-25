# AGENTS.md — JMC Handling Site Conventions

This file documents conventions and constraints for any AI agent working on this codebase.
Last updated: 2026-10-25

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

Top-level namespaces: `nav`, `hero`, `services`, `allies`, `about`, `equipment`, `safety`, `quote`, `contact`, `footer`, `form`, `common`, `meta`, `home`, `media`

- `home.*` — copy de las secciones de la portada
- `media.alt.*` — texto alternativo de cada imagen (obligatorio: una clave por medio)

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
- Root `/` → `/es/` (302 en `vercel.json`); `src/pages/index.astro` es el fallback
  para otros hostings y detecta `Accept-Language`
- `switchLocalePath(path, target)` in `utils.ts` swaps the locale prefix

### Validation
`npm run i18n:check` verifica: árboles ES/EN idénticos, que cada `t('...')`
resuelva en ambos diccionarios, que cada `altKey` del mapa de medios exista, y
reporta claves huérfanas. **Falla el build.**

---

## Section Anchors

Section IDs are **English and stable in both locales**: `#services`, `#equipment`,
`#allies`, `#about`, `#safety`. Each section keeps a legacy Spanish alias as a
hidden span (`<span id="capacidades" class="sr-only" aria-hidden="true"></span>`).
**Never delete the aliases** — external links use them.

Legacy aliases in use: `capacidades` (services), `equipos` (equipment),
`empresa` (about), `seguridad` (safety).

Deep-link targets that must keep resolving:
- Service families on the home page: `#ramp-gse`, `#aircraft-care`,
  `#fbo-operations`, `#passenger-services`, `#gse-maintenance`
  (each `<article>` in `ServicesGrid.astro` carries `id={family.key}`).
- Equipment cards: `#equipment-carrucha`, `#equipment-tractor`,
  `#equipment-tractorService`, `#equipment-water`, `#equipment-belt`,
  `#equipment-gpu`.

---

## Component Conventions

### File naming
- Astro components: `PascalCase.astro` (e.g. `ServiceDetail.astro`)
- UI primitives: `PascalCase.astro` (e.g. `Button.astro`)

### No framework JS
React was removed on purpose. There are **no `client:*` islands** and no framework
integrations in `astro.config.mjs`. Budget: **≤10 kB gzip of JS per page** — the
site currently ships **0 kB**. Use CSS-first or small vanilla `<script>` blocks.

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
- `.btn-primary`, `.btn-secondary`, `.btn-ghost` — button variants
- `.badge-cert` — certification badge pill
- `.nav-link` — nav link with underline hover animation
- `.field-control` — form input control
- `.skip-to-content` — accessibility skip link
- `.section-pad` — section vertical padding
- `.container-max` — page container (`max-w-7xl`)
- `.animate-fade-up`, `.animate-fade-in` — entrance animations

> `.glass`, `.glass-dark`, `.text-gradient-emerald` and `.card-service` are **not
> defined** in `global.css`. Create them if you use them, or avoid referencing them.

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
│   ├── home/       Hero, AlliesStrip, ServicesGrid, EquipmentGrid,
│   │               About, SafetySection, RequestPrompt
│   ├── services/   ServiceDetail.astro
│   ├── contact/    QuoteForm.astro, ContactInfo.astro
│   └── ui/         Button.astro, Badge.astro, Card.astro, Section.astro
├── data/           siteContent.ts, allies.ts, media.generated.ts (GENERATED)
├── i18n/           es.json, en.json, utils.ts
├── layouts/        Layout.astro
├── pages/
│   ├── index.astro         (root redirect)
│   ├── es/  {index,servicios,contacto,cotizacion,sobre-jmc}.astro
│   └── en/  {index,services,contact,quote,about-jmc}.astro
└── styles/       global.css

media-raw/                 photo masters, NOT tracked by git (504 MB)
├── equipment/  11 Canon R5 photos of GSE
├── services/   40 iPhone photos of ramp and cargo operations
├── allies/     raster logos (sources for the SVG/WebP outputs)
└── _quarantine/ AI-generated images — DO NOT USE

public/assets/
├── photos/{hero,equipment,services,families}/   WebP derivatives (tracked)
├── photos/manifest.json                          full library, 0 kB of JS
├── photos/video/                                 pushback.webm/.mp4 + poster
├── allies/                                       SVG/WebP, kebab-case
├── brand/                                        isotipo and wordmark
└── og/                                           jmc-og-{es,en}.png

scripts/
├── media-map.json        semantic media map (MASTER — edit this)
├── optimize-assets.mjs   WebP pipeline, video transcode, OG raster
├── check-i18n.mjs        i18n integrity checker
└── check-links.py        internal link + fragment validator
```

---

## Media & Assets

- The **master** media map is `scripts/media-map.json`. Edit it, then run
  `npm run optimize:assets`. Never edit `src/data/media.generated.ts` by hand.
- Every image has an `altKey` in `media.alt.*` (es + en) describing **what is
  actually visible**.
- **Alt text must match the photo, not the label.** The 2026 audit found 5 of 7
  GSE photos mis-labelled (a GPU photo captioned as a water cart, etc). Before
  assigning an image to a slot, open the master and look at it. Never caption a
  photo as equipment it does not show.
- The photo library covers **ramp, cargo and GSE**. There are no photos of
  aircraft interior cleaning, passenger service or the workshop — those families
  use the legacy photos assigned to them (`family-aircraft-care`,
  `family-passenger-services`, `family-gse-maintenance`). **Never reuse a ramp
  photo to depict another activity.**
- Never use AI-generated images (`media-raw/_quarantine/`). Never use placeholders.
- Photo masters are never committed. Only the WebP derivatives are.

### Art-directed crops (`sets`)

An item in `media-map.json` may declare `sets` instead of `widths` to get
art-directed variants (one per breakpoint):

```json
{ "name": "wide", "aspect": "16:9", "position": "attention", "widths": [1280, 1920] }
```

- `position`: `"attention"` (sharp picks the most informative region — use this
  for hero shots), `"entropy"`, a gravity (`"top" | "centre" | "bottom" | …`)
  or `{ top, left }` pixel offsets.
- Files are emitted as `<id>-<set>-<width>.webp`; `media.generated.ts` exports
  them as `ArtDirectedAsset` with `sets: { wide, tall }`.
- Consume them with `<picture>` + `<source media="...">` (see `Hero.astro`).
- Always read back the generated WebP to confirm the crop still shows the
  subject — `attention` can pick an unexpected region.

### Hero

- **Single photo, no carousel.** The hero uses `hero-gse-ramp` (art-directed:
  `wide` 16:9 for desktop, `tall` 4:5 for mobile).
- Text sits over the **left** third; the overlay is a horizontal
  `cargo-ink` gradient. Verify contrast stays ≥ 4.5:1 (measured ~18:1).

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
npm run i18n:check   # ES/EN tree parity + referenced keys + altKeys
npm run check:links  # internal links + #fragment targets
npm run optimize:assets  # media-raw/ → public/assets/photos/ (WebP + video + OG)
npm run verify       # i18n:check + check + build + check:links  ← gate before every commit
```

### sharp on Linux/WSL

If `sharp` fails to load libvips:

```bash
export LD_LIBRARY_PATH="$PWD/node_modules/@img/sharp-linux-x64/node_modules/@img/sharp-libvips-linux-x64/lib"
```

---

## Deployment

See `DEPLOYMENT.md` for detailed steps (Vercel + HostGator).

Key constraint: `output: 'static'` in `astro.config.mjs`. Never switch to `server` or `hybrid` without updating deployment docs.

---

## Known Integration Points

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
- Add `width`/`height` to every `<img>` (no layout shift)
- Run `npm run verify` before committing
- Use real photography; never placeholders, never AI-generated imagery

### DON'T
- Hardcode hex colors in HTML/Tailwind
- Add Spanish/English strings directly in Astro templates
- Use `var(--color-cargo-*)` in Tailwind classes (use `cargo-*` directly)
- Create new pages without adding them to the sitemap
- Use `<script>` tags without `is:inline` unless the script needs bundling
- Remove `prefers-reduced-motion` from `global.css`
- Reintroduce React/Vue/Svelte or any `client:*` island
- Commit the photo masters in `media-raw/`
- Invent copy in a single dictionary only
- Delete the legacy section anchors (`capacidades`, `equipos`, `empresa`, `seguridad`)
- Use Poppins, Roboto, Montserrat or any font outside Inter + JetBrains Mono
