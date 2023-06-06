import { memo, useEffect } from 'react';
import { View } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';

import { type OnEventFn, isDefined } from '@rnw-community/shared';

import { animationDurationConstant } from '../../../@generic';
import type { CellInterface, FieldInterface, ScoredCellsInterface, Sudoku } from '../../../@logic';
import { isEmptyScoredCells, isEqualScoreCells } from '../../../@logic';
import { FieldCell } from '../field-cell/field-cell';

import { FieldStyles as styles } from './field.styles';

const isCellHighlighted = (cell: CellInterface, selectedCell?: CellInterface): boolean =>
    isDefined(selectedCell) && (selectedCell.x === cell.x || selectedCell.y === cell.y || selectedCell.group === cell.group);

const textAnimationConfig = { duration: 8 * animationDurationConstant };

interface Props {
    sudoku: Sudoku;
    scoredCells: ScoredCellsInterface;
    field: FieldInterface;
    selectedCell?: CellInterface;
    onSelect: OnEventFn<CellInterface | undefined>;
}

const FieldComponent = ({ field, selectedCell, onSelect, scoredCells, sudoku }: Props) => {
    const textAnimation = useSharedValue(0);

    useEffect(() => {
        if (!isEmptyScoredCells(scoredCells)) {
            textAnimation.value = withTiming(1, textAnimationConfig, finished => {
                if (finished === true) {
                    textAnimation.value = 0;
                }
            });
        }
    }, [scoredCells, textAnimation]);

    return (
        <View style={styles.wrapper}>
            {field.map(row => (
                <View key={`row-${row[0].y}`} style={styles.row}>
                    {row.map(cell => {
                        const hasAnimation = sudoku.isScoredCell(cell, scoredCells);
                        const isActive = sudoku.isSameCell(cell, selectedCell);
                        const isActiveValue = sudoku.isSameCellValue(cell, selectedCell);
                        const isHighlighted = isCellHighlighted(cell, selectedCell);

                        return (
                            <FieldCell
                                cell={cell}
                                hasAnimation={hasAnimation}
                                isActive={isActive}
                                isActiveValue={isActiveValue}
                                isHighlighted={isHighlighted}
                                key={`cell-${cell.y}-${cell.x}`}
                                onSelect={onSelect}
                                sudoku={sudoku}
                                textAnimation={textAnimation}
                            />
                        );
                    })}
                </View>
            ))}
        </View>
    );
};

export const Field = memo(
    FieldComponent,
    (prevProps, nextProps) =>
        isEqualScoreCells(prevProps.scoredCells, nextProps.scoredCells) &&
        prevProps.field === nextProps.field &&
        prevProps.selectedCell === nextProps.selectedCell
);
