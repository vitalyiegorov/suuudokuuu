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
}

export interface AvailableValuesItemRef {
    triggerAnimation: () => void;
}

// TODO: Add animation when correct value is selected
export const AvailableValuesItem = forwardRef<AvailableValuesItemRef, Props>(({ value, isActive, onSelect, progress, correctValue, canPress }, ref) => {
    const isCorrect = value === correctValue;
    const pressAnimatedBgColor = isCorrect ? Colors.cell.active : Colors.cell.error;

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

    const buttonStyles = [styles.button, cs(isActive, styles.wrapperActive), animatedStyles];
    const textStyles = [styles.text, cs(isActive, styles.textActive)];
    const progressStyles = [styles.progress, { width: `${progress}%` }] as StyleProp<ViewStyle>;

    return (
        <View style={styles.container} testID={selectors.Root}>
            <ReanimatedPressable key={value} style={buttonStyles} testID={selectors.Button} {...(canPress && { onPress: handlePress })}>
                <Text style={textStyles}>{value}</Text>
            </ReanimatedPressable>

            <View style={progressStyles} />
        </View>
    );
});
