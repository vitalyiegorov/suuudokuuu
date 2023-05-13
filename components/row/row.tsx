import { cs } from '@rnw-community/shared';
import { View } from 'react-native';

import { type CellInterface } from '../../interfaces/cell.interface';
import { isGroupEnd } from '../../utils/is-group-last.util';
import { Cell } from '../cell/cell';

import { RowStyles as styles } from './row.styles';

interface Props {
    row: number;
    cells: CellInterface[];
    isGroupLast?: boolean;
    isLastRow?: boolean;
}

export const Row = ({ row, cells, isGroupLast = false, isLastRow = false }: Props) => {
    const rowStyles = [styles.row, cs(isGroupLast, styles.rowLast)];

    return (
        <View style={rowStyles}>
            {cells.map((cell, i) => (
                <Cell key={row + i} cell={cell} isLastGroup={isGroupEnd(i)} isLastRow={isLastRow} />
            ))}
        </View>
    );
};
