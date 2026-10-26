# PROMPT MAESTRO — Kombai AI (JMC Handling)

> Copia **todo** el bloque de abajo en Kombai AI y ejecútalo una vez por comando.
> Los 4 comandos son independientes: cada uno reporta y deja el repo en un
> estado verificable. No ejecutes `/audit-design` hasta que `/improve-ui`
> termine.

---

## CONTEXTO DEL PROYECTO

**Cliente:** Servicios Especializados JMC, C.A. (JMC Handling) — empresa
venezolana de servicios aeroportuarios en el Aeropuerto Internacional Simón
Bolívar, Maiquetía (CCS). Constituida 2012, operando en Maiquetía desde 2015.

**Stack:** Astro 5 (`output: 'static'`), Tailwind CSS 3.4, TypeScript 5.7.
Sin frameworks de UI (React/Vue/Svelte eliminados a propósito).

**Idiomas:** ES (principal) y EN. Rutas con prefijo: `/es/...` y `/en/...`.
Los árboles de `src/i18n/es.json` y `src/i18n/en.json` deben ser **idénticos**.

**PAGES reales (11 en total):**
`/` (redirect 302 → `/es/`) · `/es/` `/en/` (home) · `/es/contacto` `/en/contact`
· `/es/sobre-jmc` `/en/about-jmc` · 4 stubs de redirect 301
(`/es/servicios` `/en/services` `/es/cotizacion` `/en/quote`).

**Componentes home (en orden):**
`Hero` → `AlliesStrip` → `ServiceAccordion` → `EquipmentGrid` →
`SafetySection` → `RequestPrompt`.

El bloque corporativo (misión, visión, valores, habilitación) vive en
`/es/sobre-jmc` y `/en/about-jmc`. La home lo **enlaza**, no lo repite.

---

## RESTRICCIONES DURAS (no negociables — el comando debe respetarlas)

### Arquitectura
1. **Cero `client:*`.** Ni una sola isla de framework. Cero JS de framework.
2. **Presupuesto de JS: ≤ 10 kB gzip por página.** El sitio actual envía **0 kB**.
   Cualquier JS nuevo debe justificarse; prefiere CSS-first o `<script is:inline>`
   pequeño.
3. **No reintroducir** React/Vue/Svelte/Alpine ni dependencias de UI.
4. **No tocar** `scripts/optimize-assets.mjs`, `scripts/media-map.json` ni
   `src/data/media.generated.ts` (generado). Si falta un asset, repórtalo.
5. **No tocar** `astro.config.mjs` (`output: 'static'` es requisito de despliegue).
6. **No crear páginas nuevas** sin actualizar sitemap + `ROUTE_SLUGS` en
   `src/i18n/utils.ts` + `vercel.json` + `AGENTS.md`.

### Diseño
7. **Solo tokens `cargo-*`:** `cargo-deep` `#0F3E51` · `cargo-light` `#A0DDF5` ·
   `cargo-emerald` `#5BA8C7` · `cargo-ink` `#0A1F2B` · `cargo-mist` `#F5F8FA` ·
   `cargo-white` `#FFFFFF`. **Nunca hardcodear hex.** Ni en HTML, ni en
   Tailwind (`bg-[#0F3E51]` está prohibido), ni en `<style>`.
8. **Fuentes:** solo Inter (300–800) y JetBrains Mono (400–600). Nada de Poppins,
   Roboto, Montserrat. **No añadir** Google Fonts nuevas ni preconnect extras.
9. **No usar `@apply`** en estilos scoped de componentes. Usar utilidades.
10. No usar `!important` salvo para overrides de accesibilidad.
11. No inventes valores arbitrarios de spacing/color fuera de la escala Tailwind
    existente y de los tokens.

### i18n
12. **Todo el copy vía `t('clave')`.** Cero literales de español/inglés en
    componentes `.astro`.
13. **Cada clave nueva va en `es.json` Y `en.json`.** Árboles idénticos, mismo orden.
14. **No inventar copy.** Si falta contenido, usa solo lo que existe en
    `docs/Brochure 2 JMC.pdf` y `docs/Funciones_Equipos_Aeropuerto.pdf`, o propón
    la clave y **pide aprobación** antes de escribirla.
15. Claves de arrays: `getLocalizedArray(locale, 'ns.key')`.

### Accesibilidad (WCAG 2.1 AA)
16. Todo `<img>` con `alt` (decorativas: `alt=""` + `aria-hidden="true"`), y con
    `width`/`height` (sin layout shift).
17. `alt` describe **lo visible en la foto**, no lo idealizado. Verifica la foto
    antes de escribir el alt.
18. Todo elemento interactivo alcanzable por teclado. `focus-visible` con
    `outline: 2px solid var(--color-cargo-deep)` (ya global). `cargo-emerald`
    no: 2.67:1 sobre blanco y 2.50:1 sobre mist, bajo el 3:1 de WCAG 1.4.11.
19. `aria-label` en botones solo-icono. `aria-current="page"` en nav.
20. **No eliminar** el bloque `prefers-reduced-motion` de `global.css`.
21. Contraste ≥ 4.5:1 en texto normal, ≥ 3:1 en texto grande y bordes.
    **`cargo-emerald` nunca es color de texto**: 2.67:1 sobre blanco y 4.31:1
    sobre `cargo-deep` — ambos por debajo de AA. Es borde, subrayado y
    decoración. Para texto usa `cargo-deep` (fondos claros) o `cargo-light`
    (fondos oscuros). Para etiquetas de sección usa siempre el token
    `.eyebrow` + `.eyebrow-on-light` / `.eyebrow-on-dark`.
22. Targets táctiles ≥ 44×44 px en móvil.
22b. Sobre fotografía, el contraste se mide contra el **píxel más brillante**
    de la zona del texto, no contra un color medio. Si el scrim no basta,
    sube la opacidad del overlay o ponle fondo propio al bloque de texto.

### Fotografía y medios
23. **Solo fotografía real.** Nunca placeholders, nunca IA
    (`media-raw/_quarantine/` está prohibido).
24. **Nunca reutilizar una foto de rampa para ilustrar otra actividad.** No hay
    fotos de limpieza interior de aeronaves, servicio a pasajeros ni taller; esas
    familias usan sus fotos legacy (`family-aircraft-care`,
    `family-passenger-services`, `family-gse-maintenance`).
25. No inventar logos de aliados. Logos disponibles: Copa, Iberia, Laser,
    Avior, Aerotur, Estelar.
25b. El `viewBox` de los SVG de aliados debe estar **recortado al ink**: hay
    exports que traían 70-85% de canvas vacío y el logo se renderizaba a una
    fracción de su caja. Si ajustas el `viewBox`, ajusta también `width` /
    `height` del `<svg>` para no romper la proporción.
25c. El tamaño en la franja se define en `src/data/allies.ts` por **peso
    óptico** (`displayHeight`), no por altura uniforme: los lockups con
    símbolo necesitan más alto para que su wordmark iguale en altura de
    letra a los wordmarks de una línea.
25d. Un wordmark dibujado con `<text>` y una fuente web es frágil (un SVG en
    `<img>` no puede cargar Google Fonts). Conviértelo a paths.
26. Toda imagen nueva: `srcset` + `sizes` + `width`/`height` + `loading="lazy"`
    (salvo hero: `eager` + `fetchpriority="high"`).

### Anclas y enlaces
27. **IDs de sección estables en ambos idiomas:** `#services` `#equipment`
    `#allies` `#safety`.
28. **Alias legacy que nunca deben borrarse:** `capacidades` `equipos`
    `seguridad` `empresa` `about`. Los dos últimos ya no apuntan a una
    sección de la home (el bloque corporativo vive en `/es/sobre-jmc` y
    `/en/about-jmc`): se mantienen como spans ocultos para que los deep
    links antiguos sigan resolviendo.
28b. **No dupliques contenido entre la home y una página interna.** Si un
    bloque corporativo aparece completo en una página dedicada, la home lo
    enlaza, no lo repite.
29. Deep links que deben resolver: `#ramp-gse` `#aircraft-care`
    `#fbo-operations` `#passenger-services` `#gse-maintenance`, y
    `#equipment-carrucha` `#equipment-tractor` `#equipment-tractorService`
    `#equipment-water` `#equipment-belt` `#equipment-gpu`.
    Se **leen**, nunca se escriben: el acordeón abre el panel que coincide con
    `location.hash`, pero no pone el fragmento en la URL al hacer clic (si lo
    hiciera, el omnibox completaría esa URL al escribir el dominio y entrar al
    sitio abriría siempre un panel en vez de la home).
30. Los CTA de familia deben llevar `?service=<familyKey>` **directamente** a
    `/es/contacto` o `/en/contact` (nunca a través de un stub de redirect, que
    perdería la query).

### Jerarquía visual
30b. **Escala tipográfica por rol.** Cada texto pertenece a un rol y cada rol
     tiene un único tamaño: `.type-h2` (titular de sección), `.type-h3` (titular
     de tarjeta), `.type-lead` (lead), `.type-body` (cuerpo), `.type-meta`
     (apoyo), `.type-figure` (cifra), `.eyebrow` (etiqueta). No inventes
     tamaños sueltos.
30c. **Ningún `<h3>` puede renderizar más pequeño que el párrafo que lo
     acompaña.** Si el titular queda por debajo del cuerpo, sube el titular.
30d. **Orden canónico de sección:** `eyebrow → H2 → lead → contenido → apoyo`.
     El eyebrow abre siempre; nunca aparece después del bloque que introduce.
30e. **Las credenciales se declaran, el documento se consulta.** El certificado
     CESEA-021 no se muestra en la home: credenciales en
     `src/components/ui/Credential.astro`, evidencia a un clic en pestaña
     nueva. Un documento grayscale con sello baja la percepción de marca.

### Gate
31. Antes de entregar, debe pasar:
    `npm run verify && npm run lint`
    (`verify` = `i18n:check` + `astro check` + `build` + `check:links`).
32. Si un comando no puede cumplir una restricción, **no lo fuerces**: repórtalo
    y propón la alternativa.

---

# COMANDO 1 — `/improve-ui`

**Objetivo:** elevar la calidad visual y el ritmo de la home **sin** tocar la
estructura de información ni el copy.

## Alcance
`src/components/home/*.astro` (Hero, AlliesStrip, ServiceAccordion,
EquipmentGrid, SafetySection, RequestPrompt) y
`src/styles/global.css`.

**La home ya no tiene sección "About"**: el bloque corporativo vive en
`/es/sobre-jmc` y `/en/about-jmc`. Si necesitas contenido de empresa en la
home, **enlaza** a esa página; no lo repitas.

## Hero (punto de partida, no rehacer)
- **Una sola foto**, sin carrusel. Asset: `heroGseRamp` (art-directed:
  `sets.wide` 16:9 desktop, `sets.tall` 4:5 móvil), consumido con `<picture>`.
- La foto **ya es el fondo** de la sección (`absolute inset-0 -z-10`), con
  gradientes `cargo-ink` superpuestos: uno vertical
  (`from-cargo-ink/80 via-cargo-ink/40 to-transparent`) y otro horizontal
  (`from-cargo-ink/95 via-cargo-ink/70 to-cargo-ink/25`), más una **banda
  superior** `bg-gradient-to-b from-cargo-ink/80 via-cargo-ink/40 to-transparent`
  que sostiene el header fijo superpuesto.
- El texto ocupa el **tercio izquierdo**; contraste medido **≥ 5.04:1** en el
  píxel más desfavorable de cada zona (incluye la banda superior).
- La sección ocupa **una pantalla completa**: `.hero-full` (`100vh` + `100svh`).
  El header va **superpuesto** (`<Header overlay />`) y se vuelve sólido al
  hacer scroll.
- H1 único, `text-balance`, escala `text-4xl` → `xl:text-7xl`.
- `figcaption` como banda inferior con `bg-cargo-ink/85` propio (el gradiente
  horizontal no cubre la esquina inferior derecha).
- **Objetivo:** refinar espaciado vertical, ritmo tipográfico y peso de la
  jerarquía visual. **No** cambiar a grid de 2 columnas. **No** añadir carrusel.
  **No** cambiar el encuadre de la foto.

## Equipo (grid de 6 + CTA)
- 6 tarjetas fotográficas + 1 **card CTA** para ASU (no hay foto de ASU: no la
  inventes). Grid `sm:grid-cols-2 lg:grid-cols-4`.
- Cada `<li>` con `id="equipment-<key>"` estable.
- Fotos en `aspect-[4/5]`, `object-cover`, zoom de hover `scale-[1.03]` con
  `motion-reduce:transition-none`.

## Servicios
- 5 familias en un acordeón nativo `<details>` (0 kB, teclado, indexable). El
  primero abre por defecto.
- Cada `<details>` con `id={family.key}` y `IndexLabel` 01–05.

## Aliados
- **Cinta horizontal en movimiento** (no carrusel, no muro estático). Los 6
  SVG/WebP de `public/assets/allies/` tienen el `viewBox` **recortado al ink**
  (≥96% de ocupación) y el wordmark de Aerotur está **convertido a paths**
  (sin dependencia de fuentes web).
- El tamaño se define en `src/data/allies.ts` por **peso óptico**
  (`displayHeight`), no por altura uniforme. No cambies `displayHeight` sin
  volver a simular la cinta: si igualas la altura total, los textos salen con
  tamaños muy distintos (la diferencia llega a 2x entre Copa y Estelar).
- La cinta es **CSS puro, 0 kB de JS**. Dos listados idénticos con el mismo
  keyframe; el segundo queda una vuelta por delante. La pausa por `:hover` y
  `:focus-within` es obligatoria. La copia duplicada lleva `aria-hidden`, así
  que **no se cuelgan enlaces dentro de la cinta**.
- `align-items: flex-start` en `.ally-marquee-track`, nunca `center`: con
  `center` el margen se aplica a la mitad y las líneas de cap se separan.
- La sección tiene **un único titular**. Sin eyebrow, sin subtítulo, sin línea
  de manifiesto: el titular no cuenta los logos.
- **Pendiente de negocio:** el logo de Aerotur es un wordmark propio, no el
  logotipo oficial. Si el cliente entrega el original, reemplázalo — no lo
  inventes.

## Reglas de diseño
- Transiciones ≤ 500 ms, `ease-out`. Sin rebotes.
- Escala tipográfica: `text-xs` (12) · `text-sm` (14) · `text-base` (16) ·
  `text-lg` (18) · `text-xl` (20) · `text-2xl`–`text-6xl`.
- `tracking-[-0.02em]`–`[-0.045em]` en títulos grandes. Cero `letter-spacing`
  positivo salvo eyebrow mono (`tracking-[0.1em]`–`[0.16em]`).
- Bordes: `rounded-sm` máximo. Sin sombras difusas (`shadow-*` solo si hay
  borde definido).
- Aire: `gap-6` en grids internos, `gap-12`+`gap-16` entre secciones.
- `max-w` para texto: `max-w-xl` en lead, `max-w-2xl`/`max-w-3xl` en párrafos.

## Entrega
1. Lista de archivos modificados y qué cambió en cada uno, con `archivo:línea`.
2. Clases Tailwind nuevas introducidas (deben ser existentes o de la escala).
3. Copy nuevo: **ninguno**. Si quieres texto nuevo, propón la clave i18n ES+EN
   y espera aprobación.
4. Captura de los contrastes medidos si tocaste overlays.
5. Salida de `npm run verify && npm run lint`.

---

# COMANDO 2 — `/audit-design`

**Objetivo:** auditar el diseño completo del sitio (todas las páginas, no solo
la home) y entregar un informe priorizado **sin modificar código**.

## Alcance
`src/pages/{es,en}/*.astro`, `src/layouts/Layout.astro`,
`src/components/{global,ui,contact,services}/*.astro`, `src/styles/global.css`.

## Qué revisar
1. **Consistencia de tokens** — ¿algún hex, `bg-[#...]`, `text-gray-*`,
   `text-blue-*` o color fuera de `cargo-*`? Lista exacta con `archivo:línea`.
2. **Jerarquía tipográfica** — escala consistente, pesos, tracking, `text-balance`
   en titulares, tamaño de `lead` vs párrafo.
3. **Ritmo vertical** — padding de sección consistente (`section-pad` vs
   `py-16 md:py-20` vs `py-20 md:py-28`). Reportar divergencias.
4. **Consistencia de componentes UI** — `.btn-primary` / `.btn-secondary` /
   `.btn-ghost` de `global.css` vs botones escritos a mano en cada componente.
   Reportar duplicación.
5. **Estados de foco, hover, active, disabled** — ¿todos los interactivos los
   tienen? ¿el `:focus-visible` de 2px se ve sobre fondos oscuros y claros?
6. **Densidad y legibilidad** — longitud de párrafo, `leading-relaxed` vs
   `leading-normal`, medidas de línea (`max-w-*`) en párrafos largos.
7. **Consistencia de imágenes** — ratios (`aspect-*`), `object-position`,
   `sizes` coherentes, `loading` correcto, peso de los WebP.
8. **Sistema de espaciado** — ¿hay valores arbitrarios (`p-[13px]`, `mt-[2.5rem]`)
   que deberían ser de la escala?
9. **Responsive** — ¿qué se rompe o desborda a 360 px? Revisar cada sección.
10. **Impresión y modo de alto contraste** — nada que arreglar, solo noting.

## Formato del informe
Para cada hallazgo:
- **Severidad:** 🔴 bloqueante · 🟠 alto · 🟡 medio · 🔵 bajo
- **Ubicación:** `archivo:línea`
- **Qué pasa:** descripción concreta (no vaga)
- **Corrección propuesta:** diff o fragmento exacto a aplicar
- **Impacto:** rendimiento / a11y / conversión / mantenimiento

Ordena por severidad. Al final, un **plan de ejecución por fases** con los
hallazgos agrupados por archivo para minimizar conflictos.

## Entrega
Informe completo. **No** apliques cambios.

---

# COMANDO 3 — `/improve-accessibility`

**Objetivo:** llevar el sitio a WCAG 2.1 AA verificable, fixing de verdad.

## Alcance
Todo `src/`. Prioridad: `Header.astro`, `Footer.astro`, `QuoteForm.astro`,
`ContactInfo.astro`, `Layout.astro`, y todas las secciones home.

## Checklist (verifica cada una con evidencia)
1. ** landmarks** — `header`/`nav`/`main`/`footer` presentes y con etiqueta.
   `main` debe tener `id="main-content"` (el skip link apunta ahí).
2. **skip link** — visible al enfocar, con `outline` visible, destino existente.
3. **encabezados** — exactamente un `<h1>` por página, sin saltos de nivel
   (`h1 → h2 → h3`). Reporta y corrige.
4. **foco visible** — `:focus-visible` de 2px `cargo-deep` visible sobre
   fondos claros Y oscuros. Si un componente lo anula
   (`focus:outline-none focus:ring-1`), **corrígelo** (mínimo 2px).
5. **menú móvil** — `aria-expanded` refleja el estado, `aria-controls` apunta a
   un id existente, `Escape` cierra **solo si está abierto**, el foco vuelve al
   botón al cerrar, `aria-hidden` se sincroniza. Tab no se pierde fuera del panel.
6. **formulario** — cada campo con `<label for>`; errores con `aria-describedby`
   y `aria-invalid`; el foco va al primer inválido; el envío se bloquea si hay
   errores; mensajes de error no se comunican solo por color.
7. **imágenes** — `alt` presente, decorativas con `alt=""` + `aria-hidden`,
   `width`/`height` en todas, `loading="lazy"` salvo hero.
8. **enlaces** — texto de enlace descriptivo (no "haz clic aquí"), enlaces
   externos con `rel="noopener noreferrer"`, `target="_blank"` anunciado.
9. **color** — ningún texto depende solo del color; estados con icono o texto.
10. **zoom/reflow** — a 320 px y con zoom 200 % no hay scroll horizontal ni
    solapamiento. `overflow-x: hidden` en `html`/`body` es un parche: identifica
    la causa real si oculta contenido.
11. **movimiento** — respeta `prefers-reduced-motion`. Si añades animación,
    debe quedar anulada por el bloque global.
12. **idioma** — `<html lang>` correcto, enlaces de cambio de idioma con `lang` y
    `hreflang` coherentes.
13. **tiempo** — nada de auto-refresh, timeouts ni contenido que desaparezca.

## Verificación
Para cada corrección: qué se cambió, `archivo:línea`, y el criterio WCAG que
resuelve. Si no puedes verificar un punto en consola, dilo explícitamente.

## Entrega
1. Tabla de los 13 puntos: estado antes → estado después → evidencia.
2. Lista de correcciones con `archivo:línea`.
3. Teclado: recorrido completo esperado (Tab → Shift+Tab → Enter → Escape).
4. Salida de `npm run verify && npm run lint`.

---

# COMANDO 4 — `/improve-seo`

**Objetivo:** SEO técnico y datos estructurados correctos, sin inventar contenido.

## Estado actual (ya resuelto — verifica, no rehagas)
- Origen canónico único: `https://jmc-handling.com`.
- Sitemap con 7 URLs reales; los 4 stubs de redirect están **excluidos**.
- `hreflang` es/en/x-default correctos, con barra final en la home.
- JSON-LD: `Organization`, `LocalBusiness`, y dos `ItemList` de `Service`
  (5 familias + 8 servicios).
- `og:image` 1200×630, `og:image:width/height`, `twitter:card`,
  `twitter:site`, `twitter:creator`.

## Qué revisar y corregir
1. **Títulos y descripciones** — ≤ 60 y ≤ 155 caracteres. Hoy `meta.homeTitle`
   supera 60. Reescribe en ES y EN, añade `meta.*` nuevas si hacen falta
   (recuerda: **ambos** diccionario).
2. **Jerarquía de encabezados** y presencia de `main` landmarks.
3. **JSON-LD** — valida con el Rich Results Test:
   - `Organization`: `description` fija (no variable por página), `logo`,
     `sameAs`, `contactPoint`, `address`.
   - `LocalBusiness`: `openingHoursSpecification` (L–S 05:00–22:00 VET),
     `geo`, `priceRange`.
   - `Service`: cada uno con `name`, `description`, `provider`, `areaServed`,
     `url` que apunte a un ancla **real** de la home.
   - Añade `BreadcrumbList` en las páginas que no son home, y `WebSite` con
     `SearchAction` solo si es truthful (probablemente no lo sea → no lo añadas).
4. **Canonical y hreflang** — que apunten a URLs reales, sin doble barra, y que
   `x-default` apunte a la variante ES.
5. **Sitemap** — confirma que solo contiene las 7 páginas reales y que
   `robots.txt` apunta al origen canónico.
6. **Open Graph / Twitter** — que la imagen OG exista, sea 1200×630, y que el
   `alt` describa la imagen real.
7. **Enlazado interno** — que cada página enlace a las demás de forma útil y
   que ninguna quede huérfana.
8. **Datos NAP** — teléfono, dirección y horario consistentes en
   `Layout.astro`, `Footer.astro`, `ContactInfo.astro` y los JSON-LD.
9. **Performance como señal SEO** — LCP del hero: `preload` del WebP del hero,
   `fetchpriority="high"`, `decoding="async"`, sin CLS (`width`/`height`).
10. **`robots.txt`** — `Allow: /`, sin bloquear `/assets/`, `Sitemap:` canónico.
11. **Sin contenido inventado** — no añadas `FAQPage` con preguntas que la
    empresa no ha aprobado. Si lo proposes, márcalo como *pendiente de
    aprobación del cliente* y no lo escribas.

## Entrega
1. Tabla: elemento → valor actual → valor propuesto → motivo.
2. JSON-LD nuevo completo, listo para pegar, **válido** (JSON parseable).
3. Para cada clave i18n nueva: nombre, valor ES, valor EN.
4. Avisos de lo que **no** se puede corregir sin datos del cliente.
5. Salida de `npm run verify && npm run lint`.

---

# COMANDO 5 — `/elite-design`

**Objetivo:** elevar la percepción de autoridad y la escala tipografica del
sitio sin tocar arquitectura, navegacion ni copy. Cada seccion debe leerse
como una declaracion, no como un bloque de texto.

**Precondicion:** lee `rules/design-tokens.md` y `DESIGN.md`. El detalle
operativo esta en `.kombai/commands/elite-design.md`.

## Lo que gobierna este comando

1. **Escala por rol, no tamaños sueltos.** Cada texto pertenece a un rol
   (`.type-h2`, `.type-h3`, `.type-lead`, `.type-body`, `.type-meta`,
   `.type-figure`, `.eyebrow`) y cada rol tiene un unico tamaño.
2. **Ningun `<h3>` puede renderizar mas pequeno que su parrafo.** Si el titular
   queda por debajo del cuerpo, sube el titular.
3. **Orden canonico:** `eyebrow -> H2 -> lead -> contenido -> apoyo`. El
   eyebrow abre siempre.
4. **Las credenciales se declaran, el documento se consulta.** El certificado
   CESEA-021 no se muestra en la home: se declara la credencial y el link
   abre el original en pestana nueva. Formato unico:
   `src/components/ui/Credential.astro`, datos en `src/data/credentials.ts`.
5. **Los hechos vienen de la fuente primaria** (el certificado, el brochure).
   No inventes vigencias, codigos ni autoridades. Si falta un dato, reportalo
   como pendiente de negocio; no lo escribas.

## Alcance

`src/components/home/*.astro`, `src/components/contact/*.astro`,
`src/components/ui/*.astro`, `src/pages/{es,en}/*.astro` y
`src/styles/global.css`. Nada de `src/layouts/`, `astro.config.mjs`,
`scripts/` o `vercel.json` sin pedirlo.

## Gate

`npm run verify && npm run lint`, 0 kB de JS, y revision manual del orden de
seccion, del contraste real y del tamano relativo de cada titular.

---

## RESUMEN PARA EL USUARIO

Cada comando debe cerrar con un resumen ejecutivo de máximo 10 líneas:
qué cambió, qué mejoró mediblemente (no "se ve mejor" sino un número: contraste,
peso en KB, caracteres, nº de hallazgos), qué quedó pendiente y qué decisión
necesita del cliente.
