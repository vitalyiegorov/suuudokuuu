import { cs } from '@rnw-community/shared';
import { memo } from 'react';
import { Pressable, Text } from 'react-native';

import { BlankCellValueContant } from '../../constants/blank-cell-value.contant';
import { useAppDispatch } from '../../hooks/redux.hook';
import { type CellInterface } from '../../interfaces/cell.interface';
import { appRootSelectCellAction } from '../../store/app-root/app-root.actions';
import { isCellHighlighted } from '../../utils/cell/is-cell-highlighted.util';
import { isGroupEnd } from '../../utils/cell/is-group-end.util';
import { isSameCell } from '../../utils/cell/is-same-cell.util';

import { CellStyles as styles } from './cell.styles';

interface Props {
    cell: CellInterface;
    selectedCell?: CellInterface;
}

const CellComponent = ({ cell, selectedCell }: Props) => {
    const dispatch = useAppDispatch();

    const isLastRow = cell.y === 8;
    const isLastCol = cell.x === 8;
    const isActive = isSameCell(cell, selectedCell);
    const isActiveValue = cell.value === selectedCell?.value && cell.value !== BlankCellValueContant;

    const value = cell.value === BlankCellValueContant ? '' : cell.value.toString();

    const handlePress = () => void dispatch(appRootSelectCellAction(isActive ? undefined : cell));

    const cellStyles = [
        styles.cell,
        cs(isGroupEnd(cell.x), styles.cellGroupXEnd),
        cs(isGroupEnd(cell.y), styles.cellGroupYEnd),
        cs(isCellHighlighted(cell, selectedCell), styles.cellHighlighted),
        cs(isActiveValue, styles.cellHighlightedValue),
        cs(isActive, styles.cellActive),
        cs(isLastRow, styles.cellLastRow),
        cs(isLastCol, styles.cellLastCol)
    ];
    const textStyles = [styles.cellText, cs(isActiveValue, styles.cellHighlightedText), cs(isActive, styles.cellActiveText)];

    return (
        <Pressable style={cellStyles} onPress={handlePress}>
            <Text style={textStyles}>{value}</Text>
        </Pressable>
    );
};

export const Cell = memo(CellComponent);
