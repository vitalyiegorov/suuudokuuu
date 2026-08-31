import { SITE_ORIGIN } from '../constants/site.constant';

import { getOgImagePath } from './get-og-image-path.util';

import type { PageMetadataInterface } from '../interfaces/page-metadata.interface';

export const buildOgImageUrl = ({ path }: Pick<PageMetadataInterface, 'path'>): string => `${SITE_ORIGIN}${getOgImagePath(path)}`;
