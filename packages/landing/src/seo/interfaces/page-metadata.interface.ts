import type { DEFAULT_LOCALE } from '../constants/site.constant';
import type { LocaleType } from '../types/locale.type';
import type { SitemapChangeFrequencyType } from '../types/sitemap-change-frequency.type';

export interface PageMetadataInterface {
    readonly path: string;
    readonly title: string;
    readonly headline?: string;
    readonly metaTitle: string;
    readonly metaDescription: string;
    readonly publishedAt: string;
    readonly updatedAt: string;
    readonly changeFrequency: SitemapChangeFrequencyType;
    readonly priority: number;
    readonly openGraphType?: 'website';
    readonly translations?: Readonly<
        Partial<
            Record<
                Exclude<LocaleType, typeof DEFAULT_LOCALE>,
                Required<Pick<PageMetadataInterface, 'title' | 'headline' | 'metaTitle' | 'metaDescription'>>
            >
        >
    >;
}
