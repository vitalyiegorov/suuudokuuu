import { memo } from 'react';
import Reanimated, { type SharedValue, interpolate, interpolateColor, useAnimatedStyle } from 'react-native-reanimated';

import { cs } from '@rnw-community/shared';

import { Colors } from '../../../@generic';
import { BlankCellValueConstant } from '../../../@logic';
import { CellFontSizeConstant } from '../constants/dimensions.contant';

import { FieldCellTextStyles as styles } from './field-cell-text.styles';

interface Props {
    isActive: boolean;
    isActiveValue: boolean;
    isHighlighted: boolean;
    value: number;
    hasAnimation: boolean;
    animation: SharedValue<number>;
}

const FieldCellTextComponent = ({ value, isHighlighted, isActiveValue, isActive, hasAnimation, animation }: Props) => {
    const isEmpty = value === BlankCellValueConstant;
    const cellText = isEmpty ? '' : value.toString();

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
        cs(hasAnimation || animation.value !== 0, animatedStyles)
    ];

    return <Reanimated.Text style={textStyles}>{cellText}</Reanimated.Text>;
};

export const FieldCellText = memo(
    FieldCellTextComponent,
    (prevProps, nextProps) =>
        prevProps.hasAnimation === nextProps.hasAnimation &&
        prevProps.isActive === nextProps.isActive &&
        prevProps.isActiveValue === nextProps.isActiveValue &&
        prevProps.isHighlighted === nextProps.isHighlighted &&
        prevProps.value === nextProps.value
);
