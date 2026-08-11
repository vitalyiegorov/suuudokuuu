import { isDefined } from '@rnw-community/shared';

import { DifficultyNavigationLink } from '../difficulty-navigation-link/difficulty-navigation-link';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

interface Props {
    previous?: Pick<PageMetadataInterface, 'path' | 'title'>;
    next?: Pick<PageMetadataInterface, 'path' | 'title'>;
}

export const DifficultyNavigation = ({ next, previous }: Props) => {
    const previousLink = isDefined(previous) ? <DifficultyNavigationLink label="Easier difficulty" metadata={previous} /> : null;
    const nextLink = isDefined(next) ? <DifficultyNavigationLink label="Harder difficulty" metadata={next} /> : null;

    return (
        <nav aria-label="Sudoku difficulty chain" className="difficulty-chain">
            {previousLink}
            {nextLink}
        </nav>
    );
};
