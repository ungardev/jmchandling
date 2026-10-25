# /verify — Verificación completa antes de entregar

Ejecuta la batería de verificación del proyecto y reporta. **No arregles cambios
de diseño; solo verifica.** Si algo falla, dilo con exactitud.

## Comandos

```bash
npm run i18n:check     # árboles ES/EN idénticos, sin claves inexistentes, altKey válidas
npm run check          # astro check — 0 errores, 0 warnings
npm run build          # build estático
npm run lint           # eslint
npm run check:links    # enlaces internos + fragmentos (#id) contra dist/
```

`npm run verify` encadena i18n:check + check + build + check:links.

## Verificaciones manuales obligatorias

### 1. Payload JavaScript

```bash
find dist -name "*.js" -printf "%s %p\n" | sort -rn
grep -rl "react\|preact\|vue\|svelte" dist/_assets/ || echo "0 framework JS ✓"
```

**Objetivo: 0 kB de JS de framework.** Presupuesto total ≤ 10 kB gzip por página.
Si aparece un chunk de framework, es un fallo crítico.

### 2. Rutas de medios y enlaces internos

```bash
npm run check:links
```

Valida cada `href`/`src` interno contra `dist/` (rutas HTML + archivos
estáticos) y cada fragmento `#id` contra el DOM de la propia página.
Debe salir "OK — sin enlaces internos rotos".

### 3. Alt y dimensiones

```bash
grep -rhoE '<img[^>]*>' dist/**/*.html | grep -v 'alt=' && echo "FALTA alt en alguna imagen"
grep -rhoE '<img[^>]*>' dist/**/*.html | grep -vE 'width=' && echo "FALTA width en alguna imagen"
```

### 4. Anclas

```bash
# Cada href="#id" debe tener un id correspondiente
grep -rhoE 'href="#[^"]+"' dist/**/*.html | sed 's/href="#//;s/"//' | sort -u
```

Verifica que cada ancla exista en la página y que los alias legacy
(`capacidades`, `equipos`, `empresa`, `seguridad`) sigan presentes.

### 5. Anclajes de idioma

```bash
grep -rl "[áéíóúñ¿¡]" dist/en/ && echo "ESPAÑOL EN LA VERSIÓN EN"
```

Debe salir vacío. El inglés no puede contener tildes españolas ni `¿`/`¡`
salvo nombres propios.

### 6. Tokens

```bash
grep -rhoE '#[0-9A-Fa-f]{6}' src/ | sort -u
```

Solo deben aparecer los 6 tokens de marca. Cualquier otro hex es un fallo.

### 7. Tamaño de medios

```bash
du -sh public/assets/photos
find public/assets/photos -name "*.webp" -size +500k | head
```

Ninguna imagen debería superar 500 kB.

### 8. Verificación manual

- Navegar con `Tab` / `Shift+Tab`: foco visible en cada control.
- Activar "reducir movimiento" en el SO: la página queda estática.
- Revisar contraste en hover / focus / disabled.
- Comprobar a 360 px: sin scroll horizontal.

## Formato del reporte

```
i18n        OK / FALLA — N claves, N errores
astro check OK / FALLA — N errores, N warnings
build       OK / FALLA — N páginas
lint        OK / FALLA — N problemas
links       OK / FALLA — N rotos
JS          N bytes — <detalle>
assets      N rotos
alt/dims    OK / FALLA
anclas      OK / FALLA
idioma EN   OK / FALLA
tokens      OK / FALLA
peso fotos  N MB
```

Sé explícito sobre lo que falla. No declares "listo" con un fallo abierto.
