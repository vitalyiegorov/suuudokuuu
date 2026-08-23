import { PageChain } from '../../../seo/components/page-chain/page-chain';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

interface Props {
    previous?: Pick<PageMetadataInterface, 'path' | 'title'>;
    next?: Pick<PageMetadataInterface, 'path' | 'title'>;
}

export const DifficultyNavigation = ({ next, previous }: Props) => (
    <PageChain
        ariaLabel="Sudoku difficulty chain"
        next={next}
        nextLabel="Harder difficulty"
        previous={previous}
        previousLabel="Easier difficulty"
    />
);
