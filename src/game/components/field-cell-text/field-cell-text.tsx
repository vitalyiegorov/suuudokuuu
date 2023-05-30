import { useEffect } from 'react';
import Reanimated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { cs } from '@rnw-community/shared';

import { Colors } from '../../../@generic';
import { animationDurationConstant } from '../../../@generic/constants/animation.constant';
import { BlankCellValueConstant } from '../../../@logic';
import { CellFontSizeConstant } from '../constants/dimensions.contant';

import { FieldCellTextStyles as styles } from './field-cell-text.styles';

const animationConfig = { duration: 8 * animationDurationConstant };

interface Props {
    isScored: boolean;
    isActive: boolean;
    isActiveValue: boolean;
    isHighlighted: boolean;
    value: number;
}

export const FieldCellText = ({ value, isHighlighted, isScored, isActiveValue, isActive }: Props) => {
    const isEmpty = value === BlankCellValueConstant;
    const cellText = isEmpty ? '·' : value.toString();

    const animation = useSharedValue(0);

    // TODO: Repetitive animation does not work
    useEffect(() => {
        if (isScored) {
            animation.value = withTiming(1, animationConfig, finished => {
                // eslint-disable-next-line no-undefined
                if (finished !== undefined && finished) {
                    animation.value = 0;
                }
            });
        }
    }, [animation, isScored]);

    const animatedStyles = useAnimatedStyle(
        () => ({
            color: interpolateColor(animation.value, [0, 0.5, 1], [Colors.black, Colors.cell.highlightedText, Colors.black]),
            fontSize: interpolate(animation.value, [0, 0.5, 1], [CellFontSizeConstant, CellFontSizeConstant * 2, CellFontSizeConstant]),
            transform: [{ rotate: `${interpolate(animation.value, [0, 1], [0, 360])}deg` }]
        }),
        [animation]
    );

    const textStyles = [
        styles.regular,
        cs(isEmpty, styles.empty),
        cs(isHighlighted, styles.highlighted),
        cs(isActiveValue, styles.activeValue),
        cs(isActive, styles.active),
        animatedStyles
    ];

    return <Reanimated.Text style={textStyles}>{cellText}</Reanimated.Text>;
};
