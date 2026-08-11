import { isEmptyArray, isNotEmptyString } from '@rnw-community/shared';

import { SCHEMA_CONTEXT } from '../../constants/schema.constant';
import { DEFAULT_LOCALE } from '../../constants/site.constant';
import { buildLocaleUrl } from '../../utils/build-locale-url.util';
import { extractNodeText } from '../../utils/extract-node-text.util';
import { findSlots } from '../../utils/find-slots.util';
import { BreadcrumbListItem } from '../breadcrumb-list-item/breadcrumb-list-item';
import { JsonLd } from '../json-ld/json-ld';

import type { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

export const BreadcrumbListSchema = ({ children }: Props) => {
    const itemListElement = findSlots(children, BreadcrumbListItem).map((itemElement, index) => {
        const { children: itemChildren, path } = itemElement.props;

        return {
            '@type': 'ListItem',
            position: index + 1,
            name: extractNodeText(itemChildren),
            ...(isNotEmptyString(path) && { item: buildLocaleUrl(DEFAULT_LOCALE, path) })
        };
    });

    if (isEmptyArray(itemListElement)) {
        return null;
    }

    const schema = { '@context': SCHEMA_CONTEXT, '@type': 'BreadcrumbList', itemListElement };

    return <JsonLd data={schema} />;
};
