import { memo } from 'react';
import Reanimated, { type SharedValue, interpolate, interpolateColor, useAnimatedStyle } from 'react-native-reanimated';

import { cs } from '@rnw-community/shared';

import { Colors } from '../../../@generic/styles/theme';
import { CellFontSizeConstant } from '../constants/dimensions.contant';

import { FieldCellTextStyles as styles } from './field-cell-text.styles';

import type { CellInterface, Sudoku } from '@suuudokuuu/generator';

const getText = (isActive: boolean, isEmpty: boolean, cell: CellInterface): string => {
    if (isEmpty) {
        return isActive ? '•' : '';
    }

    return cell.value.toString();
};

interface Props {
    readonly sudoku: Sudoku;
    readonly isActive: boolean;
    readonly isActiveValue: boolean;
    readonly isHighlighted: boolean;
    readonly cell: CellInterface;
    readonly animation: SharedValue<number>;
}

const FieldCellTextComponent = ({ sudoku, cell, isHighlighted, isActiveValue, isActive, animation }: Props) => {
    const isEmpty = sudoku.isBlankCell(cell);

    const animatedStyles = useAnimatedStyle(() => ({
        color: interpolateColor(animation.value, [0, 0.5, 1], [Colors.black, Colors.cell.highlightedText, Colors.black]),
        fontSize: interpolate(animation.value, [0, 0.5, 1], [CellFontSizeConstant, CellFontSizeConstant * 2, CellFontSizeConstant]),
        transform: [{ rotate: `${interpolate(animation.value, [0, 1], [0, 360])}deg` }]
    }));

    const textStyles = [
        styles.regular,
        cs(isEmpty, styles.empty),
        cs(isHighlighted, styles.highlighted),
        cs(isActiveValue, styles.activeValue),
        cs(isActive, styles.active),
        // HINT: We can block animation while it is still running by selecting another cell
        cs(animation.value !== 0, animatedStyles)
    ];

    return <Reanimated.Text style={textStyles}>{getText(isActive, isEmpty, cell)}</Reanimated.Text>;
};

export const FieldCellText = memo(
    FieldCellTextComponent,
    (prevProps, nextProps) =>
        prevProps.isActive === nextProps.isActive &&
        prevProps.isActiveValue === nextProps.isActiveValue &&
        prevProps.isHighlighted === nextProps.isHighlighted &&
        prevProps.cell.value === nextProps.cell.value
);
