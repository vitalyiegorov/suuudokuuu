import { View } from 'react-native';

import { isGroupEnd } from '../../utils/is-group-last.util';
import { Row } from '../row/row';

import { FieldStyles as styles } from './field.styles';

export const Field = () => {
    const matrix = Array(9).fill(Array(9).fill(0));

    return (
        <View style={styles.wrapper}>
            {matrix.map((row, i) => (
                <Row key={i} row={i} cells={row} isGroupLast={isGroupEnd(i)} isLastRow={i === matrix.length - 1} />
            ))}
        </View>
    );
};
