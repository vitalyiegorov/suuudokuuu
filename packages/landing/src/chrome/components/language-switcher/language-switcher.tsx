'use client';

import { usePathname } from 'next/navigation';

import { isNotEmptyString } from '@rnw-community/shared';

import { LOCALE_NAMES } from '../../../seo/constants/site.constant';
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
    const pageLocales = translatedPageGroups.find(({ paths }) => paths.includes(pagePath))?.locales ?? [];

    if (pageLocales.length < 2) {
        return null;
    }

    return (
        <nav aria-label={label} className="language-switcher">
            <details className="language-switcher__menu">
                <summary className="language-switcher__current">{LOCALE_NAMES[locale]}</summary>
                <ul className="language-switcher__list">
                    {pageLocales.map(pageLocale => (
                        <LanguageSwitcherLink
                            href={buildLocalePath(pageLocale, pagePath)}
                            isCurrent={pageLocale === locale}
                            key={pageLocale}
                            locale={pageLocale}
                        />
                    ))}
                </ul>
            </details>
        </nav>
    );
};
