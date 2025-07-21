import { memo, useImperativeHandle } from 'react';
import Reanimated, { interpolate, interpolateColor, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { cs } from '@rnw-community/shared';

import { animationDurationConstant } from '../../../@generic/constants/animation.constant';
import { Colors } from '../../../@generic/styles/theme';
import { CellFontSizeConstant } from '../constants/dimensions.contant';

import { FieldCellTextStyles as styles } from './field-cell-text.styles';

const textAnimationConfig = { duration: 8 * animationDurationConstant };

export interface FieldCellTextRef {
    triggerAnimation: () => void;
}

interface Props {
    readonly isActive: boolean;
    readonly isActiveValue: boolean;
    readonly isHighlighted: boolean;
    readonly children: string;
    readonly ref?: React.Ref<FieldCellTextRef>;
}

const FieldCellTextComponent = ({ children, isHighlighted, isActiveValue, isActive, ref }: Props) => {
    const animation = useSharedValue(0);

    const resetAnimation = () => {
        animation.value = 0;
    };

    const triggerAnimation = () => {
        animation.value = withTiming(1, textAnimationConfig, finished => {
            if (finished === true) {
                runOnJS(resetAnimation)();
            }
        });
    };

    useImperativeHandle(ref, () => ({
        triggerAnimation
    }));

    const animatedStyles = useAnimatedStyle(() => ({
        color: interpolateColor(animation.value, [0, 0.5, 1], [Colors.black, Colors.cell.highlightedText, Colors.black]),
        fontSize: interpolate(animation.value, [0, 0.5, 1], [CellFontSizeConstant, CellFontSizeConstant * 2, CellFontSizeConstant]),
        transform: [{ rotate: `${interpolate(animation.value, [0, 1], [0, 360])}deg` }]
    }));

    const textStyles = [
        styles.regular,
        cs(children === '' || children === '•', styles.empty),
        cs(isHighlighted, styles.highlighted),
        cs(isActiveValue, styles.activeValue),
        cs(isActive, styles.active),
        cs(animation.value !== 0, animatedStyles)
    ];

    return <Reanimated.Text style={textStyles}>{children}</Reanimated.Text>;
};

export const FieldCellText = memo(
    FieldCellTextComponent,
    (prevProps, nextProps) =>
        prevProps.isActive === nextProps.isActive &&
        prevProps.isActiveValue === nextProps.isActiveValue &&
        prevProps.isHighlighted === nextProps.isHighlighted &&
        prevProps.children === nextProps.children
);
