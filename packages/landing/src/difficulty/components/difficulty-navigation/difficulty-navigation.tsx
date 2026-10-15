import { useLingui } from '@lingui/react/macro';

import { PageChain } from '../../../seo/components/page-chain/page-chain';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

interface Props {
    previous?: PageMetadataInterface;
    next?: PageMetadataInterface;
}

export const DifficultyNavigation = ({ next, previous }: Props) => {
    const { t } = useLingui();

    return (
        <PageChain
            ariaLabel={t`Sudoku difficulty chain`}
            next={next}
            nextLabel={t`Harder difficulty`}
            previous={previous}
            previousLabel={t`Easier difficulty`}
        />
    );
};
