import { isEmptyScoredCells } from '@suuudokuuu/generator';
import { useEffect } from 'react';
import { View } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';

import { animationDurationConstant } from '../../../@generic/constants/animation.constant';
import { sudoku } from '../../store/sudoku-instance';
import { FieldCell } from '../field-cell/field-cell';

import { FieldStyles as styles } from './field.styles';

import type { OnEventFn } from '@rnw-community/shared';
import type { CellInterface, ScoredCellsInterface } from '@suuudokuuu/generator';

const textAnimationConfig = { duration: 8 * animationDurationConstant };

interface Props {
    readonly scoredCells: ScoredCellsInterface;
    readonly selectedCell?: CellInterface;
    readonly onSelect: OnEventFn<CellInterface | undefined>;
}

export const Field = ({ selectedCell, onSelect, scoredCells }: Props) => {
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
            {sudoku.Field.map(row => (
                <View key={`row-${row[0].y}`} style={styles.row}>
                    {row.map(cell => (
                        <FieldCell
                            cell={cell}
                            hasAnimation={sudoku.isScoredCell(cell, scoredCells)}
                            isActive={sudoku.isSameCell(cell, selectedCell)}
                            isActiveValue={sudoku.isSameCellValue(cell, selectedCell)}
                            isHighlighted={sudoku.isCellHighlighted(cell, selectedCell)}
                            isWrong={sudoku.isCellWrong(cell, selectedCell)}
                            key={`cell-${cell.y}-${cell.x}`}
                            onSelect={onSelect}
                            textAnimation={textAnimation}
                        />
                    ))}
                </View>
            ))}
        </View>
    );
};
