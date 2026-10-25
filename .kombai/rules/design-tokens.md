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

**Contraste:** emerald sobre deep 4.7:1 ✓ · blanco sobre deep 13.6:1 ✓ ·
ink sobre mist 15.2:1 ✓ · **emerald sobre blanco 3.1:1 ✗** → el emerald nunca es
texto pequeño sobre blanco. Solo bordes, iconos grandes o badge con `text-cargo-ink`.

**Ritmo de superficies:** alterna `deep → white → mist → light → ink`. Nunca dos
secciones seguidas con el mismo fondo.

## Tipografía

- **Inter** 300–800 para toda la interfaz y el cuerpo. **JetBrains Mono** 400–600 para
  cifras, etiquetas y códigos (AWB, ULD, GPU, RAV 111).
- Prohibido Poppins, Roboto, Montserrat, Lato, Open Sans.

| Uso | Clase |
|---|---|
| H1 hero | `text-5xl`–`text-7xl` · `font-semibold` · `leading-[1.02]` · `tracking-[-0.045em]` |
| H2 sección | `text-3xl`–`text-4xl` · `font-semibold` · `leading-[1.05]` · `tracking-[-0.04em]` |
| H3 tarjeta | `text-xl`–`text-2xl` · `tracking-[-0.025em]` |
| Cuerpo | `text-base` · `leading-relaxed` |
| Lead / secundario | `text-lg` / `text-sm` |
| Etiqueta | `font-mono text-xs uppercase tracking-[0.12em]` |
| Cifra | `font-mono text-3xl`–`text-4xl` `tracking-[-0.05em]` |

- `text-balance` en titulares de 2+ líneas.
- Ancho de línea 60–72 caracteres: `max-w-xl` en titulares, `max-w-2xl` en párrafos.
- Nunca justificar. Nunca `font-light` en texto de interfaz pequeño.

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
