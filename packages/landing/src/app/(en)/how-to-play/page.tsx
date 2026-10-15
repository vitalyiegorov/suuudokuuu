import { HowToPlayPage } from '../../../how-to-play/components/how-to-play-page/how-to-play-page';
import { DEFAULT_LOCALE } from '../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';

import { howToPlayPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(howToPlayPageMetadata);

const EnglishHowToPlayPage = () => <HowToPlayPage locale={DEFAULT_LOCALE} />;

export default EnglishHowToPlayPage;
