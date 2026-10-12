import type { PageMetadataInterface } from '../../seo/interfaces/page-metadata.interface';

export interface IndexablePageInterface {
    readonly url: string;
    readonly locale: string;
    readonly pageMetadata: PageMetadataInterface;
}
