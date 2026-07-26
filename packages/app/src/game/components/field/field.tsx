import { isEmptyScoredCells } from '@suuudokuuu/generator';
import { type Ref, use, useImperativeHandle, useState } from 'react';
import { View } from 'react-native';

import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { getCellKey } from '../../../@generic/utils/get-cell-key.util';
import { GameContext } from '../../context/game.context';
import { gameCandidatesSelector, gameShowAutoCandidatesSelector } from '../../store/game.selectors';
import { gameGetCellKeysToAnimate } from '../../utils/game-get-cell-keys-to-animate.util';
import { gameIncrementCellAnimationGenerations } from '../../utils/game-increment-cell-animation-generations.util';
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
    readonly selectedCell?: CellInterface;
    readonly onSelect: OnEventFn<CellInterface | undefined>;
    readonly ref: Ref<FieldRef>;
}

export const Field = ({ cellSize, selectedCell, onSelect, ref }: Props) => {
    const { sudoku } = use(GameContext);

    const showAutoCandidates = useAppSelector(gameShowAutoCandidatesSelector);
    const candidates = useAppSelector(gameCandidatesSelector);

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
            {sudoku.Field.map(row => (
                <View key={`row-${row[0].y}`} style={styles.row}>
                    {row.map(cell => {
                        const cellKey = getCellKey(cell);
                        const isActive = sudoku.isSameCell(cell, selectedCell);
                        const isActiveValue = sudoku.isSameCellValue(cell, selectedCell);
                        const isHighlighted = sudoku.isCellHighlighted(cell, selectedCell);
                        const isWrong = sudoku.isCellWrong(cell, selectedCell);
                        const isEmpty = sudoku.isBlankCell(cell);

                        const cellCandidates = showAutoCandidates ? sudoku.getCellCandidates(cell) : (candidates[cellKey] ?? []);
                        const shouldShowCandidates = isEmpty && cellCandidates.length > 0;

                        return (
                            <FieldCell
                                cell={cell}
                                cellSize={cellSize}
                                isActive={isActive}
                                isActiveValue={isActiveValue}
                                isEmpty={isEmpty}
                                isHighlighted={isHighlighted}
                                isSuccessTarget={successTrigger.key === cellKey}
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
