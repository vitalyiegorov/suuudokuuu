import { StepScriptStepKindEnum, type StepScriptStateInterface } from '@suuudokuuu/field-core';
import { View } from 'react-native';
import Svg from 'react-native-svg';

import { FieldBranchWitness } from '../field-branch-witness/field-branch-witness';
import { FieldChainWitness } from '../field-chain-witness/field-chain-witness';

import { FieldWitnessOverlaySelectors } from './field-witness-overlay.selectors';
import { FieldWitnessOverlayStyles as styles } from './field-witness-overlay.styles';

import type { CellInterface } from '@suuudokuuu/generator';

interface Props {
    readonly cellMargin: number;
    readonly cellSize: number;
    readonly explanation: NonNullable<StepScriptStateInterface['explanation']>;
    readonly filledCells: readonly CellInterface[];
}

export const FieldWitnessOverlay = ({ cellMargin, cellSize, explanation, filledCells }: Props) => {
    const boardSize = cellSize * 9 + cellMargin * 2;
    const isChain = explanation.kind === StepScriptStepKindEnum.SHOW_CHAIN;
    const testID = isChain ? FieldWitnessOverlaySelectors.Chain : FieldWitnessOverlaySelectors.Branch;

    return (
        <View style={styles.overlay}>
            <Svg accessible={false} height={boardSize} pointerEvents="none" testID={testID} width={boardSize}>
                {isChain ? (
                    <FieldChainWitness
                        boardSize={boardSize}
                        cellMargin={cellMargin}
                        cellSize={cellSize}
                        chain={explanation.chain}
                        filledCells={filledCells}
                    />
                ) : (
                    <FieldBranchWitness cellMargin={cellMargin} cellSize={cellSize} step={explanation} />
                )}
            </Svg>
        </View>
    );
};
