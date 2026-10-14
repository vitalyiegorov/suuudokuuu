import { LOCALE_NAMES } from '../../../seo/constants/site.constant';

import type { LocaleType } from '../../../seo/types/locale.type';

interface Props {
    locale: LocaleType;
    href: string;
    isCurrent: boolean;
}

export const LanguageSwitcherLink = ({ href, isCurrent, locale }: Props) => {
    const currentPageProps = isCurrent ? { 'aria-current': 'page' as const } : {};

    return (
        <a {...currentPageProps} href={href} hrefLang={locale} lang={locale}>
            {LOCALE_NAMES[locale]}
        </a>
    );
};
