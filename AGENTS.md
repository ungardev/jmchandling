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
`#allies`, `#operations`, `#safety`. Each section keeps a legacy Spanish alias as a
hidden span (`<span id="capacidades" class="sr-only" aria-hidden="true"></span>`).
**Never delete the aliases** — external links use them.

Legacy aliases in use: `capacidades` (services), `equipos` (equipment),
`seguridad` (safety).

`#about` and `#empresa` no longer point to a home section: the company block
was consolidated into `/es/sobre-jmc` (`/en/about-jmc`). Both ids are still
present on the home as hidden spans so legacy deep links keep resolving, and
`vercel.json` redirects `/es/empresa` → `/es/sobre-jmc` and
`/en/company` → `/en/about-jmc`.

**No dupliques contenido entre la home y una pagina interna.** Si un bloque
corporativo aparece completo en una pagina dedicada, la home lo enlaza, no lo
repite. La home es: Hero → Allies → Servicios → Equipos → Operación
→ Seguridad → CTA.

Deep-link targets that must keep resolving:
- Service families on the home page: `#ramp-gse`, `#aircraft-care`,
  `#fbo-operations`, `#passenger-services`, `#gse-maintenance`
  (each `<details>` in `ServiceAccordion.astro` carries `id={family.key}`).
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
- `.badge-cert` — certification badge pill (fondo claro: texto `cargo-deep`)
- `.nav-link` — nav link with underline hover animation
- `.field-control` — form input control
- `.skip-to-content` — accessibility skip link
- `.section-pad` — section vertical padding
- `.container-max` — page container (`max-w-7xl`)
- `.eyebrow`, `.eyebrow-on-light`, `.eyebrow-on-dark` — etiqueta superior de seccion
- `.type-h2`, `.type-h3`, `.type-lead`, `.type-body`, `.type-meta`, `.type-figure` — escala tipografica por rol
- `.grid-12` — retícula base: 4 columnas móvil, 8 en `md`, 12 en `lg`
- `.animate-fade-up`, `.animate-fade-in` — entrance animations

> `.glass`, `.glass-dark`, `.text-gradient-emerald` and `.card-service` are **not
> defined** in `global.css`. Create them if you use them, or avoid referencing them.

### DO NOT
- Hardcode hex colors in components (use Tailwind `text-cargo-*`, `bg-cargo-*`)
- Use `@apply` in component-scoped styles (use utility classes)
- Use `!important` except for accessibility overrides
- Use arbitrary values like `bg-[#0F3E51]` (use the token)

---

## Visual Hierarchy

- **Type scale by role.** Every text belongs to exactly one role, and every
  role has exactly one size: `.type-h2` (section heading), `.type-h3` (card
  heading), `.type-lead` (intro paragraph), `.type-body` (reading copy),
  `.type-meta` (supporting text), `.type-figure` (metric), `.eyebrow`
  (informative label). Never invent loose sizes.
- **No `<h3>` may render smaller than the paragraph it accompanies.** If the
  heading sits below the body copy, raise the heading.
- **Canonical section order:** `H2 → lead → content → support`. The `.eyebrow`
  label is **not mandatory** and does not always open: use it only where it
  carries information (content type, standard, station). Repeating it on every
  section is template noise — see the anti-slop list below.
- **One numbering system.** Block numbers (`01`, `02`…) live in the margin via
  `IndexLabel.astro` and follow the same rhythm in services, equipment,
  safety and contact. Never number ad hoc ("01 ·", "1.").
- **Credentials are declared, documents are consulted.** The CESEA-021
  certificate scan must not be displayed on the home page. Credentials render
  through `src/components/ui/Credential.astro` (data in
  `src/data/credentials.ts`); the original opens on demand in a new tab.
- **Facts come from the primary source** (the INAC certificate, the brand
  brochure). Never invent validity dates, codes or issuing authorities —
  report them as pending business validation instead.

---

## Anti-slop list (Swiss / editorial technical direction)

The site's visual direction is **Swiss / technical editorial**: asymmetric
12-column grid, horizontal rules, air, strong typography, metadata in mono.
These patterns are forbidden — they are what makes a site look generated by a
template:

- Decorative `.eyebrow` repeated on every section.
- Value chips, pills and walls of metrics (`+30 años · CESEA · 24/7`).
- The universal `↗` arrow on every link — one arrow, only on primary CTAs,
  as an inline SVG (`src/components/ui/icons/`).
- Hand-written CTAs — everything goes through `Button.astro` /
  `ActionLink.astro`.
- Effect phrases ("La seguridad no se declara. Se opera.").
- Template imperatives ("Explore nuestras capacidades").
- Cards with shadow + radius + own background — structure comes from rules.
- `text-center` on body copy — operational content aligns left. A lone display
  heading may be centred (the allies tape does), but never a paragraph, a grid
  of content, or a list.
- Text walls joined with `;` — one fact per sentence.
- The same CTA repeated three times on one page.
- Icon + label redundancy.

---

## Accessibility (WCAG 2.1 AA)

- Every `<img>` must have `alt` text (decorative images: `alt=""` + `aria-hidden="true"`)
- Every interactive element must be keyboard reachable
- `focus-visible` must use the deep outline: `outline: 2px solid var(--color-cargo-deep)`.
  `cargo-emerald` is **not** allowed on the focus ring — 2.67:1 on `cargo-white`
  and 2.50:1 on `cargo-mist`, both below the 3:1 that WCAG 1.4.11 requires for
  non-text contrast. `cargo-deep` gives 11.49:1 and 10.77:1.
- `prefers-reduced-motion` media query in `global.css` disables animations globally
- Skip-to-content link in `Layout.astro`
- Form inputs: `label` + `aria-label` on icon-only buttons
- Color contrast: minimum **4.5:1** for normal text, **3:1** for large text
  (>=24px, or >=18.66px bold). Measured ratios for the brand tokens:

  | fg | bg | ratio |
  |---|---|---|
  | `cargo-white` | `cargo-deep` | 11.49:1 |
  | `cargo-white` | `cargo-ink` | 16.88:1 |
  | `cargo-light` | `cargo-deep` | 7.74:1 |
  | `cargo-light` | `cargo-ink` | 11.38:1 |
  | `cargo-deep` | `cargo-white` | 11.49:1 |
  | `cargo-deep` | `cargo-mist` | 10.77:1 |
  | `cargo-deep` | `cargo-light` | 7.74:1 |
  | `cargo-emerald` | `cargo-deep` | **4.31:1 — NO usar como texto pequeno** |
  | `cargo-emerald` | `cargo-white` | **2.67:1 — NO usar como texto** |

  **Regla:** `cargo-emerald` es color de borde, subrayado y decoracion. Para
  texto usar `cargo-deep` (sobre fondos claros) o `cargo-light` (sobre oscuros).
  Para etiquetas de seccion usar siempre el token `.eyebrow` + `.eyebrow-on-light`
  / `.eyebrow-on-dark`, nunca `text-cargo-emerald`.
  `cargo-emerald` tampoco se usa en el anillo de foco (ver arriba).

---

## File Structure

```
src/
├── components/
│   ├── global/     Header.astro, Footer.astro
│   ├── home/       Hero, AlliesStrip, ServiceAccordion,
│   │               EquipmentGrid, OperationsBand, SafetySection, RequestPrompt
│   ├── pages/      AboutPage.astro, ContactPage.astro (compartidos ES/EN)
│   ├── contact/    QuoteForm.astro, ContactInfo.astro, FormStatus.astro
│   └── ui/         Button.astro, ActionLink.astro, Badge.astro, Section.astro,
│                   Credential.astro, IndexLabel.astro, Label.astro,
│                   Figure.astro, SpecTable.astro, icons/
├── data/           siteContent.ts, allies.ts, credentials.ts,
│                   media.generated.ts (GENERATED)
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
- Text sits over the **left** third; the overlay combines a vertical and a
  horizontal `cargo-ink` gradient. Verify contrast stays ≥ 4.5:1 in the
  worst-case pixel of each text zone (measured ≥ 5.69:1 after the 2026
  legibility pass; the caption bar carries its own `bg-cargo-ink/85`).

### Ally logos (`public/assets/allies/`)

- The SVG viewBox must be **cropped to the ink**. Several originals were
  exports of a full web page and carried 70-85% empty canvas, which made the
  logo render at a fraction of its box. Crop the viewBox (and any `width` /
  `height` attributes that must stay in sync) so the content fills the box.
- `src/data/allies.ts` carries `width`, `height` (intrinsic, for CLS),
  `displayHeight` (render size) and `capOffset` (vertical offset).
  `displayHeight` is set by **optical weight**, not by a uniform height:
  lockups with a symbol (Copa, Laser) need more height for their wordmark to
  match the single-line wordmarks. The value is derived from the **cap
  height** of each logo, normalised to a common target:
  `displayHeight = 40 * (box height / cap height)`.
  Because the six boxes have different compositions (Copa stacks a script
  wordmark over "Airlines", Laser and Iberia are horizontal lockups with a
  symbol, Estelar and Aerotur carry a tagline or a stroke), the boxes do
  **not** share a cap position. Each logo therefore declares a `capOffset`
  in px so every wordmark sits on the same cap line:
  `capOffset = max(capTop) - capTop`.
  The CSS utility `.ally-logo` reads `--ally-h` and `--ally-cap`; the scale
  factor is 1 on desktop, 0.82 between 640px and 1024px and 0.58 below
  640px — it applies to the offset too, so the alignment holds at every scale.
- The allies band is a **moving tape**, not a full-screen section and not a
  carousel. It is sized by its content (no `100svh`) so it reads as a
  deliberate band in the home rhythm.
- The tape's single heading is **centred on the page axis**
  (`mx-auto max-w-4xl text-center`). It is a lone display heading, not body
  copy, and the symmetry against the full-bleed tape is the point. Do not
  "fix" it back to left.
- **The tape is CSS-only. Keep it at 0 kB of JS.** The DOM holds two
  identical lists; both run the same keyframe, so the second always sits one
  lap ahead and the loop has no seam. The final translate is
  `-(100% + gap)` — the list's own width plus the gap that separates it from
  the next one.
- The **pause on `:hover` and `:focus-within` is mandatory**. Anyone using
  the keyboard or the pointer has to be able to stop the motion to read.
- The duplicated list carries `aria-hidden="true"` so screen readers announce
  six logos, not twelve. Because of that, **never put a link inside the
  tape** — it would be unreachable for them.
- The tape is `role="group"` with `tabindex="0"`: a scrollable region must be
  keyboard reachable (WCAG 2.1.1). Under `prefers-reduced-motion` the
  animation is cancelled and the tape becomes a swipeable row with
  `scroll-snap`.
- `.ally-marquee-track` uses **`align-items: flex-start`**, never `center`:
  with `center` the browser centres the logo's *margin box*, so the cap
  offset would only be applied by half and the cap lines would drift apart.
- A **raster** logo must not ship with a solid colour box baked in. Estelar
  arrived as white-on-navy in a flat PNG; `scripts/optimize-assets.mjs`
  applies a **knockout** (declared per ally in `ALLY_KNOCKOUTS`) that turns
  the solid background transparent, keeps the antialiasing and retones the
  ink to `cargo-deep`. Never ship the boxed original.
- A wordmark rendered via `<text>` with a web font is unreliable — an SVG in
  an `<img>` is an isolated context and cannot load Google Fonts. Convert the
  text to paths instead (the Aerotur wordmark is Inter SemiBold as paths).

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
