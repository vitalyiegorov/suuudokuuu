import { getCellKey } from '@suuudokuuu/field-core';
import { View } from 'react-native';

import { FieldStyles as styles } from '../../../game/components/field/field.styles';
import { ReplayFieldCell } from '../replay-field-cell/replay-field-cell';

import type { Sudoku } from '@suuudokuuu/generator';

interface Props {
    readonly sudoku: Sudoku;
    readonly cellSize: number;
    readonly cellMargin: number;
    readonly highlightedCellKey?: string;
}

export const ReplayField = ({ sudoku, cellSize, cellMargin, highlightedCellKey }: Props) => (
    <View style={styles.wrapper}>
        {sudoku.Field.map(row => (
            <View key={`row-${row[0].y}`} style={styles.row}>
                {row.map(cell => {
                    const cellKey = getCellKey(cell);
                    const isHighlighted = cellKey === highlightedCellKey;

                    return (
                        <ReplayFieldCell
                            cell={cell}
                            cellMargin={cellMargin}
                            cellSize={cellSize}
                            isHighlighted={isHighlighted}
                            key={cellKey}
                            sudoku={sudoku}
                        />
                    );
                })}
            </View>
        ))}
    </View>
);
