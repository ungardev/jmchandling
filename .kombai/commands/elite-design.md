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
| Etiqueta | `.eyebrow` + `.eyebrow-on-light` / `.eyebrow-on-dark` | 12px mono uppercase | etiqueta superior de seccion |
| Cifra | `.type-figure` | 30→36px mono | anios, metricas, codigos destacados |

### Regla dura del sistema

> **Ningun `<h3>` puede renderizar mas pequeno que el parrafo que lo acompaña.**

Si un titular queda por debajo del cuerpo, el problema es el titular, no el
cuerpo. Sube el titular; nunca bajes el texto de lectura.

### Orden canonico de cada seccion

```
eyebrow  ->  H2  ->  lead  ->  [contenido]  ->  apoyo
```

El eyebrow **abre** la seccion. Nunca aparece despues del contenido que
introduce. Si en una seccion el eyebrow esta debajo del bloque de badges o
del parrafo introductorio, es un bug de orden: reordena.

---

## 2. Formato de credenciales

**No muestres el documento de certificacion en la home.** Un escaneo vertical
en grayscale con sello ocupa mas espacio que la propia declaracion de
autoridad y hace que la empresa parezca una tramitadora en vez de una elite
operacional.

Las credenciales se **declaran**, el documento se **consulta bajo demanda**.

### Componente

`src/components/ui/Credential.astro` — ya existe. No lo reescribas sin
motivo; ajusta lo que la seccion necesite.

```
codigo (mono, cargo-light, 20-24px, con punto emerald)
titulo de la credencial (16px, cargo-white)
------------------------------------------------------------------------
emisor (14px, cargo-white/75)
vigencia (12px mono, cargo-light/90)   [opcional]
Ver documento original ↗               [solo si hay evidencia]
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

- Alterna fondos: `deep -> white -> mist -> cargo-light -> cargo-ink`.
  **Nunca dos secciones seguidas con el mismo fondo.**
- Bordes, no sombras. La profundidad se construye con `border-cargo-white/15`
  en oscuro y `border-cargo-deep/15` en claro.
- `rounded-sm` es la norma. `rounded-full` solo para indicadores.
- Sin gradientes decorativos salvo el scrim del hero.

---

## 4. Alcance

Por defecto, solo:

- `src/components/home/*.astro`
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

- **0 kB de JS.** Nada de framework, nada de islas. CSS-first.
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
4. Revisa el orden de las secciones: el eyebrow abre siempre.
5. Confirma que ningun `<h3>` quedo mas pequeno que su parrafo.

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
