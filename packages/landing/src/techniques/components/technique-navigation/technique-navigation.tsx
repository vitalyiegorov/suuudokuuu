import { isDefined } from '@rnw-community/shared';

import { PageChain } from '../../../seo/components/page-chain/page-chain';
import { TECHNIQUE_NAMES } from '../../constants/technique-name.constant';
import { TECHNIQUE_PAGE_LADDER } from '../../constants/technique-page-ladder.constant';
import { TECHNIQUE_PAGE_PATHS } from '../../constants/technique-page-path.constant';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

interface Props {
    readonly technique?: SolutionTechniqueEnum;
    readonly previous?: Pick<PageMetadataInterface, 'path' | 'title'>;
    readonly next?: Pick<PageMetadataInterface, 'path' | 'title'>;
}

export const TechniqueNavigation = ({ next, previous, technique }: Props) => {
    const techniqueIndex = isDefined(technique) ? TECHNIQUE_PAGE_LADDER.indexOf(technique) : -1;
    const previousTechnique = TECHNIQUE_PAGE_LADDER[techniqueIndex - 1];
    const nextTechnique = TECHNIQUE_PAGE_LADDER[techniqueIndex + 1];
    const previousPage =
        techniqueIndex > 0 ? { path: TECHNIQUE_PAGE_PATHS[previousTechnique], title: TECHNIQUE_NAMES[previousTechnique] } : previous;
    const nextPage =
        techniqueIndex >= 0 && techniqueIndex < TECHNIQUE_PAGE_LADDER.length - 1
            ? { path: TECHNIQUE_PAGE_PATHS[nextTechnique], title: TECHNIQUE_NAMES[nextTechnique] }
            : next;

    return (
        <PageChain
            ariaLabel="Technique difficulty chain"
            next={nextPage}
            nextLabel="Continue to"
            previous={previousPage}
            previousLabel="Previous technique"
        />
    );
};
