import { memo } from 'react';
import { View } from 'react-native';

import { type CellInterface } from '../../interfaces/cell.interface';
import { Cell } from '../cell/cell';

import { RowStyles as styles } from './row.styles';

interface Props {
    cells: CellInterface[];
    selectedCell?: CellInterface;
}

// TODO: Do we need rows?
const RowComponent = ({ cells, selectedCell }: Props) => {
    return (
        <View style={styles.row}>
            {cells.map(cell => (
                <Cell selectedCell={selectedCell} key={`${cell.x}-${cell.y}`} cell={cell} />
            ))}
        </View>
    );
};

export const Row = memo(RowComponent);
