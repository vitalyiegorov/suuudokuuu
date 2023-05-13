import { cs } from '@rnw-community/shared';
import { View } from 'react-native';

import { type CellInterface } from '../../interfaces/cell.interface';
import { isCellHighlighted } from '../../utils/is-cell-highlighted.util';
import { isGroupEnd } from '../../utils/is-group-last.util';
import { Cell } from '../cell/cell';

import { RowStyles as styles } from './row.styles';

interface Props {
    row: number;
    cells: CellInterface[];
    isGroupLast?: boolean;
    isLastRow?: boolean;
}

const activeCell: CellInterface = {
    group: 1,
    value: 1,
    x: 1,
    y: 1
};

export const Row = ({ row, cells, isGroupLast = false, isLastRow = false }: Props) => {
    const rowStyles = [styles.row, cs(isGroupLast, styles.rowLast)];

    return (
        <View style={rowStyles}>
            {cells.map((cell, i) => (
                <Cell
                    key={row + i}
                    cell={cell}
                    isLastGroup={isGroupEnd(i)}
                    isLastRow={isLastRow}
                    isHighlighted={isCellHighlighted(activeCell, cell)}
                />
            ))}
        </View>
    );
};
