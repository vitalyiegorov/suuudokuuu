import { View } from 'react-native';

import { type CellInterface } from '../../interfaces/cell.interface';
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
                <Row key={`row-${i}`} selectedCell={selectedCell} cells={row} />
            ))}
        </View>
    );
};
