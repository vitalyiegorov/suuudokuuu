import type { LocaleType } from '../../seo/types/locale.type';

export interface TranslatedPageGroupInterface {
    readonly locales: readonly LocaleType[];
    readonly paths: readonly string[];
}
