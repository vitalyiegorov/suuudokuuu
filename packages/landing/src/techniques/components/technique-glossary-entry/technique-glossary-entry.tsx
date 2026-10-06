import { TECHNIQUE_PAGE_PATHS } from '../../constants/technique-page-path.constant';
import { TechniqueLink } from '../technique-link/technique-link';

import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import type { ReactNode } from 'react';

interface Props {
    technique: SolutionTechniqueEnum;
    children: ReactNode;
}

export const TechniqueGlossaryEntry = ({ children, technique }: Props) => (
    <div className="glossary-entry">
        <dt id={TECHNIQUE_PAGE_PATHS[technique].split('/').at(-1)}>
            <TechniqueLink technique={technique} />
        </dt>
        <dd>{children}</dd>
    </div>
);
