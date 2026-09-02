import { i18nActivateLanguage } from './i18n-catalogs';
import { i18nGetOSLocale } from './i18n.util';

export const i18nInitialCatalog = i18nActivateLanguage(i18nGetOSLocale());
