import { isDefined } from '@rnw-community/shared';

import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from '../constants/og-image.constant';
import { DEFAULT_LOCALE, SITE_NAME } from '../constants/site.constant';

import { buildAlternates } from './build-alternates.util';
import { buildLocaleUrl } from './build-locale-url.util';
import { buildOgImageUrl } from './build-og-image-url.util';
import { localizePageMetadata } from './localize-page-metadata.util';

import type { PageMetadataInterface } from '../interfaces/page-metadata.interface';
import type { LocaleType } from '../types/locale.type';
import type { Metadata } from 'next';

export const buildPageMetadata = (pageMetadata: PageMetadataInterface, locale: LocaleType = DEFAULT_LOCALE): Metadata => {
    const { metaDescription, metaTitle, path, publishedAt, title, updatedAt } = localizePageMetadata(pageMetadata, locale);
    const imageUrl = buildOgImageUrl({ path });
    const openGraphImages = [{ url: imageUrl, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, alt: title }];

    return {
        title: metaTitle,
        description: metaDescription,
        alternates: buildAlternates(pageMetadata, locale),
        openGraph: {
            siteName: SITE_NAME,
            locale,
            title: metaTitle,
            description: metaDescription,
            url: buildLocaleUrl(locale, path),
            images: openGraphImages,
            ...(isDefined(pageMetadata.openGraphType)
                ? { type: 'website' }
                : { type: 'article', publishedTime: publishedAt, modifiedTime: updatedAt })
        },
        twitter: {
            card: 'summary_large_image'
        }
    };
};
