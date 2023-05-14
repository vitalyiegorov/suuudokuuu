import { cs } from '@rnw-community/shared';
import { Pressable, Text } from 'react-native';

import { useAppDispatch } from '../../hooks/redux.hook';
import { type CellInterface } from '../../interfaces/cell.interface';
import { appRootSelectCellAction } from '../../store/app-root/app-root.actions';

import { CellStyles as styles } from './cell.styles';

interface Props {
    cell: CellInterface;
    isLastGroup?: boolean;
    isLastRow?: boolean;
    isHighlighted?: boolean;
}

export const Cell = ({ cell, isLastGroup = false, isLastRow = false, isHighlighted = false }: Props) => {
    const dispatch = useAppDispatch();

    const handlePress = () => void dispatch(appRootSelectCellAction(cell));

    const cellStyles = [
        styles.cell,
        cs(isLastGroup, styles.cellLastGroup),
        cs(isLastRow, styles.cellLastRow),
        cs(isHighlighted, styles.cellHighlighted)
    ];

    return (
        <Pressable style={cellStyles} onPress={handlePress}>
            <Text>{cell.value}</Text>
        </Pressable>
    );
};
