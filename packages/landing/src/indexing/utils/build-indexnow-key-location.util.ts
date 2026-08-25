import { SITE_ORIGIN } from '../../seo/constants/site.constant';

import { buildIndexNowKeyFileName } from './build-indexnow-key-file-name.util';

export const buildIndexNowKeyLocation = (key: string): string => `${SITE_ORIGIN}/${buildIndexNowKeyFileName(key)}`;
