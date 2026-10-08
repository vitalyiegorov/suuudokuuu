import Svg from 'react-native-svg';

import { FieldBranchWitnessCandidates } from '../field-branch-witness-candidates/field-branch-witness-candidates';
import { FieldBranchWitnessEvidence } from '../field-branch-witness-evidence/field-branch-witness-evidence';
import { FieldBranchWitnessLinks } from '../field-branch-witness-links/field-branch-witness-links';
import { FieldWitnessLinkMask } from '../field-witness-link-mask/field-witness-link-mask';
import { FieldWitnessOverlaySelectors } from '../field-witness-overlay/field-witness-overlay.selectors';

import type { CellInterface } from '@suuudokuuu/generator';
import type { ForcingBranchInterface } from '@suuudokuuu/techniques';

interface Props {
    readonly branch: ForcingBranchInterface;
    readonly cellMargin: number;
    readonly cellSize: number;
    readonly filledCells: readonly CellInterface[];
    readonly showOutcome: boolean;
    readonly visibleImplicationCount: number;
}

export const FieldBranchWitness = ({ branch, cellMargin, cellSize, filledCells, showOutcome, visibleImplicationCount }: Props) => {
    const visibleImplications = branch.implications.slice(0, visibleImplicationCount);
    const boardSize = cellSize * 9 + cellMargin * 2;

    return (
        <Svg accessible={false} height={boardSize} pointerEvents="none" testID={FieldWitnessOverlaySelectors.Branch} width={boardSize}>
            <FieldWitnessLinkMask boardSize={boardSize} cellMargin={cellMargin} cellSize={cellSize} filledCells={filledCells}>
                <FieldBranchWitnessLinks
                    branch={branch}
                    cellMargin={cellMargin}
                    cellSize={cellSize}
                    visibleImplications={visibleImplications}
                />
            </FieldWitnessLinkMask>
            <FieldBranchWitnessEvidence
                branch={branch}
                cellMargin={cellMargin}
                cellSize={cellSize}
                showOutcome={showOutcome}
                visibleImplications={visibleImplications}
            />
            <FieldBranchWitnessCandidates
                branch={branch}
                cellMargin={cellMargin}
                cellSize={cellSize}
                visibleImplications={visibleImplications}
            />
        </Svg>
    );
};
