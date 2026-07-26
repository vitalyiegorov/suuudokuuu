import { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

import { useReduceMotionEnabled } from '../../hooks/use-reduce-motion-enabled.hook';
import { resolveUnistyleForAnimated } from '../../utils/resolve-unistyle-for-animated.util';

import { AppToggleStyles as styles } from './app-toggle.styles';
import { AppTogglePressTimingConfig, AppTogglePressedScale, AppToggleSpringConfig } from './constant/app-toggle-animation.constant';
import { AppToggleDisabledOpacity } from './constant/app-toggle-disabled-opacity.constant';
import { AppToggleTranslateX } from './constant/app-toggle-size.constant';
import { appToggleGetColors } from './utils/app-toggle-get-colors.util';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
    readonly disabled?: boolean;
    readonly onValueChange: (value: boolean) => void;
    readonly testID?: string;
    readonly value: boolean;
}

export const AppToggle = ({ disabled = false, onValueChange, testID, value }: Props) => {
    const { theme } = useUnistyles();
    const isReduceMotionEnabled = useReduceMotionEnabled();
    const progress = useSharedValue(value ? 1 : 0);
    const pressed = useSharedValue(0);

    useEffect(() => {
        const targetProgress = value ? 1 : 0;

        progress.value = isReduceMotionEnabled ? targetProgress : withSpring(targetProgress, AppToggleSpringConfig);
    }, [value, isReduceMotionEnabled, progress]);

    const offColors = appToggleGetColors(theme, false);
    const onColors = appToggleGetColors(theme, true);

    const handlePress = () => {
        if (!disabled) {
            onValueChange(!value);
        }
    };
    const handlePressIn = () => {
        if (!disabled) {
            pressed.value = isReduceMotionEnabled ? 1 : withTiming(1, AppTogglePressTimingConfig);
        }
    };
    const handlePressOut = () => {
        if (!disabled) {
            pressed.value = isReduceMotionEnabled ? 0 : withTiming(0, AppTogglePressTimingConfig);
        }
    };

    const pressableAnimatedStyles = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(pressed.value, [0, 1], [1, AppTogglePressedScale]) }]
    }));
    const trackAnimatedStyles = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(progress.value, [0, 1], [offColors.trackColor, onColors.trackColor]),
        borderColor: interpolateColor(progress.value, [0, 1], [offColors.trackBorderColor, onColors.trackBorderColor])
    }));
    const thumbAnimatedStyles = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(progress.value, [0, 1], [offColors.knobColor, onColors.knobColor]),
        transform: [{ translateX: interpolate(progress.value, [0, 1], [0, AppToggleTranslateX]) }]
    }));
    const pressableStyles = [resolveUnistyleForAnimated(styles.pressable), pressableAnimatedStyles];
    const trackStyles = [
        resolveUnistyleForAnimated(styles.track),
        trackAnimatedStyles,
        { opacity: disabled ? AppToggleDisabledOpacity : 1 }
    ];
    const thumbStyles = [resolveUnistyleForAnimated(styles.thumb), thumbAnimatedStyles];
    const accessibilityState = { checked: value, disabled };

    return (
        <AnimatedPressable
            accessibilityRole="switch"
            accessibilityState={accessibilityState}
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={pressableStyles}
            testID={testID}
        >
            <Animated.View style={trackStyles}>
                <Animated.View style={thumbStyles} />
            </Animated.View>
        </AnimatedPressable>
    );
};
