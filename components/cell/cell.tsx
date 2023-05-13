import { cs } from '@rnw-community/shared';
import { View, Text } from 'react-native';

import { type CellInterface } from '../../interfaces/cell.interface';

import { CellStyles as styles } from './cell.styles';

interface Props {
    cell: CellInterface;
    isLastGroup?: boolean;
    isLastRow?: boolean;
    isHighlighted?: boolean;
}

export const Cell = ({ cell, isLastGroup = false, isLastRow = false, isHighlighted = false }: Props) => {
    const cellStyles = [
        styles.cell,
        cs(isLastGroup, styles.cellLastGroup),
        cs(isLastRow, styles.cellLastRow),
        cs(isHighlighted, styles.cellHighlighted)
    ];

    return (
        <View style={cellStyles}>
            <Text>{cell.value}</Text>
        </View>
    );
};
