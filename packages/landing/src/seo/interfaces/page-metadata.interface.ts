import type { SitemapChangeFrequencyType } from '../types/sitemap-change-frequency.type';

export interface PageMetadataInterface {
    path: string;
    title: string;
    metaTitle: string;
    metaDescription: string;
    publishedAt: string;
    updatedAt: string;
    changeFrequency: SitemapChangeFrequencyType;
    priority: number;
    imagePath?: string;
    imageAlt?: string;
}
