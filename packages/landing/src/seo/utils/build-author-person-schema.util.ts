import { SITE_AUTHOR_NAME, SITE_AUTHOR_PROFILE_URL, SITE_AUTHOR_URL } from '../constants/site.constant';

export const buildAuthorPersonSchema = () => ({
    '@type': 'Person',
    name: SITE_AUTHOR_NAME,
    url: SITE_AUTHOR_URL,
    sameAs: [SITE_AUTHOR_PROFILE_URL]
});
