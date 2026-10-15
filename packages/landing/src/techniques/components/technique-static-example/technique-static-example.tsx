import { buildTechniqueExample } from '../../utils/build-technique-example.util';
import { TechniqueExampleBoard } from '../technique-example-board/technique-example-board';

import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import type { ReactNode } from 'react';

interface Props {
    board: string;
    technique: SolutionTechniqueEnum;
    children: ReactNode;
}

export const TechniqueStaticExample = ({ board, children, technique }: Props) => (
    <TechniqueExampleBoard example={buildTechniqueExample(board, technique)}>{children}</TechniqueExampleBoard>
);
