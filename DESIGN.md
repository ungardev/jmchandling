# JMC Handling — Design System

> Fuente de verdad del sistema visual. **Astro 5 + Tailwind CSS v3.4 + TypeScript.**
> Todo el diseño debe derivar de este documento y de los tokens de Tailwind.
> Prohibido hardcodear hex, variables arbitrarias o tipografías no listadas aquí.

---

## 1. Posicionamiento

JMC Handling es un **operador de servicios aeroportuarios** en el Aeropuerto Internacional
Simón Bolívar de Maiquetía, Venezuela. El sitio se dirige a decisores de aerolíneas
(ground handlers, OBF, responsables de operaciones, calidad y seguridad).

**Tono:** ingeniería de aviación, no marketing de consumo.
- Preciso, verificable, sin superlativos vacíos ("líder", "innovador", "world-class").
- Cada afirmación se ancla en un hecho: CESEA-021, INAC, RAV 111, +30 años de experiencia,
  constituida en 2012, Maiquetía desde 2015, horario L–S 05:00–22:00 VET.
- **Fotografía real de la operación**, nunca imagen de IA.

**Idioma:** español venezolano profesional como idioma principal (por defecto).
El inglés es una versión secundaria *nativa*, no una traducción literal.
Rutas: `/es/…` (por defecto) y `/en/…`.

**Identificadores de sección:** en inglés y estables, idénticos en ambos idiomas
(`#services`, `#equipment`, `#allies`, `#about`, `#safety`). Los alias legacy en
español (`#capacidades`, `#equipos`, `#empresa`, `#seguridad`) existen como
`<span class="sr-only">` dentro de la sección y **no deben eliminarse**.

---

## 2. Color

### Tokens (únicos valores permitidos)

| Token | Hex | Variable CSS | Rol |
|---|---|---|---|
| `cargo-deep` | `#0F3E51` | `--color-cargo-deep` | Fondo de marca, header, hero, secciones profundas |
| `cargo-light` | `#A0DDF5` | `--color-cargo-light` | Acento claro, texto sobre deep, hover |
| `cargo-emerald` | `#5BA8C7` | `--color-cargo-emerald` | Acción, acento, badges, foco |
| `cargo-ink` | `#0A1F2B` | `--color-cargo-ink` | Texto sobre superficies claras, footer |
| `cargo-mist` | `#F5F8FA` | `--color-cargo-mist` | Fondo de superficie clara alterno |
| `cargo-white` | `#FFFFFF` | `--color-cargo-white` | Texto inverso, tarjetas |

### Reglas de color

- **Nunca** `bg-[#0F3E51]`, `#fff`, `rgb(...)` ni colores fuera de la tabla.
- Opacidad sí se permite sobre tokens: `text-cargo-white/80`, `border-cargo-deep/15`.
- Contraste mínimo AA verificado:
  - `cargo-emerald` sobre `cargo-deep` → 4.7:1 ✓
  - `cargo-white` sobre `cargo-deep` → 13.6:1 ✓
  - `cargo-ink` sobre `cargo-mist` → 15.2:1 ✓
  - `cargo-emerald` sobre `cargo-white` → **3.1:1 ✗** → nunca texto pequeño;
    solo bordes, iconos grandes, badge con `cargo-ink` encima.
- El azul medio (`cargo-emerald`) **no** es un color de texto sobre blanco.

### Ritmo de superficies

Las secciones alternan para marcar avance narrativo:

```
bg-cargo-deep  →  bg-cargo-white  →  bg-cargo-mist  →  bg-cargo-light  →  bg-cargo-ink
```

Nunca dos secciones consecutivas del mismo fondo, salvo que una sea una
subsección dentro de la anterior.

---

## 3. Tipografía

### Familias

- **Inter** (300–800) — UI y cuerpo de texto. Cargada en `src/styles/global.css`
  y en `src/layouts/Layout.astro`.
- **JetBrains Mono** (400–600) — datos, cifras, etiquetas, códigos, ref. de
  equipos (AWB, ULD, GPU, RAV 111).
- **Prohibido** Poppins, Roboto, Open Sans, Lato, Montserrat o cualquier otra.

### Escala

| Uso | Clase | Tamaño |
|---|---|---|
| Display hero | `text-5xl`–`text-7xl` | 48–72 px |
| H2 de sección | `text-3xl`–`text-4xl` | 30–36 px |
| H3 de tarjeta | `text-xl`–`text-2xl` | 20–24 px |
| Cuerpo grande | `text-lg` | 18 px |
| Cuerpo | `text-base` | 16 px |
| Cuerpo secundario / lead | `text-sm` | 14 px |
| Etiqueta / caption | `text-xs` | 12 px |
| Cifra destacada | `font-mono text-3xl`–`text-4xl` | 30–36 px |

### Reglas

- Tracking negativo en títulos: `tracking-[-0.04em]` (H2) a `tracking-[-0.045em]` (H1).
- `leading-[1.02]` en H1, `leading-[1.05]`–`leading-[1.1]` en H2, `leading-relaxed` en cuerpo.
- `text-balance` en titulares de más de 2 líneas.
- Etiquetas en mono: `font-mono text-xs uppercase tracking-[0.12em]`.
- Ancho de línea: 60–72 caracteres. `max-w-xl` (titular) / `max-w-2xl` (párrafo largo).
- Nunca justificar. Nunca `font-light` para texto de interfaz pequeño.

---

## 4. Espaciado, radio y bordes

- **Contenedor:** `.container-max` (`max-w-7xl px-5 sm:px-8 lg:px-10`).
  En canvas de diseño el máximo es `1320px` con `px-8` / `xl:px-12`.
- **Padding vertical de sección:** `.section-pad` (`py-20 md:py-28`).
  Alternativa `xl` (`py-28 md:py-40`) solo para CTA de cierre.
- **Ritmo interno:** escala Tailwind. Saltos de 2 (8 px) a 12 (48 px).
- **Radio:** `rounded-sm` (2–4 px) es la norma del sistema — la marca es industrial,
  no redondeada. `rounded-full` solo para indicadores de estado y píldoras.
- **Bordes:** `border border-cargo-deep/15` sobre superficies claras;
  `border-cargo-white/15` sobre `cargo-deep`. Nunca bordes de 2 px salvo separadores
  de sección (`border-t border-cargo-deep/20`).
- **Sombras:** el sistema **no usa sombras difusas**. La profundidad se construye con
  bordes, cambios de superficie y `object-cover`. Si necesitas elevación, usa
  `shadow-none` y un borde de 1 px.

---

## 5. Movimiento

| Patrón | Duración | Curva | Uso |
|---|---|---|---|
| Hover de color | 200 ms | `ease` / `transition-colors` | Botones, enlaces, bordes |
| Hover de tarjeta | 500 ms | `ease-out` | `group-hover:scale-[1.03]` sobre la imagen |
| Entrada | 600 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | `.animate-fade-up` (translateY 14 px → 0) |
| Aparición | 400 ms | `ease-out` | `.animate-fade-in` |

- **Toda animación debe estar anulada por `prefers-reduced-motion`.** El bloque global
  en `src/styles/global.css` ya lo hace; si añades animaciones nuevas, añade
  también `motion-reduce:transform-none motion-reduce:transition-none` en la clase.
- Nada de `animate-pulse`, `animate-bounce` ni parallax agresivo.
- El scroll horizontal de un marquee o galería se hace con CSS (`scroll-snap`,
  `overflow-x`), no con JS de animación.

---

## 6. Componentes

### Inventario

| Componente | Ruta | Notas |
|---|---|---|
| `Header` | `src/components/global/Header.astro` | Fondo `cargo-deep`, 4 enlaces, selector ES/EN |
| `Footer` | `src/components/global/Footer.astro` | Fondo `cargo-ink` |
| `Hero` | `src/components/home/Hero.astro` | Grid 0.92/1.08, foto vertical a la derecha |
| `AlliesStrip` | `src/components/home/AlliesStrip.astro` | `id="allies"`, logos a color |
| `ServicesGrid` | `src/components/home/ServicesGrid.astro` | `id="services"` |
| `EquipmentGrid` | `src/components/home/EquipmentGrid.astro` | `id="equipment"`, 6 tarjetas 4:5 |
| `About` | `src/components/home/About.astro` | `id="about"`, fondo `cargo-deep` |
| `SafetySection` | `src/components/home/SafetySection.astro` | `id="safety"` |
| `RequestPrompt` | `src/components/home/RequestPrompt.astro` | CTA sobre `cargo-light` |
| `Button` / `Badge` / `Card` / `Section` | `src/components/ui/` | Primitivas |
| `QuoteForm` | `src/components/contact/QuoteForm.astro` | FormSubmit.co |

### Primitivas disponibles en `src/styles/global.css`

`.btn-primary` · `.btn-secondary` · `.btn-ghost` · `.badge-cert` · `.card-service` ·
`.nav-link` · `.field-control` · `.section-pad` · `.container-max` · `.skip-to-content` ·
`.glass` · `.glass-dark` · `.text-gradient-emerald`

> `.card-service` y las utilidades `.glass*` / `.text-gradient-emerald` **no existen
> todavía en `global.css`**: créalas como parte del trabajo si las vas a usar, o
> evita referenciarlas.

### Patrón de componente Astro (obligatorio)

```astro
---
import type { Locale } from '../../i18n/utils';
import { useTranslations } from '../../i18n/utils';

export interface Props {
  locale: Locale;
  variant?: 'primary' | 'secondary';
  class?: string;
}

const { locale, variant = 'primary', class: className = '' } = Astro.props;
const t = useTranslations(locale);
---

<section class="...">
  <h2>{t('home.sectionHeading')}</h2>
</section>
```

Todo texto visible pasa por `t()`. **Ningún literal en español o inglés dentro de un
`.astro`.**

---

## 7. Medios

### Pipeline

```bash
npm run optimize:assets
```

- Maestros en `media-raw/` (**504 MB, ignorado por git**). Derivados WebP en
  `public/assets/photos/` (**versionados**).
- El mapa semántico maestro es `scripts/media-map.json`. **Editar ese archivo, no
  los archivos generados.**
- Salidas: `public/assets/photos/manifest.json` (biblioteca completa, 0 kB de JS) y
  `src/data/media.generated.ts` (subconjunto curado, exports individuales).
- Formato: WebP, calidad 78, esfuerzo 6, sin upscale, sin recorte. Anchos 640 / 1280
  (hero: 1280 / 1920).
- Vídeo: `public/assets/photos/video/pushback.{mp4,webm}` + `pushback-poster.webp`.
- OG: `public/assets/og/jmc-og-{es,en}.png` (1200×630).

### Cómo consumir un medio

```astro
---
import { equipmentCarrucha } from '../../data/media.generated';
---

<img
  src={equipmentCarrucha.src}
  srcset={equipmentCarrucha.srcset}
  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
  alt={t(equipmentCarrucha.altKey)}
  width={equipmentCarrucha.width}
  height={equipmentCarrucha.height}
  loading="lazy"
  decoding="async"
/>
```

- **Todo medio tiene `altKey`** y ese texto vive en `media.alt.*` (es) y `media.alt.*` (en).
- `width`/`height` siempre presentes → sin layout shift.
- `loading="lazy"` + `decoding="async"` en todo lo que no sea el hero.
- El hero: `loading="eager"` + `fetchpriority="high"`.
- Nunca referenciar un archivo que no exista en `public/`. Antes de usar una foto,
  comprobar su `id` en `scripts/media-map.json`.

### Regla de veracidad

El archivo fotográfico cubre **operación de rampa y carga** (40 fotos), **equipos GSE**
(11 fotos) y material heredado de marca (7 fotos de baja resolución: mantenimiento,
certificado, capacitación, seguridad).

**No existen fotografías de limpieza interior de aeronaves, de atención al pasajero ni de
taller.** No reutilices una foto de rampa para simular esas actividades: usa la foto
heredada que sí corresponde (`family-aircraft-care`, `family-passenger-services`,
`family-gse-maintenance`) o un tratamiento tipográfico.

---

## 8. Accesibilidad (WCAG 2.1 AA)

- Cada `<img>` tiene `alt` con texto real. Decorativas: `alt=""` + `aria-hidden="true"`.
- Foco visible: `outline: 2px solid var(--color-cargo-emerald)` (ya global). No lo elimines.
- Todo elemento interactivo alcanzable por teclado y con `:focus-visible` visible.
- Iconos solos: `aria-label` + `aria-hidden` en el SVG.
- `prefers-reduced-motion` desactiva **toda** animación.
- Formularios: `<label>` visible, `aria-describedby` para errores, `required`.
- Skip link: `.skip-to-content` ya presente en `Layout.astro`.
- Landmarks: un `<main>` por página, `<nav>` con `aria-label`, `<section>` con
  `aria-labelledby` o `aria-label`.

---

## 9. Restricciones técnicas

- `output: 'static'`. Sin backend. El formulario va a FormSubmit.co.
- **Cero JavaScript de framework.** No se usa React/Vue/Svelte ni islas `client:*`.
  Si necesitas interactividad, escríbela en un `<script>` vanilla o en CSS.
  Presupuesto: **≤ 10 kB gzip de JS por página**. Hoy el sitio envía **0 kB**.
- Sin `<script>` sin `is:inline` salvo que necesite bundling.
- Sin librerías de UI externas (Bootstrap, jQuery, Swiper, Embla, Mobirise).
- Tailwind v3.4 con las utilidades del sistema. Sin `@apply` en estilos de componente
  (usa clases de utilidad directamente). Sin `!important` salvo override de a11y.
- `npm run verify` (= `i18n:check` + `astro check` + `astro build`) debe quedar en verde
  antes de cualquier commit.

---

## 10. Qué no hacer

| No | Por qué |
|---|---|
| No reintroducir React/Vue ni islas hidratadas | Anula la ventaja de 0 kB JS |
| No hardcodear hex ni `bg-[#...]` | Rompe el sistema de tokens |
| No escribir texto visible sin `t()` | Rompe ES/EN y el checker i18n |
| No añadir claves i18n a un solo diccionario | `npm run i18n:check` falla |
| No usar placeholders ni imágenes de IA | Credibilidad operacional |
| No subir los maestros de 504 MB a git | Repo inflado, deploy lento |
| No crear páginas sin añadirla al sitemap | Astro lo hace solo si está en `src/pages/` |
| No borrar los alias de anclas legacy | Rompe enlaces externos |
| No eliminar `prefers-reduced-motion` | Accesibilidad |
| No usar Poppins/Roboto/Montserrat | No está en el sistema tipográfico |
