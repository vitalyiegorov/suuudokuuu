import { forwardRef, memo, useCallback, useImperativeHandle } from 'react';
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
}

const FieldCellTextComponent = forwardRef<FieldCellTextRef, Props>(({ children, isHighlighted, isActiveValue, isActive }, ref) => {
    const animation = useSharedValue(0);

    const resetAnimation = useCallback(() => {
        animation.value = 0;
    }, [animation]);

    const triggerAnimation = useCallback(() => {
        animation.value = withTiming(1, textAnimationConfig, finished => {
            if (finished === true) {
                runOnJS(resetAnimation)();
            }
        });
    }, [animation, resetAnimation]);

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
        // HINT: We can block animation while it is still running by selecting another cell
        cs(animation.value !== 0, animatedStyles)
    ];

    return <Reanimated.Text style={textStyles}>{children}</Reanimated.Text>;
});

export const FieldCellText = memo(
    FieldCellTextComponent,
    (prevProps, nextProps) =>
        prevProps.isActive === nextProps.isActive &&
        prevProps.isActiveValue === nextProps.isActiveValue &&
        prevProps.isHighlighted === nextProps.isHighlighted &&
        prevProps.children === nextProps.children
);
