import { isNotEmptyString } from '@rnw-community/shared';

import type { PageMetadataInterface } from '../interfaces/page-metadata.interface';

export const resolvePageHeadline = ({ headline, title }: Pick<PageMetadataInterface, 'headline' | 'title'>): string =>
    isNotEmptyString(headline) ? headline : title;
