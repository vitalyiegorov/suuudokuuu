import { useLingui } from '@lingui/react/macro';
import { buildStepScriptState, getCellKey } from '@suuudokuuu/field-core';
import { isEmptyScoredCells } from '@suuudokuuu/generator';
import { type Ref, use, useImperativeHandle, useState } from 'react';
import { View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { GameContext } from '../../context/game.context';
import { gameGetCellAccessibilityLabel } from '../../utils/game-get-cell-accessibility-label.util';
import { gameGetCellKeysToAnimate } from '../../utils/game-get-cell-keys-to-animate.util';
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
    readonly cellMargin: number;
    readonly onSelect: OnEventFn<CellInterface | undefined>;
    readonly ref: Ref<FieldRef>;
}

// eslint-disable-next-line max-lines-per-function -- Layout/form component requires many lines
export const Field = ({ cellSize, cellMargin, onSelect, ref }: Props) => {
    const { i18n, t } = useLingui();
    const { engine, snapshot } = use(GameContext);

    const sudoku = engine.Sudoku;
    const { selectedCell } = snapshot;
    const stepState = buildStepScriptState(snapshot.stepScript, snapshot.stepIndex);

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

    const boardAccessibilityLabel = t`Sudoku board, 9 by 9 cells`;
    const isHintActive = isDefined(snapshot.stepScript);

    return (
        <View accessibilityLabel={boardAccessibilityLabel} role="grid" style={styles.wrapper}>
            {snapshot.field.map(row => (
                <View key={`row-${row[0].y}`} role="row" style={styles.row}>
                    {row.map(cell => {
                        const cellKey = getCellKey(cell);
                        const isActive = sudoku.isSameCell(cell, selectedCell);
                        const isActiveValue = sudoku.isSameCellValue(cell, selectedCell) && !isHintActive;
                        const isHighlighted = sudoku.isCellHighlighted(cell, selectedCell) && !isHintActive;
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
                        const shouldShowCandidates =
                            isEmpty && cellCandidates.length > 0 && !isDefined(stepState.placedValues.get(cellKey));
                        const cellAccessibilityLabel = i18n._(
                            gameGetCellAccessibilityLabel({
                                candidates: cellCandidates,
                                cell,
                                isEmpty,
                                isWrong
                            })
                        );

                        return (
                            <FieldCell
                                accessibilityLabel={cellAccessibilityLabel}
                                cell={cell}
                                cellMargin={cellMargin}
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
                                    hintValue={stepState.placedValues.get(cellKey)}
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
