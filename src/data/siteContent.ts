export type ContentStatus = 'verified' | 'needs-business-validation' | 'deprecated';

export type ServiceFamilyKey =
  | 'ramp-gse'
  | 'aircraft-care'
  | 'fbo-operations'
  | 'passenger-services'
  | 'gse-maintenance';

export interface LocalizedText {
  es: string;
  en: string;
}

export interface ServiceFamily {
  key: ServiceFamilyKey;
  titleKey: string;
  descriptionKey: string;
  media: string;
  mediaAltKey: string;
  serviceKeys: string[];
}

export interface ServiceDefinition {
  key: string;
  family: ServiceFamilyKey;
  titleKey: string;
  descriptionKey: string;
  bulletsKey: string;
}

export interface ProofPoint {
  type: 'certification' | 'station' | 'experience' | 'training' | 'equipment';
  value: string;
  labelKey: string;
  source?: string;
  status: ContentStatus;
}

export const serviceFamilies: ServiceFamily[] = [
  {
    key: 'ramp-gse',
    titleKey: 'services.families.rampTitle',
    descriptionKey: 'services.families.rampDesc',
    media: '/assets/images/gse-fleet.webp',
    mediaAltKey: 'services.media.rampAlt',
    serviceKeys: ['gse'],
  },
  {
    key: 'aircraft-care',
    titleKey: 'services.families.aircraftCareTitle',
    descriptionKey: 'services.families.aircraftCareDesc',
    media: '/assets/images/equipment-cleaning.webp',
    mediaAltKey: 'services.media.aircraftCareAlt',
    serviceKeys: ['interior', 'exterior', 'disinfection'],
  },
  {
    key: 'fbo-operations',
    titleKey: 'services.families.operationsTitle',
    descriptionKey: 'services.families.operationsDesc',
    media: '/assets/images/sms-training.webp',
    mediaAltKey: 'services.media.operationsAlt',
    serviceKeys: ['obf'],
  },
  {
    key: 'passenger-services',
    titleKey: 'services.families.passengerTitle',
    descriptionKey: 'services.families.passengerDesc',
    media: '/assets/images/continuous-training.webp',
    mediaAltKey: 'services.media.passengerAlt',
    serviceKeys: ['passenger', 'special'],
  },
  {
    key: 'gse-maintenance',
    titleKey: 'services.families.maintenanceTitle',
    descriptionKey: 'services.families.maintenanceDesc',
    media: '/assets/images/gse-maintenance.webp',
    mediaAltKey: 'services.media.maintenanceAlt',
    serviceKeys: ['maintenance'],
  },
];

export const services: ServiceDefinition[] = [
  { key: 'gse', family: 'ramp-gse', titleKey: 'services.gseTitle', descriptionKey: 'services.gseDesc', bulletsKey: 'services.gseBullets' },
  { key: 'interior', family: 'aircraft-care', titleKey: 'services.interiorTitle', descriptionKey: 'services.interiorDesc', bulletsKey: 'services.interiorBullets' },
  { key: 'exterior', family: 'aircraft-care', titleKey: 'services.exteriorTitle', descriptionKey: 'services.exteriorDesc', bulletsKey: 'services.exteriorBullets' },
  { key: 'disinfection', family: 'aircraft-care', titleKey: 'services.disinfectionTitle', descriptionKey: 'services.disinfectionDesc', bulletsKey: 'services.disinfectionBullets' },
  { key: 'obf', family: 'fbo-operations', titleKey: 'services.obfTitle', descriptionKey: 'services.obfDesc', bulletsKey: 'services.obfBullets' },
  { key: 'passenger', family: 'passenger-services', titleKey: 'services.passengerTitle', descriptionKey: 'services.passengerDesc', bulletsKey: 'services.passengerBullets' },
  { key: 'special', family: 'passenger-services', titleKey: 'services.specialTitle', descriptionKey: 'services.specialDesc', bulletsKey: 'services.specialBullets' },
  { key: 'maintenance', family: 'gse-maintenance', titleKey: 'services.maintenanceTitle', descriptionKey: 'services.maintenanceDesc', bulletsKey: 'services.maintenanceBullets' },
];

export function getService(key: string) {
  return services.find((service) => service.key === key);
}

export function getServiceFamily(key: ServiceFamilyKey) {
  return serviceFamilies.find((family) => family.key === key);
}
