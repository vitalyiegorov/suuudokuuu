import { memo } from 'react';
import { Pressable } from 'react-native';
import Reanimated, { type SharedValue, interpolateColor, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';

import { type OnEventFn, cs } from '@rnw-community/shared';

import { Colors, animationDurationConstant } from '../../../@generic';
import type { CellInterface, Sudoku } from '../../../@logic';
import { FieldCellText } from '../field-cell-text/field-cell-text';

import { CellStyles as styles } from './cell.styles';

const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);

const getCellBgColor = (isActiveValue: boolean, isCellHighlighted: boolean) => {
    if (isActiveValue) {
        return Colors.cell.activeValue;
    } else if (isCellHighlighted) {
        return Colors.cell.highlighted;
    }

    return Colors.white;
};

const animationConfig = { duration: animationDurationConstant };

interface Props {
    hasAnimation: boolean;
    textAnimation: SharedValue<number>;
    cell: CellInterface;
    sudoku: Sudoku;
    onSelect: OnEventFn<CellInterface | undefined>;
    isActive: boolean;
    isActiveValue: boolean;
    isHighlighted: boolean;
}

const CellComponent = ({ sudoku, cell, onSelect, isActive, isActiveValue, isHighlighted, hasAnimation, textAnimation }: Props) => {
    const isLastRow = cell.y === 8;
    const isLastCol = cell.x === 8;
    const backgroundColor = getCellBgColor(isActiveValue, isHighlighted);

    const animation = useDerivedValue(() => withTiming(isActive ? 1 : 0, animationConfig));

    const animatedStyles = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(animation.value, [0, 1], [backgroundColor, Colors.cell.active])
    }));

    // eslint-disable-next-line no-undefined
    const handlePress = () => void onSelect(isActive ? undefined : cell);

    const cellStyles = [
        styles.container,
        cs(sudoku.isLastInCellGroupX(cell), styles.groupXEnd),
        cs(sudoku.isLastInCellGroupY(cell), styles.groupYEnd),
        cs(isLastRow, styles.lastRow),
        cs(isLastCol, styles.lastCol),
        animatedStyles
    ];

    return (
        <ReanimatedPressable onPress={handlePress} style={cellStyles}>
            <FieldCellText
                animation={textAnimation}
                hasAnimation={hasAnimation}
                isActive={isActive}
                isActiveValue={isActiveValue}
                isHighlighted={isHighlighted}
                value={cell.value}
            />
        </ReanimatedPressable>
    );
};

export const Cell = memo(
    CellComponent,
    (prevProps, nextProps) =>
        prevProps.cell.value === nextProps.cell.value &&
        prevProps.hasAnimation === nextProps.hasAnimation &&
        prevProps.isActive === nextProps.isActive &&
        prevProps.isActiveValue === nextProps.isActiveValue &&
        prevProps.isHighlighted === nextProps.isHighlighted
);
