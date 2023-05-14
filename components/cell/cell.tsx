import { cs } from '@rnw-community/shared';
import { Pressable, Text } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../hooks/redux.hook';
import { type CellInterface } from '../../interfaces/cell.interface';
import { appRootSelectCellAction } from '../../store/app-root/app-root.actions';
import { appRootSelectedCellSelector } from '../../store/app-root/app-root.selectors';
import { isSameCell } from '../../utils/is-same-cell.util';

import { CellStyles as styles } from './cell.styles';

interface Props {
    cell: CellInterface;
    isLastGroup?: boolean;
    isLastRow?: boolean;
    isHighlighted?: boolean;
}

export const Cell = ({ cell, isLastGroup = false, isLastRow = false, isHighlighted = false }: Props) => {
    const dispatch = useAppDispatch();
    const selectedCell = useAppSelector(appRootSelectedCellSelector);

    const isActive = isSameCell(cell, selectedCell);
    const isActiveValue = cell.value === selectedCell?.value;

    const handlePress = () => void dispatch(appRootSelectCellAction(isActive ? undefined : cell));

    const cellStyles = [
        styles.cell,
        cs(isLastGroup, styles.cellLastGroup),
        cs(isLastRow, styles.cellLastRow),
        cs(isHighlighted, styles.cellHighlighted),
        cs(isActiveValue, styles.cellValueHighlighted),
        cs(isActive, styles.cellActive)
    ];
    const textStyles = [styles.cellText, cs(isActiveValue, styles.cellTextHighlighted), cs(isActive, styles.cellTextActive)];

    return (
        <Pressable style={cellStyles} onPress={handlePress}>
            <Text style={textStyles}>{cell.value}</Text>
        </Pressable>
    );
};
