/**
 * Credenciales operacionales de JMC.
 *
 * Cada credencial es un hecho verificable extraido del documento que la
 * emite. La evidencia documental original vive en
 * `/assets/photos/families/` y se enlaza bajo demanda: mostrarla en la home
 * la convertia en un documento burocratico que pesaba mas que la propia
 * declaracion de autoridad.
 *
 * `mark` es la marca alegorica que acompaña a la credencial en la home
 * (`src/components/ui/CredentialMark.astro`). Es un pictograma del CONCEPTO,
 * no un emblema oficial: el hecho verificable va siempre en el texto.
 */
export interface Credential {
  key: string;
  /** Marca alegorica asociada: escudo, red o regla graduada. */
  mark: 'cesea' | 'sms' | 'rav';
  /** Codigo de la credencial (CESEA-021, CASMS-079, RAV 111). Se muestra en mono. */
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
    mark: 'cesea',
    codeKey: 'credentials.ceseaCode',
    titleKey: 'credentials.ceseaTitle',
    issuerKey: 'credentials.ceseaIssuer',
    validityKey: 'credentials.ceseaValidity',
    evidenceHref: '/assets/photos/families/cert-cesea-1280.webp',
  },
  {
    key: 'sms',
    mark: 'sms',
    codeKey: 'credentials.smsCode',
    titleKey: 'credentials.smsTitle',
    issuerKey: 'credentials.smsIssuer',
    validityKey: 'credentials.smsValidity',
    evidenceHref: '/assets/photos/families/safety-sms-1280.webp',
  },
  {
    key: 'rav111',
    mark: 'rav',
    codeKey: 'credentials.ravCode',
    titleKey: 'credentials.ravTitle',
    issuerKey: 'credentials.ravIssuer',
    validityKey: 'credentials.ravValidity',
  },
];
