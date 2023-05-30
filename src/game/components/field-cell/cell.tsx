import { memo } from 'react';
import { Pressable } from 'react-native';
import Reanimated, { interpolateColor, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';

import { type OnEventFn, cs } from '@rnw-community/shared';

import { Colors } from '../../../@generic';
import { animationDurationConstant } from '../../../@generic/constants/animation.constant';
import type { CellInterface } from '../../../@logic';
import { FieldGroupWidthConstant, FieldSizeConstant } from '../../../@logic';
import { FieldCellText } from '../field-cell-text/field-cell-text';

import { CellStyles as styles } from './cell.styles';

const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);

const isGroupEnd = (index: number): boolean => index < FieldSizeConstant - 1 && (index + 1) % FieldGroupWidthConstant === 0;
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
    cell: CellInterface;
    onSelect: OnEventFn<CellInterface | undefined>;
    isActive: boolean;
    isActiveValue: boolean;
    isScored: boolean;
    isHighlighted: boolean;
}

const CellComponent = ({ cell, onSelect, isActive, isActiveValue, isHighlighted, isScored }: Props) => {
    const isLastRow = cell.y === 8;
    const isLastCol = cell.x === 8;
    const backgroundColor = getCellBgColor(isActiveValue, isHighlighted);

    const animation = useDerivedValue(() => withTiming(isActive ? 1 : 0, animationConfig));

    const animatedStyles = useAnimatedStyle(
        () => ({
            backgroundColor: interpolateColor(animation.value, [0, 1], [backgroundColor, Colors.cell.active])
        }),
        [animation, backgroundColor]
    );

    // eslint-disable-next-line no-undefined
    const handlePress = () => void onSelect(isActive ? undefined : cell);

    const cellStyles = [
        styles.container,
        cs(isGroupEnd(cell.x), styles.groupXEnd),
        cs(isGroupEnd(cell.y), styles.groupYEnd),
        cs(isLastRow, styles.lastRow),
        cs(isLastCol, styles.lastCol),
        animatedStyles
    ];

    return (
        <ReanimatedPressable onPress={handlePress} style={cellStyles}>
            <FieldCellText
                isActive={isActive}
                isActiveValue={isActiveValue}
                isHighlighted={isHighlighted}
                isScored={isScored}
                value={cell.value}
            />
        </ReanimatedPressable>
    );
};

export const Cell = memo(
    CellComponent,
    (prevProps, nextProps) =>
        prevProps.cell.value === nextProps.cell.value &&
        prevProps.isActive === nextProps.isActive &&
        prevProps.isActiveValue === nextProps.isActiveValue &&
        prevProps.isHighlighted === nextProps.isHighlighted &&
        prevProps.isScored === nextProps.isScored
);
