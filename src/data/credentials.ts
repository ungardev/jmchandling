/**
 * Credenciales operacionales de JMC.
 *
 * Cada credencial es un hecho verificable extraido del certificado CESEA-021
 * emitido por el INAC. La evidencia documental original vive en
 * `/assets/photos/families/cert-cesea-1280.webp` y se enlaza bajo demanda:
 * mostrarla en la home la convertia en un documento burocratico que pesaba
 * mas que la propia declaracion de autoridad.
 */
export interface Credential {
  key: string;
  /** Codigo de la credencial (CESEA-021, RAV 111...). Se muestra en mono. */
  codeKey: string;
  /** Que es exactamente esta credencial. */
  titleKey: string;
  /** Quien la emite. */
  issuerKey: string;
  /** Vigencia o alcance. Si es indefinida, la credencial no la muestra. */
  validityKey?: string;
  /** Enlace al documento original (solo cuando existe evidencia). */
  evidenceHref?: string;
}

export const credentials: Credential[] = [
  {
    key: 'cesea',
    codeKey: 'credentials.ceseaCode',
    titleKey: 'credentials.ceseaTitle',
    issuerKey: 'credentials.ceseaIssuer',
    validityKey: 'credentials.ceseaValidity',
    evidenceHref: '/assets/photos/families/cert-cesea-1280.webp',
  },
  {
    key: 'rav111',
    codeKey: 'credentials.ravCode',
    titleKey: 'credentials.ravTitle',
    issuerKey: 'credentials.ravIssuer',
    validityKey: 'credentials.ravValidity',
  },
  {
    key: 'inac',
    codeKey: 'credentials.inacCode',
    titleKey: 'credentials.inacTitle',
    issuerKey: 'credentials.inacIssuer',
  },
  {
    key: 'sms',
    codeKey: 'credentials.smsCode',
    titleKey: 'credentials.smsTitle',
    issuerKey: 'credentials.smsIssuer',
  },
];
