import { HomePage } from '../../home/components/home-page/home-page';
import { DEFAULT_LOCALE } from '../../seo/constants/site.constant';
import { buildPageMetadata } from '../../seo/utils/build-page-metadata.util';

import { homePageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(homePageMetadata);

const EnglishHomePage = () => <HomePage locale={DEFAULT_LOCALE} />;

export default EnglishHomePage;
