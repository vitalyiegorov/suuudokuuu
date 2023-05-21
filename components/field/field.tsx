import { type OnEventFn } from '@rnw-community/shared';
import { View } from 'react-native';

import { type CellInterface } from '../../interfaces/cell.interface';
import { isCellHighlighted } from '../../utils/cell/is-cell-highlighted.util';
import { isSameCellValue } from '../../utils/cell/is-same-cell-value.util';
import { isSameCell } from '../../utils/cell/is-same-cell.util';
import { Cell } from '../field-cell/cell';

import { FieldStyles as styles } from './field.styles';

interface Props {
    field: CellInterface[][];
    selectedCell?: CellInterface;
    onSelect: OnEventFn<CellInterface | undefined>;
}

export const Field = ({ field, selectedCell, onSelect }: Props) => {
    return (
        <View style={styles.wrapper}>
            {field.map(row => (
                <View key={`row-${row[0].y}`} style={styles.row}>
                    {row.map(cell => (
                        <Cell
                            key={`cell-${cell.y}-${cell.x}`}
                            cell={cell}
                            onSelect={onSelect}
                            isActive={isSameCell(cell, selectedCell)}
                            isActiveValue={isSameCellValue(cell, selectedCell)}
                            isCellHighlighted={isCellHighlighted(cell, selectedCell)}
                        />
                    ))}
                </View>
            ))}
        </View>
    );
};
