import { SITE_AUTHOR_NAME, SITE_AUTHOR_PROFILE_URL, SITE_ORIGIN } from './site.constant';

export const SCHEMA_CONTEXT = 'https://schema.org';

export const AUTHOR_PERSON_SCHEMA = {
    '@type': 'Person',
    name: SITE_AUTHOR_NAME,
    url: `${SITE_ORIGIN}/about`,
    sameAs: [SITE_AUTHOR_PROFILE_URL]
};
