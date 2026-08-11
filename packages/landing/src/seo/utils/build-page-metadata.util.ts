import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from '../constants/og-image.constant';
import { DEFAULT_LOCALE, SITE_NAME, SITE_ORIGIN } from '../constants/site.constant';

import { buildAlternates } from './build-alternates.util';
import { buildLocaleUrl } from './build-locale-url.util';
import { getOgImagePath } from './get-og-image-path.util';

import type { PageMetadataInterface } from '../interfaces/page-metadata.interface';
import type { Metadata } from 'next';

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
    const resolvedImagePath = imagePath ?? getOgImagePath(path);
    const imageUrl = `${SITE_ORIGIN}${resolvedImagePath}`;
    const openGraphImages = [{ url: imageUrl, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, alt: imageAlt ?? title }];

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
            images: openGraphImages
        },
        twitter: {
            card: 'summary_large_image',
            title: metaTitle,
            description: metaDescription,
            images: [imageUrl]
        },
        other: {
            'article:published_time': publishedAt,
            'article:modified_time': updatedAt
        }
    };
};
