import {
    SITE_APP_STORE_URL,
    SITE_AUTHOR_NAME,
    SITE_AUTHOR_PROFILE_URL,
    SITE_GITHUB_URL,
    SITE_GOOGLE_PLAY_URL,
    SITE_NAME,
    SITE_ORIGIN
} from './site.constant';

export const SCHEMA_CONTEXT = 'https://schema.org';

export const AUTHOR_PERSON_SCHEMA = {
    '@type': 'Person',
    '@id': `${SITE_ORIGIN}/about#person`,
    name: SITE_AUTHOR_NAME,
    url: `${SITE_ORIGIN}/about`,
    sameAs: [SITE_AUTHOR_PROFILE_URL]
};

export const ORGANIZATION_SCHEMA = {
    '@type': 'Organization',
    '@id': `${SITE_ORIGIN}/#organization`,
    name: SITE_NAME,
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/brand/icon-512.png`,
    sameAs: [SITE_GITHUB_URL, SITE_APP_STORE_URL, SITE_GOOGLE_PLAY_URL]
};
