import { useLingui } from '@lingui/react/macro';
import { buildStepScriptState, getCellKey } from '@suuudokuuu/field-core';
import { isEmptyScoredCells } from '@suuudokuuu/generator';
import { type Ref, use, useImperativeHandle, useState } from 'react';
import { View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { GameContext } from '../../context/game.context';
import { gameGetCellKeysToAnimate } from '../../utils/game-get-cell-keys-to-animate.util';
import { gameIncrementCellAnimationGenerations } from '../../utils/game-increment-cell-animation-generations.util';
import { FieldCellCandidates } from '../field-cell-candidates/field-cell-candidates';
import { FieldCellText } from '../field-cell-text/field-cell-text';
import { FieldCell } from '../field-cell/field-cell';
import { FieldWitnessOverlay } from '../field-witness-overlay/field-witness-overlay';

import { FieldStyles as styles } from './field.styles';

import type { OnEventFn } from '@rnw-community/shared';
import type { CellInterface, ScoredCellsInterface } from '@suuudokuuu/generator';

export interface FieldRef {
    triggerAnimation: OnEventFn<ScoredCellsInterface>;
    triggerCellSuccess: OnEventFn<CellInterface>;
}

interface Props {
    readonly cellSize: number;
    readonly cellMargin: number;
    readonly onSelect: OnEventFn<CellInterface | undefined>;
    readonly ref: Ref<FieldRef>;
}

export const Field = ({ cellSize, cellMargin, onSelect, ref }: Props) => {
    const { t } = useLingui();
    const { engine, snapshot } = use(GameContext);

    const sudoku = engine.Sudoku;
    const { explanation } = buildStepScriptState(snapshot.stepScript, snapshot.stepIndex);

    const [comboAnimationGenerations, setComboAnimationGenerations] = useState<Record<string, number>>({});
    const [successGenerations, setSuccessGenerations] = useState<Record<string, number>>({});

    useImperativeHandle(ref, () => ({
        triggerAnimation: (scoredCells: ScoredCellsInterface) => {
            if (isEmptyScoredCells(scoredCells)) {
                return;
            }

            const cellKeysToAnimate = gameGetCellKeysToAnimate(sudoku, scoredCells);

            setComboAnimationGenerations(previousGenerations =>
                gameIncrementCellAnimationGenerations(previousGenerations, cellKeysToAnimate)
            );
        },
        triggerCellSuccess: (cell: CellInterface) => {
            setSuccessGenerations(previousGenerations =>
                gameIncrementCellAnimationGenerations(previousGenerations, new Set([getCellKey(cell)]))
            );
        }
    }));

    const boardAccessibilityLabel = t`Sudoku board, 9 by 9 cells`;
    const isWitnessVisible = isDefined(explanation) && cellSize > 0;
    const filledCells = snapshot.field.flat().filter(cell => cell.value !== 0);

    return (
        <View accessibilityLabel={boardAccessibilityLabel} role="grid" style={styles.wrapper}>
            {snapshot.field.map(row => (
                <View key={`row-${row[0].y}`} role="row" style={styles.row}>
                    {row.map(cell => {
                        const cellKey = getCellKey(cell);

                        return (
                            <FieldCell
                                cell={cell}
                                cellMargin={cellMargin}
                                cellSize={cellSize}
                                key={`cell-${cell.y}-${cell.x}`}
                                onSelect={onSelect}
                                successGeneration={successGenerations[cellKey] ?? 0}
                            >
                                <FieldCellCandidates cell={cell} cellSize={cellSize} />
                                <FieldCellText
                                    cell={cell}
                                    cellSize={cellSize}
                                    comboAnimationGeneration={comboAnimationGenerations[cellKey] ?? 0}
                                />
                            </FieldCell>
                        );
                    })}
                </View>
            ))}
            {isWitnessVisible ? (
                <FieldWitnessOverlay cellMargin={cellMargin} cellSize={cellSize} explanation={explanation} filledCells={filledCells} />
            ) : null}
        </View>
    );
};
