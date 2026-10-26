export interface Ally {
  key: string;
  name: string;
  /**
   * Nombre corto del transportista, en mayusculas. Se usa en la linea de
   * manifiesto (pie del muro) para que los logotipos tipograficos se puedan
   * leer como texto. Es un nombre propio de marca: no se traduce.
   */
  shortName: string;
  logo: string;
  website?: string;
  /**
   * Dimensiones intrinsecas del recurso (viewBox del SVG o pixeles del WebP).
   * Se pasan como width/height del <img> para que el navegador reserve la
   * caja correcta antes de cargar y no haya layout shift.
   */
  width: number;
  height: number;
  /**
   * Alto de render del logo en el muro de aliados, en px (escala escritorio).
   *
   * No es una altura uniforme: se deriva de la altura de LETRA real de cada
   * logo (altura de la banda de tinta que forma el wordmark) normalizada a un
   * objetivo comun de 28px. Asi los seis logos se leen al mismo tamano aunque
   * sus cajas sean muy distintas.
   *
   *   alto = 28 * (alto de caja / altura de letra)
   *
   * La banda de letra se midio sobre el recurso renderizado (fila por fila,
   * ver AGENTS.md). Cada logo tiene una composicion distinta:
   *   - copa    wordmark en script sobre el renglon "Airlines" (banda 0-49)
   *   - avior   wordmark en mayusculas (banda 2-34)
   *   - laser   "LASER" verde (banda 14-79)
   *   - estelar wordmark con lema debajo (banda 0-55)
   *   - iberia  "IBERIA" rojo junto al simbolo (banda 8-52)
   *   - aerotur wordmark con trazo inferior (banda 0-16)
   */
  displayHeight: number;
  /**
   * Desplazamiento vertical del logo, en px (escala escritorio), para que la
   * linea de cap de todos los wordmarks quede a la misma altura. Es la
   * diferencia entre el borde superior de la caja y el inicio de la letra.
   *
   *   capOffset = max(capTop) - capTop
   *
   * Los simbolos que sobresalen (Copa) o los lemas que cuelgan (Estelar)
   * quedan fuera de la linea: la caja se dibuja completa, solo se desplaza
   * el origen para que la letra quede al mismo nivel que las demas.
   */
  capOffset: number;
  /**
   * true cuando el recurso es un logotipo tipografico propio y no el
   * logotipo oficial de la marca. Se renderiza con menos contraste para
   * no competir visualmente con los logotipos oficiales del muro.
   */
  wordmark?: boolean;
}

export const allies: Ally[] = [
  {
    key: 'copa',
    name: 'Copa Airlines',
    shortName: 'COPA',
    logo: '/assets/allies/copa-airlines.svg',
    width: 433,
    height: 114,
    displayHeight: 66,
    capOffset: 6,
  },
  {
    key: 'avior',
    name: 'Avior Airlines',
    shortName: 'AVIOR',
    logo: '/assets/allies/avior-airlines.svg',
    width: 286,
    height: 35,
    displayHeight: 31,
    capOffset: 4,
  },
  {
    key: 'laser',
    name: 'Laser Airlines',
    shortName: 'LASER',
    logo: '/assets/allies/laser-airlines.svg',
    width: 773,
    height: 104,
    displayHeight: 45,
    capOffset: 0,
  },
  {
    key: 'estelar',
    name: 'Estelar Airlines',
    shortName: 'ESTELAR',
    logo: '/assets/allies/estelar.webp',
    width: 359,
    height: 76,
    displayHeight: 39,
    capOffset: 6,
  },
  {
    key: 'iberia',
    name: 'Iberia',
    shortName: 'IBERIA',
    logo: '/assets/allies/iberia.svg',
    width: 400,
    height: 88,
    displayHeight: 56,
    capOffset: 1,
  },
  {
    key: 'aerotur',
    name: 'Aerotur',
    shortName: 'AEROTUR',
    logo: '/assets/allies/aerotur.svg',
    width: 104,
    height: 19,
    displayHeight: 33,
    capOffset: 6,
    wordmark: true,
  },
];
