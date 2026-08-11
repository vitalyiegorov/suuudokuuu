import { isEmptyScoredCells } from '@suuudokuuu/generator';
import { type Ref, use, useImperativeHandle, useState } from 'react';
import { View } from 'react-native';

import { getCellKey } from '../../../@generic/utils/get-cell-key.util';
import { GameContext } from '../../context/game.context';
import { gameGetCellKeysToAnimate } from '../../utils/game-get-cell-keys-to-animate.util';
import { gameGetStepState } from '../../utils/game-get-step-state.util';
import { gameIncrementCellAnimationGenerations } from '../../utils/game-increment-cell-animation-generations.util';
import { gameMergeCandidateValues } from '../../utils/game-merge-candidate-values.util';
import { gameNextSuccessCellTrigger } from '../../utils/game-next-success-cell-trigger.util';
import { FieldCell } from '../field-cell/field-cell';
import { FieldCellCandidates } from '../field-cell-candidates/field-cell-candidates';
import { FieldCellText } from '../field-cell-text/field-cell-text';

import { FieldStyles as styles } from './field.styles';

import type { SuccessCellTriggerInterface } from '../../interface/success-cell-trigger.interface';
import type { OnEventFn } from '@rnw-community/shared';
import type { CellInterface, ScoredCellsInterface } from '@suuudokuuu/generator';

const initialSuccessTrigger: SuccessCellTriggerInterface = { key: '', generation: 0 };

export interface FieldRef {
    triggerAnimation: OnEventFn<ScoredCellsInterface>;
    triggerCellSuccess: OnEventFn<CellInterface>;
}

interface Props {
    readonly cellSize: number;
    readonly onSelect: OnEventFn<CellInterface | undefined>;
    readonly ref: Ref<FieldRef>;
}

export const Field = ({ cellSize, onSelect, ref }: Props) => {
    const { engine, snapshot } = use(GameContext);

    const sudoku = engine.Sudoku;
    const { selectedCell } = snapshot;
    const stepState = gameGetStepState(snapshot.stepScript, snapshot.stepIndex);

    const [comboAnimationGenerations, setComboAnimationGenerations] = useState<Record<string, number>>({});
    const [successTrigger, setSuccessTrigger] = useState<SuccessCellTriggerInterface>(initialSuccessTrigger);

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
            setSuccessTrigger(previousTrigger => gameNextSuccessCellTrigger(previousTrigger, getCellKey(cell)));
        }
    }));

    return (
        <View style={styles.wrapper}>
            {snapshot.field.map(row => (
                <View key={`row-${row[0].y}`} style={styles.row}>
                    {row.map(cell => {
                        const cellKey = getCellKey(cell);
                        const isActive = sudoku.isSameCell(cell, selectedCell);
                        const isActiveValue = sudoku.isSameCellValue(cell, selectedCell);
                        const isHighlighted = sudoku.isCellHighlighted(cell, selectedCell);
                        const isWrong = sudoku.isCellWrong(cell, selectedCell);
                        const isEmpty = sudoku.isBlankCell(cell);

                        const isPatternCell = stepState.patternCellKeys.has(cellKey);
                        const isTargetCell = stepState.targetCellKey === cellKey;
                        const eliminatedCandidates = stepState.eliminatedCandidates.get(cellKey) ?? [];
                        const hintedCandidates = gameMergeCandidateValues(
                            stepState.revealedCandidates.get(cellKey) ?? [],
                            eliminatedCandidates
                        );
                        const cellCandidates = gameMergeCandidateValues(engine.getCellCandidates(cell), hintedCandidates);
                        const shouldShowCandidates = isEmpty && cellCandidates.length > 0;

                        return (
                            <FieldCell
                                cell={cell}
                                cellSize={cellSize}
                                isActive={isActive}
                                isActiveValue={isActiveValue}
                                isEmpty={isEmpty}
                                isHighlighted={isHighlighted}
                                isPatternCell={isPatternCell}
                                isSuccessTarget={successTrigger.key === cellKey}
                                isTargetCell={isTargetCell}
                                isWrong={isWrong}
                                key={`cell-${cell.y}-${cell.x}`}
                                onSelect={onSelect}
                                successGeneration={successTrigger.generation}
                            >
                                {shouldShowCandidates ? (
                                    <FieldCellCandidates
                                        activeValue={selectedCell?.value}
                                        candidates={cellCandidates}
                                        cellSize={cellSize}
                                        eliminatedCandidates={eliminatedCandidates}
                                    />
                                ) : null}
                                <FieldCellText
                                    cell={cell}
                                    cellSize={cellSize}
                                    comboAnimationGeneration={comboAnimationGenerations[cellKey] ?? 0}
                                    isActive={isActive}
                                    isActiveValue={isActiveValue}
                                    isEmpty={isEmpty}
                                    isHighlighted={isHighlighted}
                                    showAutoCandidates={shouldShowCandidates}
                                />
                            </FieldCell>
                        );
                    })}
                </View>
            ))}
        </View>
    );
};
