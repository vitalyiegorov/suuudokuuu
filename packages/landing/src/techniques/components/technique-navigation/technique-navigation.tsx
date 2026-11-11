import { PageChain } from '../../../seo/components/page-chain/page-chain';
import { TECHNIQUE_NAMES } from '../../constants/technique-name.constant';
import { TECHNIQUE_PAGE_LADDER } from '../../constants/technique-page-ladder.constant';
import { TECHNIQUE_PAGE_PATHS } from '../../constants/technique-page-path.constant';

import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

interface Props {
    readonly technique: SolutionTechniqueEnum;
}

export const TechniqueNavigation = ({ technique }: Props) => {
    const techniqueIndex = TECHNIQUE_PAGE_LADDER.indexOf(technique);
    const previousTechnique = TECHNIQUE_PAGE_LADDER[techniqueIndex - 1];
    const nextTechnique = TECHNIQUE_PAGE_LADDER[techniqueIndex + 1];
    const hasPrevious = techniqueIndex > 0;
    const hasNext = techniqueIndex < TECHNIQUE_PAGE_LADDER.length - 1;

    return (
        <PageChain
            ariaLabel="Technique difficulty chain"
            nextLabel="Continue to"
            previousLabel="Previous technique"
            {...(hasPrevious && { previous: { path: TECHNIQUE_PAGE_PATHS[previousTechnique], title: TECHNIQUE_NAMES[previousTechnique] } })}
            {...(hasNext && { next: { path: TECHNIQUE_PAGE_PATHS[nextTechnique], title: TECHNIQUE_NAMES[nextTechnique] } })}
        />
    );
};
