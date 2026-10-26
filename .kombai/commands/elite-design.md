# /elite-design — Sistema visual y jerarquía de autoridad

Eleva la percepción de autoridad, limpieza y escala del sitio **sin tocar la
arquitectura, la navegación ni el copy**. El objetivo es que cada sección se
lea como una declaración, no como un bloque de texto.

**Precondición:** lee `PROMPT-MAESTRO.md`, `rules/design-tokens.md` y
`DESIGN.md` antes de tocar nada. Los tres son la fuente de verdad; este
comando solo los aplica.

---

## 1. Escala tipográfica por rol

No inventes tamaños. Cada texto de la interfaz pertenece a **un** rol, y cada
rol tiene **un** tamaño. Las clases viven en `src/styles/global.css`:

| Rol | Clase | Tamaño | Aplicar en |
|---|---|---|---|
| H1 hero | (fuera del sistema) | 36→72px `leading-[1.02]` `tracking-[-0.045em]` | solo `Hero.astro` |
| Titular de seccion | `.type-h2` | 30→36px `font-semibold` `tracking-[-0.04em]` | H2 de cada seccion |
| Titular de tarjeta | `.type-h3` | 18→20px `font-semibold` `tracking-[-0.025em]` | H3 de tarjetas y columnas |
| Parrafo introductorio | `.type-lead` | 16→18px `leading-relaxed` | lead de seccion, subtexto de hero |
| Cuerpo de lectura | `.type-body` | 16px `leading-relaxed` | descripciones de tarjeta y parrafos |
| Texto de apoyo | `.type-meta` | 14px `leading-relaxed` | captions, pies, notas, listas secundarias |
| Etiqueta | `.eyebrow` + `.eyebrow-on-light` / `.eyebrow-on-dark` | 12px mono uppercase | etiqueta **informativa** de seccion |
| Indice de bloque | `IndexLabel.astro` | 12px mono | numero `01`-`05` en el margen |
| Rotulo de dato | `Label.astro` | 12px mono | rotulo de campo o de fila |
| Cifra | `.type-figure` | 30→36px mono | anios, metricas, codigos destacados |

### Regla dura del sistema

> **Ningun `<h3>` puede renderizar mas pequeno que el parrafo que lo acompaña.**

Si un titular queda por debajo del cuerpo, el problema es el titular, no el
cuerpo. Sube el titular; nunca bajes el texto de lectura.

### Orden canonico de cada seccion

```
H2  ->  lead  ->  [contenido]  ->  apoyo
```

La etiqueta `.eyebrow` **no es obligatoria**: usala solo cuando aporte
informacion (tipo de contenido, estandar, estacion). Repetirla en todas las
secciones es ruido de plantilla y por eso esta prohibida.

### Numeracion

Un solo sistema de bloque (`01`, `02`...) en el margen, con el mismo ritmo en
servicios, equipos, seguridad y contacto. Nunca numeres ad hoc ("01 .", "1.").

---

## 1b. Anti-slop (direccion suiza / editorial tecnico)

Retícula de 12 columnas asimetrica, reglas horizontales, aire, tipografia
fuerte, metadatos en mono. Prohibido:

- Etiqueta decorativa repetida en cada seccion.
- Chips, piloras y muros de valores (`+30 anos . CESEA . 24/7`).
- Flecha universal `↗` en todo enlace: una sola, solo en CTA primarios, SVG inline.
- CTA escritos a mano: todo pasa por `Button.astro` / `ActionLink.astro`.
- Frases de efecto ("La seguridad no se declara. Se opera.").
- Imperativos de plantilla ("Explore nuestras capacidades").
- Tarjetas con sombra + radio + fondo propio.
- `text-center` en secciones de contenido.
- Muros de texto unidos por `;`.
- El mismo CTA repetido tres veces en una pagina.
- Icono + etiqueta redundantes.

---

## 1c. Movimiento (CSS scroll-driven, 0 kB)

El sitio no usa librerias de animacion. Todo el movimiento por scroll es CSS
nativo (`animation-timeline`, `view-timeline-name`, `animation-range`), con
degradacion segura: **el estado "oculto" solo se declara dentro de
`@supports`**, de modo que un navegador sin soporte nunca deja contenido en
`opacity: 0`.

| Clase | Efecto | Timeline / rango |
|---|---|---|
| `.reveal` | entrada con desplazamiento | `view()` + `entry 0%` → `entry 100%` |
| `.parallax` / `.parallax-media` | paneo lento de la foto | `view-timeline-name: --jmc-parallax` + `cover 0%` → `cover 100%` |
| `.header-overlay` | header solido al hacer scroll | `scroll(root block)` + `0` → `120px` |
| `.scroll-progress` | barra de lectura | `scroll(root block)` |

Reglas:

- `.reveal` solo en bloques **por debajo del fold**. El hero ocupa la primera
  pantalla: un `.reveal` alli quedaria invisible en el primer pintado.
- `prefers-reduced-motion` desconecta las animaciones por completo
  (`animation: none`, `timeline: none`) y convierte la cinta de aliados en una
  fila desplazable con `snap`.

---

## 2. Formato de credenciales

**No muestres el documento de certificacion en la home.** Un escaneo vertical
en grayscale con sello ocupa mas espacio que la propia declaracion de
autoridad y hace que la empresa parezca una tramitadora en vez de una elite
operacional.

Las credenciales se **declaran**, el documento se **consulta bajo demanda**.

### En la home: formato de airlines (pregunta → respuesta)

La seccion de seguridad se lee como un **Q&A operativo**, no como una ficha
administrativa. Cada credencial es una fila de `<dl>`:

```
pregunta   (16px, cargo-white)   "¿Que habilita la credencial CESEA-021?"
---------
respuesta  (16px, cargo-white/85)
linea mono (12px)  "CESEA-021 . INAC . hasta 16/08/2027"
```

- La **pregunta** va en el idioma del lector, no el nombre del certificado.
- La **respuesta** explica el alcance operativo en una frase.
- La **linea mono** lleva los datos verificables: codigo, emisor, vigencia.
- Sin chips, sin muros de valores, sin iconos redundantes.

### Componente

`src/components/ui/Credential.astro` — ya existe. No lo reescribas sin
motivo; ajusta lo que la seccion necesite.

```
codigo (mono, cargo-light, 20-24px, con punto emerald)
titulo de la credencial (16px, cargo-white)
------------------------------------------------------------------------
emisor (14px, cargo-white/75)
vigencia (12px mono, cargo-light/90)   [opcional]
Ver documento original (icono SVG)   [solo si hay evidencia]
```

### Datos

`src/data/credentials.ts` — la lista y las claves i18n. Los hechos vienen de
la fuente primaria (el certificado CESEA-021 del INAC), no de invencion:

| Codigo | Que es | Emisor | Vigencia |
|---|---|---|---|
| CESEA-021 | Explotador de Servicios Especializados Aeroportuarios | INAC | hasta 16/08/2027 |
| RAV 111 | Regulación Aeronáutica Venezolana 111 | Autoridad Aeronáutica Civil | permanente |
| INAC | Explotador certificado de servicios en plataforma | Gerencia General de Seguridad Aeronáutica | — |
| SMS | Safety Management System | Capacitación y seguimiento de procesos | — |

**No agregues ni quites credenciales sin verificarlas en el documento.** Si
necesitas una nueva, lee la fuente primero y confirma con el negocio.

### Evidencia

El link a `cert-cesea-1280.webp` abre en pestaña nueva con
`rel="noopener noreferrer"`. Es la unica forma en que el documento debe
aparecer en la home.

---

## 3. Reglas de superficie

- Alterna fondos: `ink (hero) -> mist (indice) -> white (aliados) -> mist
  (servicios) -> white (equipos) -> mist (operacion) -> deep (seguridad) ->
  white (cierre)`. **Nunca dos secciones seguidas con el mismo fondo.**
- Bordes, no sombras. La profundidad se construye con `border-cargo-white/15`
  en oscuro y `border-cargo-deep/15` en claro.
- `rounded-sm` es la norma. `rounded-full` solo para indicadores.
- Sin gradientes decorativos salvo el scrim del hero.
- La retícula base es `.grid-12` (4/8/12 columnas). Compón con `col-span-*` y
  `col-start-*`: contenido declarativo a la izquierda, foto o dato técnico a
  la derecha.

---

## 4. Alcance

Por defecto, solo:

- `src/components/home/*.astro`
- `src/components/pages/*.astro`
- `src/components/contact/*.astro`
- `src/components/ui/*.astro`
- `src/pages/{es,en}/*.astro`
- `src/styles/global.css`

**No tocar** `src/layouts/`, `src/i18n/utils.ts`, `astro.config.mjs`,
`scripts/` ni `vercel.json` sin pedirlo.

Si el cambio requiere copy nuevo, **no lo escribas**: reporta que falta la
clave y de donde sale (documento de marca, certificado, web del cliente).

---

## 5. Restricciones

Se aplican **todas** las restricciones duras del `PROMPT-MAESTRO.md`.
Ademas, en este comando:

- **0 kB de JS de framework.** Nada de islas, nada de librerias. CSS-first:
  el movimiento por scroll es CSS nativo (ver 1c). El unico JS permitido es un
  `<script is:inline>` minimo y local (por ejemplo, abrir el acordeon por
  hash), siempre por debajo de 1 kB.
- **Solo tokens `cargo-*`.** Ni un hex, ni `rgb()`, ni `bg-[#...]`.
- **Contraste AA obligatorio.** `cargo-emerald` nunca es color de texto
  (2.67:1 sobre blanco). Para texto: `cargo-deep` en claro, `cargo-light` en
  oscuro. Sobre fotografia, mide contra el pixel mas brillante de la zona.
- **No inventes hechos.** Fechas de vigencia, codigos y autoridades: todo
  viene de la fuente primaria.
- **No elimines los alias legacy** (`capacidades`, `equipos`, `empresa`,
  `seguridad`, `about`).
- **No dupliques contenido entre la home y una pagina interna.**
- Toda imagen con `alt` que describa lo visible, `width`/`height` y
  `loading="lazy"` (salvo hero).
- Formato: 2 espacios, LF, sin comillas dobles, sin punto y coma final en TS.

---

## 6. Gate

```bash
npm run verify && npm run lint
```

Ademas, antes de entregar:

1. `find dist -name "*.js" | wc -l` → debe dar **0**.
2. Recorre el sitio a 360 px: sin scroll horizontal, sin texto cortado.
3. Verifica el contraste del texto nuevo sobre su fondo real (no sobre el
   color de la seccion).
4. Revisa el orden de las secciones: `H2 -> lead -> contenido -> apoyo`.
5. Confirma que ningun `<h3>` quedo mas pequeno que su parrafo.
6. Repasa la lista anti-slop del punto 1b sobre el resultado.
7. Confirma que ningun `.reveal` quedo en el primer viewport (contenido
   invisible en el primer pintado) y que `prefers-reduced-motion` degrada bien
   la cinta de aliados.

---

## 7. Formato del reporte

```
archivos modificados   lista con archivo:linea y que cambio
roles tipograficos     que rol se aplico en cada seccion
credenciales           listado final y de donde sale cada dato
contraste              verificaciones realizadas y resultado
payload                kB de JS, kB de CSS
gate                   resultado de verify y lint
pendientes             lo que requiere decision del cliente
```

Se explicito. No declares "listo" con un fallo abierto.
