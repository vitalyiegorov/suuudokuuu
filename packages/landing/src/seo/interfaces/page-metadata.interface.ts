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
}
