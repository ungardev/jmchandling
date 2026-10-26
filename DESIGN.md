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
(`#services`, `#equipment`, `#allies`, `#operations`, `#safety`). Los alias legacy en
español (`#capacidades`, `#equipos`, `#empresa`, `#seguridad`) existen como
`<span class="sr-only">` dentro de la sección y **no deben eliminarse**.

**Orden de la home:** Hero → Índice → Allies → Servicios → Equipos → Operación
→ Seguridad → CTA.

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
- Contraste mínimo AA verificado sobre el token real:

  | fg | bg | ratio |
  |---|---|---|
  | `cargo-white` | `cargo-deep` | 11.49:1 ✓ |
  | `cargo-white` | `cargo-ink` | 16.88:1 ✓ |
  | `cargo-light` | `cargo-deep` | 7.74:1 ✓ |
  | `cargo-light` | `cargo-ink` | 11.38:1 ✓ |
  | `cargo-deep` | `cargo-white` | 11.49:1 ✓ |
  | `cargo-deep` | `cargo-mist` | 10.77:1 ✓ |
  | `cargo-emerald` | `cargo-deep` | **4.31:1 ✗ para texto pequeño** |
  | `cargo-emerald` | `cargo-white` | **2.67:1 ✗** |

- `cargo-emerald` **no** es color de texto. Queda para bordes, subrayados,
  indicadores y decoración. Para texto: `cargo-deep` sobre claros,
  `cargo-light` sobre oscuros. Para etiquetas: `.eyebrow` + `.eyebrow-on-light`
  / `.eyebrow-on-dark`.
- Sobre fotografía, el contraste se mide contra el **píxel más brillante** de
  la zona del texto, no contra un color medio.

### Ritmo de superficies

Las secciones alternan para marcar avance narrativo. La home actual:

```
hero cargo-ink → aliados cargo-white → servicios cargo-mist
→ equipos cargo-white → operación cargo-mist → seguridad cargo-deep → cierre cargo-white
```

Nunca dos secciones consecutivas del mismo fondo, salvo que una sea una
subsección dentro de la anterior. El fondo profundo marca los tres momentos de
peso: apertura, seguridad y cierre.

---

## 3. Tipografía

### Familias

- **Inter** (300–800) — UI y cuerpo de texto. Cargada en `src/styles/global.css`
  y en `src/layouts/Layout.astro`.
- **JetBrains Mono** (400–600) — datos, cifras, etiquetas, códigos, ref. de
  equipos (AWB, ULD, GPU, RAV 111).
- **Prohibido** Poppins, Roboto, Open Sans, Lato, Montserrat o cualquier otra.

### Escala por rol

Cada texto de la interfaz pertenece a **un** rol, y cada rol tiene **un**
tamaño y **un** ritmo. Las clases viven en `src/styles/global.css`; no
inventar tamaños sueltos.

| Rol | Clase | Tamaño | Aplicar en |
|---|---|---|---|
| Display hero | (fuera del sistema) | 36–72 px · `leading-[1.02]` | solo `Hero.astro` |
| H2 de sección | `.type-h2` | 30–36 px · `tracking-[-0.04em]` | H2 de cada sección |
| H3 de tarjeta | `.type-h3` | 18–20 px · `tracking-[-0.025em]` | H3 de tarjetas y columnas |
| Lead / párrafo introductorio | `.type-lead` | 16–18 px | lead de sección |
| Cuerpo de lectura | `.type-body` | 16 px | descripciones y párrafos |
| Texto de apoyo | `.type-meta` | 14 px | captions, pies, notas |
| Etiqueta | `.eyebrow` + `.eyebrow-on-light` / `.eyebrow-on-dark` | 12 px mono | etiqueta **informativa** de sección |
| Índice de sección | `IndexLabel.astro` | 12 px mono | número de bloque (`01`–`05`) en el margen |
| Etiqueta de dato | `Label.astro` | 12 px mono | rótulo de campo o de fila |
| Cifra destacada | `.type-figure` | 30–36 px mono | años, métricas |

### Reglas

- **Ningún `<h3>` puede renderizar más pequeño que el párrafo que lo acompaña.**
  Si el titular queda por debajo del cuerpo, sube el titular; nunca bajes el
  texto de lectura.
- **Orden canónico de sección:** `H2 → lead → contenido → apoyo`.
  La etiqueta `.eyebrow` **no es obligatoria** y no siempre abre: úsala solo
  cuando aporte información (el tipo de contenido, el estándar, la estación).
  Repetirla en todas las secciones es ruido de plantilla.
- La numeración de bloque (`01`, `02`…) es un **sistema de una sola vez por
  bloque**, no un adorno por elemento: los equipos, los servicios, la
  seguridad y el contacto usan el mismo patrón y el mismo ritmo.
- Tracking negativo en títulos: `tracking-[-0.04em]` (H2) a `tracking-[-0.045em]` (H1).
- `leading-[1.02]` en H1, `leading-[1.08]` en H2, `leading-relaxed` en cuerpo.
- `text-balance` en titulares de más de 2 líneas.
- Etiquetas en mono: `font-mono text-xs uppercase tracking-[0.12em]`.
- Ancho de línea: 60–72 caracteres. `max-w-xl` (titular) / `max-w-2xl` (párrafo largo).
- Nunca justificar. Nunca `font-light` para texto de interfaz pequeño.

### Credenciales

Las credenciales **se declaran**, el documento **se consulta bajo demanda**.

- En la **home** el formato es de airlines: **pregunta → respuesta** dentro de
  un `<dl>`. La pregunta va en el idioma del lector ("¿Qué habilita la
  credencial CESEA-021?"), la respuesta explica el alcance operativo en una
  frase, y una **línea mono** cierra con los datos verificables:
  `código · emisor · vigencia`.
- Componente de fila para páginas internas: `src/components/ui/Credential.astro`.
  Formato: código mono en `cargo-light` (con punto `cargo-emerald`) → título →
  separador `border-cargo-white/15` → emisor → vigencia (mono 12 px) → link de
  evidencia.
- Datos en `src/data/credentials.ts`. Los hechos vienen de la fuente primaria
  (el certificado CESEA-021 del INAC): código, emisor y vigencia.
- **El escaneo del certificado no se muestra en la home.** Un documento
  grayscale con sello ocupa más espacio que la propia declaración de
  autoridad y baja la percepción de marca. El link abre el original en
  pestaña nueva con `rel="noopener noreferrer"`.
- Grid `sm:grid-cols-2`, borde `border-cargo-white/15`, fondo
  `bg-cargo-white/[0.04]`, hover `border-cargo-emerald/50`.

---

## 4. Espaciado, radio y bordes

- **Contenedor:** `.container-max` (`max-w-7xl px-5 sm:px-8 lg:px-10`).
  En canvas de diseño el máximo es `1320px` con `px-8` / `xl:px-12`.
- **Padding vertical de sección:** `.section-pad` (`py-20 md:py-28`).
  Alternativa `xl` (`py-28 md:py-40`) solo para CTA de cierre.
- **Ritmo interno:** escala Tailwind. Saltos de 2 (8 px) a 12 (48 px).
- **Retícula:** `.grid-12` (definida en `global.css`) es la retícula base del
  sitio: 4 columnas en móvil, 8 en `md`, 12 en `lg`. Las secciones de la home
  se construyen sobre ella con `col-span-*` y `col-start-*`. El contenido
  declarativo se alinea a la izquierda en columnas 1–8; la foto, la cifra o la
  nota técnica ocupan 4–6 columnas a la derecha. No uses `grid-cols-3` suelto
  como si fuera la retícula del sistema.
- **Estructura por reglas, no por cajas.** El separador horizontal
  (`border-t border-cargo-deep/15`) separa mejor que una tarjeta con sombra.
  Una tarjeta con borde, radio y fondo propio es el patrón que este sistema
  evita: cada elemento flota sin estructura.
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

### Microinteracción (CSS normal)

| Patrón | Duración | Curva | Uso |
|---|---|---|---|
| Hover de color | 200 ms | `ease` / `transition-colors` | Botones, enlaces, bordes |
| Hover de tarjeta | 500 ms | `ease-out` | `group-hover:scale-[1.03]` sobre la imagen |
| Entrada | 600 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | `.animate-fade-up` (translateY 14 px → 0) |
| Aparición | 400 ms | `ease-out` | `.animate-fade-in` |

### Movimiento por scroll (CSS nativo, 0 kB)

No hay librerías de animación. Todo el movimiento por scroll es CSS puro
(`animation-timeline`, `view-timeline-name`, `animation-range`). Soporte:
Chrome/Edge 115+, Safari 26+, Firefox 159+.

| Clase | Efecto | Timeline / rango |
|---|---|---|
| `.reveal` | entrada con desplazamiento | `view()` + `entry 0%` → `entry 100%` |
| `.parallax` / `.parallax-media` | paneo lento de la foto | `--jmc-parallax` + `cover 0%` → `cover 100%` |
| `.strip-tall` / `.strip-track` | tira horizontal anclada | `--jmc-strip` + `contain 0%` → `contain 100%` |
| `.header-overlay` | header sólido al hacer scroll | `scroll(root block)` + `0` → `120px` |
| `.scroll-progress` | barra de lectura | `scroll(root block)` |

Reglas:

- El estado "oculto" (`opacity: 0`) **se declara solo dentro de `@supports`**.
  Sin soporte, el contenido queda visible y la página se ve completa.
- `.reveal` solo en bloques **por debajo del fold**: el hero ocupa la primera
  pantalla, y un reveal allí quedaría invisible en el primer pintado.
- La tira usa `overflow-x: clip`, no `hidden`: recorta el desborde horizontal
  sin crear un contenedor de scroll, para que `position: sticky` siga
  anclándose al viewport.
- `100cqw` (no `100vw`) para medir el ancho de la sección: `vw` incluye el
  ancho de la barra de scroll y el paneo terminaría con la última foto cortada.

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
| `Header` | `src/components/global/Header.astro` | Fondo `cargo-deep`, nav de 3 links centrada sobre el eje de la página (grid `1fr auto 1fr`), botón "Contacto" + link de idioma a la derecha |
| `Footer` | `src/components/global/Footer.astro` | Fondo `cargo-ink`, retícula de 4 bloques con reglas, link ES/EN |
| `Hero` | `src/components/home/Hero.astro` | Pantalla completa (`100svh`), foto única + scrims, banda superior de contraste, texto en el tercio izquierdo, 2 CTA |
| `AlliesStrip` | `src/components/home/AlliesStrip.astro` | `id="allies"`, cinta horizontal en movimiento (0 kB de JS), 6 logos alineados por línea de cap, un único titular |
| `ServiceAccordion` | `src/components/home/ServiceAccordion.astro` | `id="services"`, 5 familias en `<details>` numerados + 12 servicios especiales |
| `EquipmentGrid` | `src/components/home/EquipmentGrid.astro` | `id="equipment"`, 6 equipos en 3×2 con reglas, ASU como fila de texto |
| `OperationsBand` | `src/components/home/OperationsBand.astro` | Vídeo de pushback + tira horizontal de 6 fotos pilotada por scroll |
| `SafetySection` | `src/components/home/SafetySection.astro` | `id="safety"`, Q&A de airlines (pregunta → respuesta) + foto de equipo |
| `RequestPrompt` | `src/components/home/RequestPrompt.astro` | Cierre con los tres canales de contacto directo |
| `AboutPage` / `ContactPage` | `src/components/pages/` | Contenido compartido por ES/EN, sin duplicar entre idiomas |
| `Credential` | `src/components/ui/Credential.astro` | Fila de credencial (código mono → título → emisor → vigencia → evidencia) |
| `Button` | `src/components/ui/Button.astro` | Única primitiva de acción: `primary` / `secondary` / `quiet` |
| `ActionLink` | `src/components/ui/ActionLink.astro` | Enlace de acción con flecha SVG inline |
| `IndexLabel` / `Label` | `src/components/ui/` | Número de bloque y rótulo de dato, ambos en mono |
| `Figure` / `SpecTable` | `src/components/ui/` | Figura con pie y tabla de especificaciones |
| `icons/*.astro` | `src/components/ui/icons/` | Set SVG inline (0 kB) — sustituye a las flechas de texto |
| `Section` / `Badge` | `src/components/ui/` | Primitivas de superficie y píldora |
| `QuoteForm` | `src/components/contact/QuoteForm.astro` | FormSubmit.co |

### Primitivas disponibles en `src/styles/global.css`

`.btn-primary` · `.btn-secondary` · `.btn-ghost` · `.badge-cert` ·
`.nav-link` · `.header-nav` · `.field-control` · `.section-pad` · `.container-max` ·
`.skip-to-content` · `.eyebrow` · `.eyebrow-on-light` · `.eyebrow-on-dark` ·
`.type-h2` · `.type-h3` · `.type-lead` · `.type-body` · `.type-meta` ·
`.type-figure` · `.grid-12` · `.hero-full` · `.header-overlay` · `.reveal` ·
`.parallax` / `.parallax-media` · `.strip-tall` / `.strip-track` /
`.strip-item` / `.strip-figure` · `.ally-logo` · `.scroll-progress`

> `.glass`, `.glass-dark`, `.text-gradient-emerald` y `.card-service` **no**
> están definidas. No las referencies: créalas si hacen falta o evita usarlas.

> `.card-service` y las utilidades `.glass*` / `.text-gradient-emerald` **no existen
> todavía en `global.css`**: créalas como parte del trabajo si las vas a usar, o
> evita referenciarlas.

### Header (`Header.astro`)

Retícula de 3 columnas. El nav va **centrado sobre el eje de la página**, no
centrado en el espacio sobrante:

```
grid-cols-[1fr_auto]                             → móvil: logo | botón de menú
lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] → escritorio
```

Las dos columnas laterales son iguales por construcción (`1fr` = `1fr`), así que
la columna central `auto` cae exactamente sobre el eje. Con
`flex justify-between` el nav se desplaza hacia el lado en cuanto los bloques
laterales no miden lo mismo.

| Bloque | Contenido | Alineación |
|---|---|---|
| 1 | logo (isotipo + wordmark) | `justify-self-start` |
| 2 | nav: Inicio · Capacidades · Sobre JMC | `justify-self-center` |
| 3 | botón "Contacto" + selector ES/EN | `justify-self-end` |

- Un solo DOM para los dos layouts: bajo `lg` el grupo central es
  `display:none`, no ocupa celda, y el logo y el botón de menú caen en las
  columnas 1 y 2.
- **El hover de un link no dibuja línea.** Solo cambia el color de la fuente
  (`white/75` → `white`, 7.23:1 → 11.49:1). La línea de 1 px (`cargo-light`)
  queda reservada a `.nav-link.active`, el estado de página actual: como mucho
  un elemento activo a la vez.
- Un enlace a un ancla (`/#services`) **no** es la página actual: la home ya
  está marcada por "Inicio".
- "Contacto" no es un link del nav: es el botón de la derecha (`nav.contact`).
  "Enviar solicitud" (`quote.submit`) queda para las CTAs de la home y el
  submit del formulario. El botón marca `aria-current="page"` con
  `Button current` cuando la ruta es la de contacto.
- 0 kB de JS: el grid, el hover y el estado activo son CSS.

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

### Cinta de aliados (`AlliesStrip`)

Listón horizontal en movimiento continuo dentro del ritmo de la home.
**No** es una sección a pantalla completa: se dimensiona por contenido y se lee
como una franja deliberada entre el hero y los servicios. Fondo `bg-cargo-white`.

**No es un carrusel.** No hay paginación, ni posiciones, ni flechas, ni estado
en JavaScript. Es una cinta: recorre su propio ciclo y se detiene al hover o
al foco. La diferencia importa —un carrusel hides contenido detrás de un
botón; una cinta no esconde nada, solo lo desplaza.

**Una sola afirmación.** La sección tiene un único titular y nada más: sin
eyebrow, sin subtítulo, sin línea de manifiesto. El titular no cuenta los
logos ("Seis aerolíneas…") porque ese número ata la frase a una aritmética y
obliga al titular a partirse en dos líneas. La evidencia la dan los logos.

El titular va **centrado sobre el eje de la página** (`mx-auto max-w-4xl
text-center`): es un titular aislado, no texto corrido, y la simetría frente a
la cinta full-bleed es el efecto buscado.

**El fondo blanco no es una decisión estética, es una restricción de contraste.**
Los logotipos son de marca y sus colores son fijos. Medidos sobre `cargo-deep`:
Copa 2.08:1, Avior 2.30:1, Laser gris 1.99:1 y **Aerotur 1.00:1 — invisible**
(son exactamente el mismo color). Sobre `cargo-white` los seis superan 3:1.

**Tamaño por peso óptico, no uniforme.** La altura de render de cada logo se
deriva de su *cap height* (altura de letra) real, normalizada a 40px:

```
displayHeight = 40 * (alto de caja / altura de letra)
```

Sin esto, Estelar renderizaba sus letras a 11.4px frente a las 24-33px de los
demás: se leía un 2.6× más pequeño.

**Alineación por línea de cap, no por caja.** Las cajas de los seis logos tienen
composiciones distintas (Copa apila el wordmark en script sobre "Airlines";
Laser e Iberia son lockups horizontales con símbolo al lado; Estelar y Aerotur
llevan lema o trazo debajo). Por eso cada logo lleva un `capOffset`: el
desplazamiento en px que sitúa su línea de cap en el mismo sitio que las
demás. La utilidad `.ally-logo` lee `--ally-h` y `--ally-cap`.

El factor de escala es 1 en escritorio, 0.82 entre 640px y 1024px y 0.58 por
debajo de 640px, para que el logo más ancho (Laser) guarde proporción con la
pantalla. Se aplica también al desplazamiento, así que la alineación se
mantiene en cualquier escala.

**`align-items: flex-start`, no `center`.** Con `center` el navegador centra la
caja de *márgenes* del logo, y el desplazamiento se aplicaría a la mitad: las
líneas de cap dejarían de coincidir. Con `flex-start` el margen superior es
exactamente el desplazamiento de la línea de cap. Dispersión medida: 0.73px.

La banda de letra de cada recurso se midió sobre el SVG/WebP renderizado
(fila por fila), no a ojo:

| Logo | Banda de letra (px intrínsecos) | Caja | `displayHeight` | `capOffset` |
|---|---|---|---|---|
| Copa | 0–49 | 433×114 | 93 | 9 |
| Avior | 2–34 | 286×35 | 44 | 6 |
| Laser | 14–79 | 773×104 | 64 | 0 |
| Estelar | 0–55 | 359×76 | 55 | 9 |
| Iberia | 8–52 | 400×88 | 80 | 1 |
| Aerotur | 0–16 | 104×19 | 48 | 9 |

**Mecánica de la cinta (0 kB de JS, CSS puro).**

- El DOM contiene **dos listados idénticos**. Los dos se animan con el mismo
  keyframe, así que el segundo queda siempre a una vuelta de distancia del
  primero y el bucle no tiene costura.
- La traslación final es `-(100% + gap)`: el ancho del propio listado más el
  hueco que lo separa del siguiente. Al terminar el ciclo, el segundo listado
  ocupa exactamente el lugar del primero.
- El **degradado (`mask-image`)** disuelve los extremos: los logos entran y
  salen en lugar de cortarse en seco. Es el detalle que separa una cinta de
  un banner.
- La **pausa por `:hover` y `:focus-within`** es obligatoria: quien navega con
  el teclado o con el puntero tiene que poder parar el movimiento para leer.
- Velocidad: ~48 px/s (48px de hueco, 52s por vuelta en escritorio). Lento, se
  lee como una cinta de aeropuerto, no como un banner.

**Accesibilidad de la cinta.**

- La copia duplicada lleva `aria-hidden="true"`: el lector de pantalla
  anuncia seis logos, no doce.
- La cinta es `role="group"` con `tabindex="0"`: una región desplazable
  debe ser alcanzable por teclado (WCAG 2.1.1). Con el foco dentro, la
  animación se pausa y las flechas desplazan la cinta.
- `prefers-reduced-motion` cancela la animación y la cinta pasa a ser una fila
  desplazable con el dedo y con `scroll-snap`.
- No se cuelgan enlaces dentro de la cinta: la copia duplicada está oculta a
  lectores de pantalla, así que un enlace dentro quedaría inalcanzable para
  ellos.

**Los logos raster no se envían con caja de color.** Estelar llegó como
PNG plano con la caja navy `#001E54` horneada y sin canal alfa. `scripts/optimize-assets.mjs`
aplica un *knockout* (declarado por aliado en `ALLY_KNOCKOUTS`): proyecta cada
píxel sobre el eje fondo → tinta, deja el fondo transparente, conserva el
antialiasing y retonifica la tinta a `cargo-deep`. El resultado son 359×76 px
sobre alfa, con el wordmark legible al mismo tamaño que el resto.

**Excepción de contraste documentada:** el swoosh amarillo de Laser
(`#FDDB03`) queda en 1.37:1 sobre blanco. Es un color de marca de terceros:
no se puede alterar sin falsear el logotipo. El wordmark "LASER" (verde,
3.06:1) y "AIRLINES" (gris, 5.77:1) sí superan el umbral, y el texto propio
de la sección cumple AA con holgura. Si el cliente exige el umbral completo,
la salida es un logo monocromo alternativo de Laser, no un ajuste de la web.

---

## 8. Accesibilidad (WCAG 2.1 AA)

- Cada `<img>` tiene `alt` con texto real. Decorativas: `alt=""` + `aria-hidden="true"`.
- Foco visible: `outline: 2px solid var(--color-cargo-deep)` (global). No lo elimines.
  `cargo-emerald` queda descartado para el anillo: 2.67:1 sobre blanco y 2.50:1
  sobre mist, por debajo del 3:1 que exige 1.4.11 (contraste no textual);
  `cargo-deep` da 11.49:1 y 10.77:1.
- **El header es la excepción**: su fondo es `cargo-deep`, donde el anillo global
  sería invisible. `.header-nav :focus-visible` lo cambia a `cargo-light`
  (7.74:1 sobre `cargo-deep`). Nunca elimines el anillo del header.
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
  Si necesitas interactividad, escríbela en un `<script is:inline>` vanilla
  mínimo o en CSS. Presupuesto: **≤ 10 kB gzip de JS por página**. Hoy el sitio
  envía **0 kB** de JS externo; el único script inline es el del menú móvil y el
  que abre el acordeón por hash.
- Sin `<script>` sin `is:inline` salvo que necesite bundling.
- Sin librerías de UI externas (Bootstrap, jQuery, Swiper, Embla, Mobirise).
- Sin librerías de animación (GSAP, Lenis, AOS, Motion, React Bits). El
  movimiento por scroll es CSS nativo.
- Tailwind v3.4 con las utilidades del sistema. Sin `@apply` en estilos de componente
  (usa clases de utilidad directamente). Sin `!important` salvo override de a11y.
- `npm run verify` (= `i18n:check` + `astro check` + `astro build`) debe quedar en verde
  antes de cualquier commit.

---

## 10. Lista anti-slop

Dirección visual: **suiza / editorial técnico**. Retícula de 12 columnas
asimétrica, reglas horizontales, aire, tipografía fuerte, metadatos en mono.
Lo que sigue es exactamente lo que hace que un sitio parezca generado por
plantilla y está prohibido:

| No | Por qué |
|---|---|
| Etiqueta decorativa repetida en cada sección | `.eyebrow` abre solo donde aporta dato; repetirlo en 6 secciones es ruido |
| Chips, píldoras y muros de valores (`+30 años · CESEA · 24/7`) | Parecen métricas de plantilla y no se pueden verificar de un vistazo |
| Flecha universal `↗` en todo enlace | Una sola flecha, solo en CTA primarios, como SVG inline |
| CTA escritos a mano en cada sitio | Todo pasa por `Button.astro` / `ActionLink.astro` |
| Frases de efecto ("La seguridad no se declara. Se opera.") | Suenan a eslogan; se sustituye por una afirmación verificable |
| Imperativos de plantilla ("Explore nuestras capacidades") | El titular dice qué hay, no que hay que hacer clic |
| Tarjetas con sombra, radio y fondo propio | La estructura la dan las reglas horizontales, no las cajas |
| `text-center` en texto corrido | El contenido operativo se alinea a la izquierda; solo un titular aislado puede centrarse (el de la cinta de aliados) |
| Muro de texto con `;` | Un hecho por frase, con punto |
| Repetir la misma CTA en tres sitios | Un CTA principal y uno secundario por página |
| Icono + etiqueta redundantes | El icono acompaña a la acción, no la sustituye ni la duplica |

---

## 11. Qué no hacer

| No | Por qué |
|---|---|
| No reintroducir React/Vue ni islas hidratadas | Anula la ventaja de 0 kB JS |
| No usar `100vw` para medir el ancho de una sección | `vw` incluye la barra de scroll: el paneo termina con la última foto cortada. Usa `100cqw` |
| No poner `.reveal` en el primer viewport | El hero ocupa la primera pantalla: el bloque quedaría invisible en el primer pintado |
| No declarar `opacity: 0` fuera de `@supports` | En un navegador sin scroll-timelines el contenido no se vería nunca |
| No hardcodear hex ni `bg-[#...]` | Rompe el sistema de tokens |
| No escribir texto visible sin `t()` | Rompe ES/EN y el checker i18n |
| No añadir claves i18n a un solo diccionario | `npm run i18n:check` falla |
| No usar placeholders ni imágenes de IA | Credibilidad operacional |
| No subir los maestros de 504 MB a git | Repo inflado, deploy lento |
| No crear páginas sin añadirla al sitemap | Astro lo hace solo si está en `src/pages/` |
| No borrar los alias de anclas legacy | Rompe enlaces externos |
| No eliminar `prefers-reduced-motion` | Accesibilidad |
| No usar Poppins/Roboto/Montserrat | No está en el sistema tipográfico |
| No reintroducir el patrón de plantilla (chips, eyebrow por sección, cajas, flecha universal) | Ver §10, es la lista anti-slop |
| No alinear a la derecha ni centrar el contenido declarativo | Rompe la retícula editorial |
| No inventar cifras, fechas, códigos ni autoridades | Los hechos vienen de la fuente primaria |
