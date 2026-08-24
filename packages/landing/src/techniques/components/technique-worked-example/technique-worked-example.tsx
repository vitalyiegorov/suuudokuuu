import { TECHNIQUE_NAMES } from '../../constants/technique-name.constant';
import { buildTechniqueExample } from '../../utils/build-technique-example.util';
import { TechniqueExampleBoard } from '../technique-example-board/technique-example-board';
import { TechniquePlayableBoard } from '../technique-playable-board/technique-playable-board';

import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import type { ReactNode } from 'react';

interface Props {
    board: string;
    technique: SolutionTechniqueEnum;
    children: ReactNode;
}

export const TechniqueWorkedExample = ({ board, children, technique }: Props) => {
    const example = buildTechniqueExample(board, technique);

    return (
        <TechniquePlayableBoard board={board} technique={technique} techniqueName={TECHNIQUE_NAMES[technique]}>
            <TechniqueExampleBoard example={example}>{children}</TechniqueExampleBoard>
        </TechniquePlayableBoard>
    );
};
