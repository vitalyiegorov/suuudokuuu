import { View } from 'react-native';

import { type CellInterface } from '../../interfaces/cell.interface';
import { isGroupEnd } from '../../utils/cell/is-group-end.util';
import { Row } from '../row/row';

import { FieldStyles as styles } from './field.styles';

interface Props {
    field: CellInterface[][];
    selectedCell?: CellInterface;
}

export const Field = ({ field, selectedCell }: Props) => {
    return (
        <View style={styles.wrapper}>
            {field.map((row, i) => (
                <Row key={i} selectedCell={selectedCell} row={i} cells={row} isGroupLast={isGroupEnd(i)} isLastRow={i === row.length - 1} />
            ))}
        </View>
    );
};
