import { PageChain } from '../../../seo/components/page-chain/page-chain';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

interface Props {
    previous?: Pick<PageMetadataInterface, 'path' | 'title'>;
    next?: Pick<PageMetadataInterface, 'path' | 'title'>;
}

export const TechniqueNavigation = ({ next, previous }: Props) => (
    <PageChain
        ariaLabel="Technique difficulty chain"
        next={next}
        nextLabel="Continue to"
        previous={previous}
        previousLabel="Previous technique"
    />
);
