# Design tokens — JMC Handling

Única fuente de verdad de color, tipografía, espaciado y movimiento.
El sistema completo está en `DESIGN.md` (léelo antes de maquetar).

## Color — solo estos 6 tokens

| Clase Tailwind | Hex | Uso |
|---|---|---|
| `bg-cargo-deep` / `text-cargo-deep` | `#0F3E51` | Fondo de marca, header, hero, secciones profundas |
| `bg-cargo-light` / `text-cargo-light` | `#A0DDF5` | Acento claro, texto sobre deep |
| `bg-cargo-emerald` / `text-cargo-emerald` | `#5BA8C7` | Acción, badges, foco, bordes de acento |
| `bg-cargo-ink` / `text-cargo-ink` | `#0A1F2B` | Texto sobre claro, footer |
| `bg-cargo-mist` / `text-cargo-mist` | `#F5F8FA` | Superficie clara alterna |
| `bg-cargo-white` / `text-cargo-white` | `#FFFFFF` | Texto inverso, tarjetas |

**Prohibido:** `bg-[#0F3E51]`, `#fff`, `rgb(...)`, cualquier color fuera de la tabla.
La opacidad sí se permite: `text-cargo-white/80`, `border-cargo-deep/15`.

**Contraste (valores medidos sobre el token real):**

| fg | bg | ratio | uso |
|---|---|---|---|
| `cargo-white` | `cargo-deep` | 11.49:1 | texto sobre fondo de marca |
| `cargo-white` | `cargo-ink` | 16.88:1 | texto sobre footer |
| `cargo-light` | `cargo-deep` | 7.74:1 | etiquetas y acentos sobre oscuro |
| `cargo-light` | `cargo-ink` | 11.38:1 | etiquetas sobre ink |
| `cargo-deep` | `cargo-white` | 11.49:1 | texto y etiquetas sobre claro |
| `cargo-deep` | `cargo-mist` | 10.77:1 | texto sobre superficie alterna |
| `cargo-deep` | `cargo-light` | 7.74:1 | texto sobre banda clara |
| `cargo-emerald` | `cargo-deep` | **4.31:1 — NO como texto pequeño** | solo borde y decoración |
| `cargo-emerald` | `cargo-white` | **2.67:1 — NO como texto** | solo borde y decoración |

`cargo-emerald` queda reservado para bordes, subrayados, indicadores y
decoración. Para texto: `cargo-deep` sobre fondos claros, `cargo-light` sobre
fondos oscuros. Para etiquetas de sección, usar siempre `.eyebrow` +
`.eyebrow-on-light` / `.eyebrow-on-dark`.

**Ritmo de superficies:** alterna `deep → white → mist → light → ink`. Nunca dos
secciones seguidas con el mismo fondo.

## Tipografía

- **Inter** 300–800 para toda la interfaz y el cuerpo. **JetBrains Mono** 400–600 para
  cifras, etiquetas y códigos (AWB, ULD, GPU, RAV 111).
- Prohibido Poppins, Roboto, Montserrat, Lato, Open Sans.

### Escala por rol

Cada texto pertenece a **un** rol y cada rol tiene **un** tamaño. Las clases
están en `src/styles/global.css`. No inventes tamaños sueltos.

| Rol | Clase | Tamaño | Aplicar en |
|---|---|---|---|
| H1 hero | (fuera del sistema) | 36→72px · `leading-[1.02]` · `tracking-[-0.045em]` | solo `Hero.astro` |
| Titular de sección | `.type-h2` | 30→36px · `font-semibold` · `tracking-[-0.04em]` | H2 de cada sección |
| Titular de tarjeta | `.type-h3` | 18→20px · `font-semibold` · `tracking-[-0.025em]` | H3 de tarjetas y columnas |
| Párrafo introductorio | `.type-lead` | 16→18px · `leading-relaxed` | lead de sección |
| Cuerpo de lectura | `.type-body` | 16px · `leading-relaxed` | descripciones de tarjeta y párrafos |
| Texto de apoyo | `.type-meta` | 14px · `leading-relaxed` | captions, pies, notas |
| Etiqueta | `.eyebrow` + variante | 12px mono uppercase `tracking-[0.12em]` | etiqueta superior de sección |
| Cifra | `.type-figure` | 30→36px mono · `tracking-[-0.05em]` | años, métricas |

**Regla dura:** ningún `<h3>` puede renderizar más pequeño que el párrafo que
lo acompaña. Si el titular queda por debajo del cuerpo, sube el titular.

**Orden canónico de sección:** `eyebrow → H2 → lead → contenido → apoyo`.
El eyebrow abre siempre; nunca va después del bloque que introduce.

- `text-balance` en titulares de 2+ líneas.
- Ancho de línea 60–72 caracteres: `max-w-xl` en titulares, `max-w-2xl` en párrafos.
- Nunca justificar. Nunca `font-light` en texto de interfaz pequeño.

## Credenciales

- **El documento de certificación no se muestra en la home.** Se declara la
  credencial y el documento queda a un clic.
- `src/components/ui/Credential.astro` es el formato único:
  código mono en `cargo-light` con punto `cargo-emerald` → título → separador
  `border-cargo-white/15` → emisor → vigencia (mono 12px) → link de evidencia.
- `src/data/credentials.ts` es la lista. Los hechos (código, emisor, vigencia)
  vienen de la fuente primaria: el certificado CESEA-021 emitido por el INAC.
- La evidencia abre en pestaña nueva con `rel="noopener noreferrer"`.
- Grid `sm:grid-cols-2`. Borde `border-cargo-white/15`, fondo
  `bg-cargo-white/[0.04]`, hover `border-cargo-emerald/50`.

## Espaciado, radio, bordes

- Contenedor: `.container-max` (`max-w-7xl`). En canvas, `max-w-[1320px] px-8 xl:px-12`.
- Sección: `.section-pad` (`py-20 md:py-28`); `py-28 md:py-40` solo para el CTA final.
- Saltos internos: escala Tailwind de 2 (8 px) a 12 (48 px).
- Radio: **`rounded-sm` es la norma** (marca industrial). `rounded-full` solo para
  indicadores y píldoras.
- Bordes: `border border-cargo-deep/15` en claro · `border-cargo-white/15` en deep.
- **Sin sombras difusas.** La profundidad se construye con bordes y superficies.

## Movimiento

| Patrón | Duración | Curva |
|---|---|---|
| Hover de color | 200 ms | `transition-colors` |
| Hover de imagen | 500 ms | `ease-out` + `group-hover:scale-[1.03]` |
| Entrada | 600 ms | `cubic-bezier(0.16, 1, 0.3, 1)` (`.animate-fade-up`) |
| Aparición | 400 ms | `ease-out` (`.animate-fade-in`) |

Toda animación debe quedar anulada bajo `prefers-reduced-motion` (el bloque global en
`src/styles/global.css` ya lo hace; añade `motion-reduce:transform-none` si creas una).
Nada de `animate-pulse`, `animate-bounce` ni parallax agresivo.
