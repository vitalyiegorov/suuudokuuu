import { SCHEMA_CONTEXT } from '../../constants/schema.constant';
import { DEFAULT_LOCALE } from '../../constants/site.constant';
import { buildLocaleUrl } from '../../utils/build-locale-url.util';
import { extractNodeText } from '../../utils/extract-node-text.util';
import { findSlots } from '../../utils/find-slots.util';
import { JsonLd } from '../json-ld/json-ld';
import { SoftwareApplicationFeature } from '../software-application-feature/software-application-feature';

import type { ReactNode } from 'react';

const APPLICATION_CATEGORY = 'GameApplication';

const OPERATING_SYSTEMS = 'iOS, Android, Web';

interface Props {
    path: string;
    name: string;
    description: string;
    children: ReactNode;
}

export const SoftwareApplicationSchema = ({ children, description, name, path }: Props) => {
    const featureElements = findSlots(children, SoftwareApplicationFeature);
    const featureList = featureElements.map(featureElement => extractNodeText(featureElement.props.children));

    const schema = {
        '@context': SCHEMA_CONTEXT,
        '@type': 'SoftwareApplication',
        name,
        description,
        url: buildLocaleUrl(DEFAULT_LOCALE, path),
        applicationCategory: APPLICATION_CATEGORY,
        operatingSystem: OPERATING_SYSTEMS,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList
    };

    return (
        <>
            <JsonLd data={schema} />
            <ul className="software-feature-list">
                {featureElements.map(featureElement => (
                    <li key={extractNodeText(featureElement.props.children)}>{featureElement.props.children}</li>
                ))}
            </ul>
        </>
    );
};
