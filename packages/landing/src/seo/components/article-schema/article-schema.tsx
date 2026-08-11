import { SCHEMA_CONTEXT } from '../../constants/schema.constant';
import { DEFAULT_LOCALE, SITE_NAME } from '../../constants/site.constant';
import { buildLocaleUrl } from '../../utils/build-locale-url.util';
import { JsonLd } from '../json-ld/json-ld';

interface Props {
    path: string;
    headline: string;
    description: string;
    datePublished: string;
    dateModified: string;
}

export const ArticleSchema = ({ dateModified, datePublished, description, headline, path }: Props) => {
    const schema = {
        '@context': SCHEMA_CONTEXT,
        '@type': 'Article',
        headline,
        description,
        datePublished,
        dateModified,
        url: buildLocaleUrl(DEFAULT_LOCALE, path),
        author: { '@type': 'Organization', name: SITE_NAME },
        publisher: { '@type': 'Organization', name: SITE_NAME }
    };

    return <JsonLd data={schema} />;
};
