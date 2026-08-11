import type { PageMetadataInterface } from '../../seo/interfaces/page-metadata.interface';

export interface IndexablePageInterface {
    url: string;
    locale: string;
    pageMetadata: PageMetadataInterface;
}
