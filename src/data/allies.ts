export interface Ally {
  key: string;
  name: string;
  logo: string;
  website?: string;
}

export const allies: Ally[] = [
  {
    key: 'laser',
    name: 'Laser Airlines',
    logo: '/assets/allies/laser-airlines.svg',
  },
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
    key: 'aerotur',
    name: 'Aerotur',
    logo: '/assets/allies/aerotur.svg',
  },
  {
    key: 'iberia',
    name: 'Iberia',
    logo: '/assets/allies/iberia.svg',
  },
];
