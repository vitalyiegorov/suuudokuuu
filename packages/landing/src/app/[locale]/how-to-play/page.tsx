import { howToPlayPageMetadata } from '../../(en)/how-to-play/metadata';
import { HowToPlayPage } from '../../../how-to-play/components/how-to-play-page/how-to-play-page';
import { buildLocaleStaticParams } from '../../../seo/utils/build-locale-static-params.util';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { resolveLocaleSegment } from '../../../seo/utils/resolve-locale-segment.util';

import type { Metadata } from 'next';

interface Props {
    params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => buildLocaleStaticParams(howToPlayPageMetadata);

export const generateMetadata = async ({ params }: Props): Promise<Metadata> =>
    buildPageMetadata(howToPlayPageMetadata, resolveLocaleSegment((await params).locale));

const LocalizedHowToPlayPage = async ({ params }: Props) => <HowToPlayPage locale={resolveLocaleSegment((await params).locale)} />;

export default LocalizedHowToPlayPage;
