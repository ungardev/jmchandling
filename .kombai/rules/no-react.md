# Cero JavaScript de framework — JMC Handling

## La regla

> **No React. No Vue. No Svelte. No Preact. No islas `client:*`.**
> Presupuesto: **≤ 10 kB gzip de JS por página**. El sitio hoy envía **0 kB**.

`@astrojs/react` fue eliminado del proyecto a propósito. `astro.config.mjs` ya no
registra ninguna integración de framework. **No la vuelvas a añadir.**

## Por qué

La ventaja competitiva del sitio es precisamente su peso: 0 kB de JS frente a los
~500 kB de la competencia (Bootstrap + jQuery + Mobirise + Embla + Parallax +
YouTube + CommonNinja). Un solo carousel en React anula esa ventaja.

## Cómo resolver la interactividad

| Necesidad | Solución correcta |
|---|---|
| Menú móvil | `<script>` vanilla inline (ya existe en `Header.astro`) |
| Marquee de logos | CSS `@keyframes` con `translateX` + `prefers-reduced-motion` |
| Galería horizontal | CSS `overflow-x-auto` + `scroll-snap-align` |
| Acordeón / FAQ | `<details>` / `<summary>` nativo |
| Tooltip | CSS `:hover` / `:focus-within` |
| Formulario | HTML nativo + FormSubmit.co |
| Barra de progreso | `position: sticky` + `scroll-timeline` (o `IntersectionObserver` vanilla) |

Si de verdad necesitas lógica, escribe un `<script>` vanilla pequeño, sin framework,
y justifícalo.

## Reglas de script

- Un `<script>` sin `is:inline` **solo** si necesita bundling (imports, TypeScript).
- Para lógica de página, `<script is:inline>` dentro del componente.
- Sin `document.write`, sin librerías de terceros, sin analytics sin consentir.
- Todo `<script>` debe ser *progressive enhancement*: la página debe funcionar sin él.

## Antes de dar por terminado

```bash
npm run build
find dist -name "*.js" -printf "%s %p\n" | sort -rn
```

Si aparece un `.js` con framework, algo se coló. Verifícalo también con:

```bash
grep -rl "react\|preact\|vue\|svelte" dist/_assets/ || echo "0 framework JS ✓"
```
