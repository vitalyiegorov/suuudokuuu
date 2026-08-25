import { isDefined } from '@rnw-community/shared';

import type { TechniqueExampleInterface } from '../../interfaces/technique-example.interface';

interface Props {
    example: TechniqueExampleInterface;
}

export const TechniqueExampleSolverOutput = ({ example }: Props) => {
    const hasPlacement = isDefined(example.placement);
    const resultTerm = hasPlacement ? 'Placement' : 'Eliminations';
    const placementText = isDefined(example.placement) ? `${example.placement.value} in ${example.placement.label}` : '';
    const eliminationText = example.eliminations.map(elimination => `${elimination.value} from ${elimination.label}`).join(', ');
    const resultText = hasPlacement ? placementText : eliminationText;

    return (
        <dl className="solver-output">
            <dt className="solver-output__term">Pattern cells</dt>
            <dd className="solver-output__description">{example.patternCellLabels.join(', ')}</dd>
            <dt className="solver-output__term">{resultTerm}</dt>
            <dd className="solver-output__description">{resultText}</dd>
        </dl>
    );
};
