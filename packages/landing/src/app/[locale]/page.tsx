import { homePageMetadata } from '../(en)/metadata';
import { HomePage } from '../../home/components/home-page/home-page';
import { DEFAULT_LOCALE } from '../../seo/constants/site.constant';
import { buildPageMetadata } from '../../seo/utils/build-page-metadata.util';
import { getPageLocales } from '../../seo/utils/get-page-locales.util';
import { resolveLocaleSegment } from '../../seo/utils/resolve-locale-segment.util';

import type { Metadata } from 'next';

interface Props {
    params: Promise<{ locale: string }>;
}

export const generateStaticParams = () =>
    getPageLocales(homePageMetadata)
        .filter(locale => locale !== DEFAULT_LOCALE)
        .map(locale => ({ locale: locale.toLowerCase() }));

export const generateMetadata = async ({ params }: Props): Promise<Metadata> =>
    buildPageMetadata(homePageMetadata, resolveLocaleSegment((await params).locale));

const LocalizedHomePage = async ({ params }: Props) => <HomePage locale={resolveLocaleSegment((await params).locale)} />;

export default LocalizedHomePage;
