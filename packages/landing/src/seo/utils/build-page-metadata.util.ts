import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from '../constants/og-image.constant';
import { DEFAULT_LOCALE, SITE_NAME } from '../constants/site.constant';

import { buildAlternates } from './build-alternates.util';
import { buildLocaleUrl } from './build-locale-url.util';
import { buildOgImageUrl } from './build-og-image-url.util';

import type { PageMetadataInterface } from '../interfaces/page-metadata.interface';
import type { Metadata } from 'next';

export const buildPageMetadata = ({ metaDescription, metaTitle, path, publishedAt, title, updatedAt }: PageMetadataInterface): Metadata => {
    const imageUrl = buildOgImageUrl({ path });
    const openGraphImages = [{ url: imageUrl, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, alt: title }];

    return {
        title: metaTitle,
        description: metaDescription,
        alternates: buildAlternates(path),
        openGraph: {
            siteName: SITE_NAME,
            locale: DEFAULT_LOCALE,
            title: metaTitle,
            description: metaDescription,
            url: buildLocaleUrl(DEFAULT_LOCALE, path),
            images: openGraphImages,
            ...(path === '/' ? { type: 'website' } : { type: 'article', publishedTime: publishedAt, modifiedTime: updatedAt })
        },
        twitter: {
            card: 'summary_large_image',
            title: metaTitle,
            description: metaDescription,
            images: [imageUrl]
        }
    };
};
