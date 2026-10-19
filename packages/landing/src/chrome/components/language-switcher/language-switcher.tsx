'use client';

import { usePathname } from 'next/navigation';

import { isNotEmptyString } from '@rnw-community/shared';

import { LOCALE_NAMES, SUPPORTED_LOCALES } from '../../../seo/constants/site.constant';
import { buildLocalePath } from '../../../seo/utils/build-locale-path.util';
import { LanguageSwitcherLink } from '../language-switcher-link/language-switcher-link';

import type { LocaleType } from '../../../seo/types/locale.type';
import type { TranslatedPageGroupInterface } from '../../interfaces/translated-page-group.interface';

interface Props {
    label: string;
    locale: LocaleType;
    translatedPageGroups: readonly TranslatedPageGroupInterface[];
}

export const LanguageSwitcher = ({ label, locale, translatedPageGroups }: Props) => {
    const pathname = usePathname();
    const pathWithoutLocale = pathname.slice(buildLocalePath(locale, '').length);
    const pagePath = isNotEmptyString(pathWithoutLocale) ? pathWithoutLocale : '/';
    const pageLocales = translatedPageGroups.find(({ paths }) => paths.includes(pagePath))?.locales ?? [locale];
    const getLocaleHref = (linkLocale: LocaleType) => buildLocalePath(linkLocale, pageLocales.includes(linkLocale) ? pagePath : '/');

    return (
        <nav aria-label={label} className="language-switcher">
            <details className="language-switcher__menu">
                <summary aria-label={LOCALE_NAMES[locale]} className="language-switcher__current">
                    <svg aria-hidden className="language-switcher__icon" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9s1.3-6.4 3.8-9Z" />
                    </svg>
                    {locale.toUpperCase()}
                </summary>
                <ul className="language-switcher__list">
                    {SUPPORTED_LOCALES.map(linkLocale => (
                        <LanguageSwitcherLink
                            href={getLocaleHref(linkLocale)}
                            isCurrent={linkLocale === locale}
                            key={linkLocale}
                            locale={linkLocale}
                        />
                    ))}
                </ul>
            </details>
        </nav>
    );
};
