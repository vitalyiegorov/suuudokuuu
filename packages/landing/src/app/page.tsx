import { JsonLd } from '../seo/components/json-ld/json-ld';
import { SCHEMA_CONTEXT } from '../seo/constants/schema.constant';
import { DEFAULT_LOCALE, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from '../seo/constants/site.constant';
import { buildLocaleUrl } from '../seo/utils/build-locale-url.util';
import { buildPageMetadata } from '../seo/utils/build-page-metadata.util';

import { homePageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(homePageMetadata);

const webSiteSchema = {
    '@context': SCHEMA_CONTEXT,
    '@type': 'WebSite',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: buildLocaleUrl(DEFAULT_LOCALE, homePageMetadata.path),
    inLanguage: DEFAULT_LOCALE,
    datePublished: homePageMetadata.publishedAt,
    dateModified: homePageMetadata.updatedAt
};

const HomePage = () => (
    <main>
        <JsonLd data={webSiteSchema} />
        <h1>{SITE_NAME}</h1>
        <p>{SITE_TAGLINE}</p>
        <p>{SITE_DESCRIPTION}</p>
    </main>
);

export default HomePage;
