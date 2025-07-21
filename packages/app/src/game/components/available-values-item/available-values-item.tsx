import { forwardRef, useImperativeHandle } from 'react';
import { Pressable, Text, View } from 'react-native';
import Reanimated, {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming
} from 'react-native-reanimated';

import { type OnEventFn, cs } from '@rnw-community/shared';

import { Colors } from '../../../@generic/styles/theme';
import { CellFontSizeConstant, CellSizeConstant } from '../constants/dimensions.contant';

import { AvailableValueItemSelectors as selectors } from './available-value-item.selectors';
import { AvailableValuesItemStyles as styles } from './available-values-item.styles';

import type { StyleProp, ViewStyle } from 'react-native';

const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);

interface Props {
    readonly value: number;
    readonly canPress: boolean;
    readonly isActive: boolean;
    readonly progress: number;
    readonly correctValue?: number;
    readonly onSelect: OnEventFn<number>;
    readonly cellSize?: number;
    readonly fontSize?: number;
}

export interface AvailableValuesItemRef {
    triggerAnimation: () => void;
}

export const AvailableValuesItem = forwardRef<AvailableValuesItemRef, Props>(
    ({ value, isActive, onSelect, progress, correctValue, canPress, cellSize, fontSize }, ref) => {
        const isCorrect = value === correctValue;
        const pressAnimatedBgColor = isCorrect ? Colors.cell.active : Colors.cell.error;

        // Use dynamic sizes if provided, otherwise fall back to static constants
        const actualCellSize = cellSize ?? CellSizeConstant;
        const actualFontSize = fontSize ?? CellFontSizeConstant;
        const buttonSize = actualCellSize * 1.3;
        const progressHeight = 2;

        const animated = useSharedValue(0);
        const animatedStyles = useAnimatedStyle(() => ({
            backgroundColor: interpolateColor(animated.value, [0, 1], [Colors.white, pressAnimatedBgColor]),
            ...(!isCorrect && {
                transform: [
                    { translateX: interpolate(animated.value, [0, 0.5, 1], [0, -10, 10]) },
                    { rotate: `${interpolate(animated.value, [0, 0.5, 1], [0, -20, 20])}deg` }
                ]
            })
        }));

        const triggerAnimationFn = () => {
            animated.value = withSequence(withTiming(1, { duration: 200 }), withTiming(0, { duration: 200 }));
        };

        useImperativeHandle(ref, () => ({
            triggerAnimation: triggerAnimationFn
        }));

        const handlePress = () => {
            triggerAnimationFn();
            onSelect(value);
        };

        const dynamicButtonStyles = {
            alignItems: 'center' as const,
            borderBottomColor: Colors.value.progress,
            borderBottomWidth: progressHeight,
            borderColor: Colors.value.border,
            borderWidth: 1,
            height: buttonSize,
            justifyContent: 'center' as const,
            width: buttonSize
        };

        const dynamicTextStyles = {
            color: Colors.value.text,
            fontSize: actualFontSize
        };

        const dynamicProgressStyles = {
            backgroundColor: Colors.cell.active,
            height: progressHeight,
            left: 0,
            position: 'absolute' as const,
            top: buttonSize - progressHeight,
            width: `${progress}%`
        } as StyleProp<ViewStyle>;

        const buttonStyles = [dynamicButtonStyles, cs(isActive, styles.wrapperActive), animatedStyles];
        const textStyles = [dynamicTextStyles, cs(isActive, styles.textActive)];

        return (
            <View style={styles.container} testID={selectors.Root}>
                <ReanimatedPressable key={value} style={buttonStyles} testID={selectors.Button} {...(canPress && { onPress: handlePress })}>
                    <Text style={textStyles}>{value}</Text>
                </ReanimatedPressable>

                <View style={dynamicProgressStyles} />
            </View>
        );
    }
);
