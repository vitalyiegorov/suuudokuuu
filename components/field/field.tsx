import { View } from 'react-native';

import { type CellInterface } from '../../interfaces/cell.interface';
import { isGroupEnd } from '../../utils/is-group-last.util';
import { Row } from '../row/row';

import { FieldStyles as styles } from './field.styles';

const createMatrix = (): CellInterface[][] => {
    const matrix: CellInterface[] = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            matrix.push({
                group: Math.floor(i / 3) * 3 + Math.floor(j / 3) + 1,
                value: 0,
                x: i,
                y: j
            });
        }
    }

    return matrix;
};

export const Field = () => {
    const rows = Array(9).fill(Array(9).fill(0));

    return (
        <View style={styles.wrapper}>
            {rows.map((row, i) => (
                <Row key={i} row={i} cells={getRowCells(i)} isGroupLast={isGroupEnd(i)} isLastRow={i === rows.length - 1} />
            ))}
        </View>
    );
};
