import { isNotEmptyString } from '@rnw-community/shared';

import { DEFAULT_LOCALE, SITE_NAME, SITE_ORIGIN } from '../constants/site.constant';

import { buildAlternates } from './build-alternates.util';
import { buildLocaleUrl } from './build-locale-url.util';

import type { PageMetadataInterface } from '../interfaces/page-metadata.interface';
import type { Metadata } from 'next';

const OPEN_GRAPH_IMAGE_WIDTH = 1200;
const OPEN_GRAPH_IMAGE_HEIGHT = 630;

export const buildPageMetadata = ({
    imageAlt,
    imagePath,
    metaDescription,
    metaTitle,
    path,
    publishedAt,
    title,
    updatedAt
}: PageMetadataInterface): Metadata => {
    const hasImage = isNotEmptyString(imagePath);
    const imageUrl = `${SITE_ORIGIN}${imagePath ?? ''}`;
    const openGraphImages = [{ url: imageUrl, width: OPEN_GRAPH_IMAGE_WIDTH, height: OPEN_GRAPH_IMAGE_HEIGHT, alt: imageAlt ?? title }];
    const twitterCard = hasImage ? 'summary_large_image' : 'summary';

    return {
        title: metaTitle,
        description: metaDescription,
        alternates: buildAlternates(path),
        openGraph: {
            type: 'website',
            siteName: SITE_NAME,
            locale: DEFAULT_LOCALE,
            title: metaTitle,
            description: metaDescription,
            url: buildLocaleUrl(DEFAULT_LOCALE, path),
            ...(hasImage && { images: openGraphImages })
        },
        twitter: {
            card: twitterCard,
            title: metaTitle,
            description: metaDescription,
            ...(hasImage && { images: [imageUrl] })
        },
        other: {
            'article:published_time': publishedAt,
            'article:modified_time': updatedAt
        }
    };
};
