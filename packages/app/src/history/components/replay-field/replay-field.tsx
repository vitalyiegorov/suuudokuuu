import { View } from 'react-native';

import { getCellKey } from '../../../@generic/utils/get-cell-key.util';
import { FieldStyles as styles } from '../../../game/components/field/field.styles';
import { ReplayFieldCell } from '../replay-field-cell/replay-field-cell';

import type { Sudoku } from '@suuudokuuu/generator';

interface Props {
    readonly sudoku: Sudoku;
    readonly cellSize: number;
    readonly highlightedCellKey?: string;
}

export const ReplayField = ({ sudoku, cellSize, highlightedCellKey }: Props) => (
    <View style={styles.wrapper}>
        {sudoku.Field.map(row => (
            <View key={`row-${row[0].y}`} style={styles.row}>
                {row.map(cell => {
                    const cellKey = getCellKey(cell);
                    const isHighlighted = cellKey === highlightedCellKey;

                    return <ReplayFieldCell cell={cell} cellSize={cellSize} isHighlighted={isHighlighted} key={cellKey} sudoku={sudoku} />;
                })}
            </View>
        ))}
    </View>
);
