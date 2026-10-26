export interface Ally {
  key: string;
  name: string;
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
   * logo (cap height de la banda de tinta densa) normalizada a un objetivo
   * comun de 24px. Asi los seis logos se leen al mismo tamano aunque sus
   * cajas sean muy distintas.
   *
   *   alto = 24 * (alto de caja / altura de letra)
   *
   * Los logos con simbolo (Copa, Laser) necesitan una caja mas alta para
   * que su wordmark alcance la misma altura de letra que el resto.
   */
  displayHeight: number;
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
    logo: '/assets/allies/copa-airlines.svg',
    width: 433,
    height: 114,
    displayHeight: 53,
  },
  {
    key: 'avior',
    name: 'Avior Airlines',
    logo: '/assets/allies/avior-airlines.svg',
    width: 286,
    height: 35,
    displayHeight: 26,
  },
  {
    key: 'laser',
    name: 'Laser Airlines',
    logo: '/assets/allies/laser-airlines.svg',
    width: 773,
    height: 104,
    displayHeight: 38,
  },
  {
    key: 'estelar',
    name: 'Estelar Airlines',
    logo: '/assets/allies/estelar.webp',
    width: 359,
    height: 76,
    displayHeight: 33,
  },
  {
    key: 'iberia',
    name: 'Iberia',
    logo: '/assets/allies/iberia.svg',
    width: 400,
    height: 88,
    displayHeight: 30,
  },
  {
    key: 'aerotur',
    name: 'Aerotur',
    logo: '/assets/allies/aerotur.svg',
    width: 104,
    height: 19,
    displayHeight: 27,
    wordmark: true,
  },
];
