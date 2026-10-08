import { StepScriptStepKindEnum, type StepScriptStateInterface } from '@suuudokuuu/field-core';
import { View } from 'react-native';

import { FieldBranchWitness } from '../field-branch-witness/field-branch-witness';
import { FieldChainWitness } from '../field-chain-witness/field-chain-witness';

import { FieldWitnessOverlayStyles as styles } from './field-witness-overlay.styles';

import type { CellInterface } from '@suuudokuuu/generator';

interface Props {
    readonly cellMargin: number;
    readonly cellSize: number;
    readonly explanation: NonNullable<StepScriptStateInterface['explanation']>;
    readonly filledCells: readonly CellInterface[];
}

export const FieldWitnessOverlay = ({ cellMargin, cellSize, explanation, filledCells }: Props) => {
    const isChain = explanation.kind === StepScriptStepKindEnum.SHOW_CHAIN;

    return (
        <View style={styles.overlay}>
            {isChain ? (
                <FieldChainWitness
                    cellMargin={cellMargin}
                    cellSize={cellSize}
                    chain={explanation.chain}
                    filledCells={filledCells}
                    visibleLength={explanation.visibleLength}
                />
            ) : (
                <FieldBranchWitness
                    branch={explanation.branch}
                    cellMargin={cellMargin}
                    cellSize={cellSize}
                    filledCells={filledCells}
                    showOutcome={explanation.showOutcome}
                    visibleImplicationCount={explanation.visibleImplicationCount}
                />
            )}
        </View>
    );
};
