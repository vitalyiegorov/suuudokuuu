'use client';

import { usePathname } from 'next/navigation';

import { isNotEmptyString } from '@rnw-community/shared';

import { buildLocalePath } from '../../../seo/utils/build-locale-path.util';
import { LanguageSwitcherLink } from '../language-switcher-link/language-switcher-link';

import type { LocaleType } from '../../../seo/types/locale.type';

interface Props {
    label: string;
    locale: LocaleType;
    translatedPageLocales: Readonly<Record<string, readonly LocaleType[]>>;
}

export const LanguageSwitcher = ({ label, locale, translatedPageLocales }: Props) => {
    const pathname = usePathname();
    const pathWithoutLocale = pathname.slice(buildLocalePath(locale, '').length);
    const pagePath = isNotEmptyString(pathWithoutLocale) ? pathWithoutLocale : '/';
    const pageLocales = translatedPageLocales[pagePath] ?? [];

    if (pageLocales.length < 2) {
        return null;
    }

    return (
        <nav aria-label={label} className="language-switcher">
            {pageLocales.map(pageLocale => (
                <LanguageSwitcherLink
                    href={buildLocalePath(pageLocale, pagePath)}
                    isCurrent={pageLocale === locale}
                    key={pageLocale}
                    locale={pageLocale}
                />
            ))}
        </nav>
    );
};
