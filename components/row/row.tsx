import { cs } from '@rnw-community/shared';
import { View } from 'react-native';

import { useAppSelector } from '../../hooks/redux.hook';
import { type CellInterface } from '../../interfaces/cell.interface';
import { appRootSelectedCellSelector } from '../../store/app-root/app-root.selectors';
import { isCellHighlighted } from '../../utils/cell/is-cell-highlighted.util';
import { isGroupEnd } from '../../utils/cell/is-group-end.util';
import { Cell } from '../cell/cell';

import { RowStyles as styles } from './row.styles';

interface Props {
    row: number;
    cells: CellInterface[];
    isGroupLast?: boolean;
    isLastRow?: boolean;
}

export const Row = ({ row, cells, isGroupLast = false, isLastRow = false }: Props) => {
    const selectedCell = useAppSelector(appRootSelectedCellSelector);

    const rowStyles = [styles.row, cs(isGroupLast, styles.rowLast)];

    return (
        <View style={rowStyles}>
            {cells.map((cell, i) => (
                <Cell
                    key={row + i}
                    cell={cell}
                    isLastGroup={isGroupEnd(i)}
                    isLastRow={isLastRow}
                    isHighlighted={isCellHighlighted(cell, selectedCell)}
                />
            ))}
        </View>
    );
};
