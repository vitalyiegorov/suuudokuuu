import { isNotEmptyString } from '@rnw-community/shared';

import { OG_IMAGE_DIRECTORY } from '../constants/og-image.constant';

const HOME_OG_IMAGE_SLUG = 'home';
const DAILY_OG_IMAGE_SLUG = 'daily-sudoku';

export const hasSharedOgImage = (path: string): boolean => path.startsWith(`/${DAILY_OG_IMAGE_SLUG}/`);

export const getOgImageSlug = (path: string): string => {
    if (hasSharedOgImage(path)) {
        return DAILY_OG_IMAGE_SLUG;
    }

    const trimmedPath = path.replaceAll(/^\/+|(?<!\/)\/+$/gu, '');

    return isNotEmptyString(trimmedPath) ? trimmedPath.replaceAll('/', '-') : HOME_OG_IMAGE_SLUG;
};

export const getOgImagePath = (path: string): string => `${OG_IMAGE_DIRECTORY}/${getOgImageSlug(path)}.png`;
