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
   * Alto de render en la franja de aliados, en px.
   *
   * Se asigna por peso optico, no por altura uniforme. Los logotipos cuyo
   * lockup incluye un simbolo (Copa, Laser) necesitan mas alto para que su
   * wordmark alcance la misma altura de letra que el resto; los wordmarks
   * de una sola linea (Avior, Iberia, Aerotur) se renderizan mas bajos pero
   * con la misma altura de texto.
   */
  displayHeight: number;
  /**
   * true cuando el recurso es un logotipo tipografico propio y no el
   * logotipo oficial de la marca. Se renderiza con menos contraste para
   * no competir visualmente con los logotipos oficiales del marquee.
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
    displayHeight: 54,
  },
  {
    key: 'avior',
    name: 'Avior Airlines',
    logo: '/assets/allies/avior-airlines.svg',
    width: 286,
    height: 35,
    displayHeight: 31,
  },
  {
    key: 'laser',
    name: 'Laser Airlines',
    logo: '/assets/allies/laser-airlines.svg',
    width: 773,
    height: 104,
    displayHeight: 37,
  },
  {
    key: 'estelar',
    name: 'Estelar Airlines',
    logo: '/assets/allies/estelar.webp',
    width: 407,
    height: 140,
    displayHeight: 29,
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
    displayHeight: 33,
    wordmark: true,
  },
];
