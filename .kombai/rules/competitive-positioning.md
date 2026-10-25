# Posicionamiento competitivo — JMC Handling

## El rival

`siacaservicios.com` es el referente local del sector. Su arquitectura es
Bootstrap 4 + jQuery + Mobirise + Embla + Parallax + YouTube + CommonNinja.
Eso son ~500 kB de JS, constructores visuales genéricos y **fotografía generada por IA**
(`gemini-generated-image-*.png`).

## Cómo ganamos

| Eje | JMC Holding | Rival |
|---|---|---|
| JS cliente | **0 kB** | ~500 kB |
| Fotografía | **Real, de la operación propia** | IA genérica |
| Tipografía | Inter + JetBrains Mono | La que traiga el tema |
| Lighthouse | Objetivo 95+ en todas las métricas | Pesado |
| Nicho | Solo aviación, solo Maiquetía | Multi-rubro |

**La fotografía real es la diferencia que se nota antes de leer una sola palabra.**
Es el activo más valioso del proyecto: no lo sustituyas, no lo dupliques con IA,
no lo desperdicies en un collage apretado.

## Decisiones de diseño derivadas

1. **Retrato editorial, no carrusel fullscreen.** 50 de 51 fotos son verticales.
   El formato del sitio debe ser vertical-first; la única horizontal
   (`hero-ramp-night`) funciona como banda a sangre única, no como fondo de hero
   recortado.
2. **Menos elementos, más grandes.** Una fotografía de 1600 px de alto vale más que
   seis miniaturas de 200 px. El scroll-snap horizontal con tarjetas 4:5 es el
   patrón correcto para la galería.
3. **Cero dependencias de animación.** Nada de librerías de carrusel.
4. **Texto verificable.** Cada dato que aparece tiene respaldo documental
   (brochure corporativo, RAV 111, CESEA). Nada de superlativos de plantilla.
5. **Densidad operativa.** La información que un cliente B2B necesita
   (habilitaciones, secciones, horarios, cobertura, contacto) debe estar a la vista
   sin posicionar el mouse.

## Reglas de fotografía

- Nada de placeholders genéricos (no `via.placeholder.com`, no gradients con
  "imagen").
- Nada de imágenes de IA. `media-raw/_quarantine/` existe solo para apartarlas.
- Un logo de Socio que se vea borroso, genérico o con marca de agua es un defecto,
  no un detalle menor: no lo muestres.
- Si falta una foto para un tema, es preferible un tratamiento tipográfico honesto
  a una foto que no corresponde.
- Formato de tarjeta: `aspect-[4/5]` con `object-cover`. Formato de banda:
  `aspect-[16/9]` o `aspect-[21/9]`.

## Voz

- Español venezolano profesional, directo y concreto.
- Se dice lo que hacen, con qué habilitación, en qué aeropuerto, en qué horario.
- Se evita: "líder", "referente", "soluciones integrales", "compromiso total",
  "pasión por la aviación", "más de X años de experiencia" sin fuente.
- Se prefiere: "constituida en 2012", "Maiquetía desde 2015", "CESEA-021 · INAC ·
  RAV 111", "lunes a sábado, 05:00–22:00 VET".

## Lo que este proyecto NO es

- No es una web de servicios generales con un tema de aviación.
- No es un portfolio: hay contenido, hay empresa, hay habilitaciones.
- No es un blog de noticias de aviación.
- No es una app: es un sitio corporativo que debe cargar rápido y convertir.
