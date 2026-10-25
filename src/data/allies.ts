export interface Ally {
  key: string;
  name: string;
  logo: string;
  website?: string;
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
  },
  {
    key: 'avior',
    name: 'Avior Airlines',
    logo: '/assets/allies/avior-airlines.svg',
  },
  {
    key: 'laser',
    name: 'Laser Airlines',
    logo: '/assets/allies/laser-airlines.svg',
  },
  {
    key: 'estelar',
    name: 'Estelar Airlines',
    logo: '/assets/allies/estelar.webp',
  },
  {
    key: 'iberia',
    name: 'Iberia',
    logo: '/assets/allies/iberia.svg',
  },
  {
    key: 'aerotur',
    name: 'Aerotur',
    logo: '/assets/allies/aerotur.svg',
    wordmark: true,
  },
];
