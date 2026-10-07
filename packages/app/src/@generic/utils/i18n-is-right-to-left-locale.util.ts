const RightToLeftLocales: readonly string[] = ['ar', 'ur'];

export const i18nIsRightToLeftLocale = (locale: string): boolean => RightToLeftLocales.includes(locale);
