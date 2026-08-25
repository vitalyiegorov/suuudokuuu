import { isNotEmptyString } from '@rnw-community/shared';

import { OG_IMAGE_DIRECTORY } from '../constants/og-image.constant';

const HOME_OG_IMAGE_SLUG = 'home';

export const getOgImageSlug = (path: string): string => {
    const trimmedPath = path.replace(/^\/+|\/+$/gu, '');

    return isNotEmptyString(trimmedPath) ? trimmedPath.replace(/\//gu, '-') : HOME_OG_IMAGE_SLUG;
};

export const getOgImagePath = (path: string): string => `${OG_IMAGE_DIRECTORY}/${getOgImageSlug(path)}.png`;
