import { useEffect } from 'react';
import { View } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';

import { type OnEventFn } from '@rnw-community/shared';

import { animationDurationConstant } from '../../../@generic';
import type { CellInterface, FieldInterface, ScoredCellsInterface, Sudoku } from '../../../@logic';
import { emptyScoredCells } from '../../../@logic';
import { Cell } from '../field-cell/cell';

import { FieldStyles as styles } from './field.styles';

const textAnimationConfig = { duration: 8 * animationDurationConstant };

interface Props {
    sudoku: Sudoku;
    scoredCells: ScoredCellsInterface;
    field: FieldInterface;
    selectedCell?: CellInterface;
    onSelect: OnEventFn<CellInterface | undefined>;
}

export const Field = ({ field, selectedCell, onSelect, scoredCells, sudoku }: Props) => {
    const textAnimation = useSharedValue(0);

    useEffect(() => {
        if (scoredCells !== emptyScoredCells) {
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
                        const isActive = sudoku.isSameCell(cell, selectedCell);
                        const isActiveValue = sudoku.isSameCellValue(cell, selectedCell);
                        const isHighlighted = sudoku.isCellHighlighted(cell, selectedCell);
                        const hasAnimation = sudoku.isScoredCell(cell, scoredCells);

                        return (
                            <Cell
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
