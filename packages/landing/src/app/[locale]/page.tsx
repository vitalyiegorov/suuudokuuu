import { homePageMetadata } from '../(en)/metadata';
import { HomePage } from '../../home/components/home-page/home-page';
import { buildLocaleStaticParams } from '../../seo/utils/build-locale-static-params.util';
import { buildPageMetadata } from '../../seo/utils/build-page-metadata.util';
import { resolveLocaleSegment } from '../../seo/utils/resolve-locale-segment.util';

import type { Metadata } from 'next';

interface Props {
    params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => buildLocaleStaticParams(homePageMetadata);

export const generateMetadata = async ({ params }: Props): Promise<Metadata> =>
    buildPageMetadata(homePageMetadata, resolveLocaleSegment((await params).locale));

const LocalizedHomePage = async ({ params }: Props) => <HomePage locale={resolveLocaleSegment((await params).locale)} />;

export default LocalizedHomePage;
