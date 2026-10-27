/**
 * Constantes tecnicas de la empresa.
 *
 * Aqui viven los valores que NO son copy (no se traducen) pero que deben
 * tener una unica fuente: endpoints del formulario, destinatarios de copia y
 * la direccion del correo comercial que el form usa como destino.
 *
 * El copy visible vive en `src/i18n/{es,en}.json` bajo el namespace
 * `company.*`. Este archivo existe para que el endpoint tecnico no se
 * desvíe del correo que se muestra en pantalla.
 */

/** Correo de destino del formulario. Debe coincidir con `company.email`. */
export const companyEmail = 'customer.service@jmchandling.com';

/** Copia oculta del formulario (FormSubmit `_cc`). */
export const companyEmailCc = 'carlos.wood@jmchandling.com';

/** Endpoint de envio. No lleva prefijo `https://` en la URL final. */
export const quoteFormEndpoint = `https://formsubmit.co/${companyEmail}`;
