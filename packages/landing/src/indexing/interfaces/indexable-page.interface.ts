import type { PageMetadataInterface } from '../../seo/interfaces/page-metadata.interface';
import type { LocaleType } from '../../seo/types/locale.type';

export interface IndexablePageInterface {
    readonly url: string;
    readonly locale: LocaleType;
    readonly pageMetadata: PageMetadataInterface;
}
