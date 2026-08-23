import { isNotEmptyString } from '@rnw-community/shared';

import { SITE_ORIGIN } from '../constants/site.constant';

import { getOgImagePath } from './get-og-image-path.util';

import type { PageMetadataInterface } from '../interfaces/page-metadata.interface';

export const buildOgImageUrl = ({ imagePath, path }: Pick<PageMetadataInterface, 'imagePath' | 'path'>): string => {
    const resolvedImagePath = isNotEmptyString(imagePath) ? imagePath : getOgImagePath(path);

    return `${SITE_ORIGIN}${resolvedImagePath}`;
};
