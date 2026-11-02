import { isDefined } from '@rnw-community/shared';

import { readLinkAttributes } from './read-link-attributes.util';

export const readCanonical = (markup: string): string | undefined => {
    const canonicalHref = readLinkAttributes(markup).find(({ rel }) => rel === 'canonical')?.['href'];

    return isDefined(canonicalHref) ? new URL(canonicalHref).href : undefined;
};
