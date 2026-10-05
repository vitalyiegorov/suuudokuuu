import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

import { useReduceMotionEnabled } from '../../hooks/use-reduce-motion-enabled.hook';
import { resolveUnistyleForAnimated } from '../../utils/resolve-unistyle-for-animated.util';

import { AppToggleStyles as styles } from './app-toggle.styles';
import { AppTogglePressTimingConfig, AppTogglePressedScale, AppToggleSpringConfig } from './constant/app-toggle-animation.constant';
import { AppToggleDisabledOpacity, AppToggleOffKnobOpacity, AppToggleOffTrackOpacity } from './constant/app-toggle-opacity.constant';
import { AppToggleHitSlop, AppToggleKnobTravel, AppToggleOffKnobScale } from './constant/app-toggle-size.constant';

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

        progress.set(isReduceMotionEnabled ? targetProgress : withSpring(targetProgress, AppToggleSpringConfig));
    }, [value, isReduceMotionEnabled, progress]);

    const handlePress = () => {
        if (!disabled) {
            onValueChange(!value);
        }
    };
    const handlePressIn = () => {
        if (!disabled) {
            pressed.set(isReduceMotionEnabled ? 1 : withTiming(1, AppTogglePressTimingConfig));
        }
    };
    const handlePressOut = () => {
        if (!disabled) {
            pressed.set(isReduceMotionEnabled ? 0 : withTiming(0, AppTogglePressTimingConfig));
        }
    };

    const knobOffColor = theme.colors.text.primary;
    const knobOnColor = theme.colors.background;
    const pressableAnimatedStyles = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(pressed.value, [0, 1], [1, AppTogglePressedScale]) }]
    }));
    const trackFillAnimatedStyles = useAnimatedStyle(() => ({
        opacity: interpolate(progress.value, [0, 1], [AppToggleOffTrackOpacity, 1])
    }));
    const knobAnimatedStyles = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(progress.value, [0, 1], [knobOffColor, knobOnColor]),
        opacity: interpolate(progress.value, [0, 1], [AppToggleOffKnobOpacity, 1]),
        transform: [
            { translateX: interpolate(progress.value, [0, 1], [0, AppToggleKnobTravel]) },
            { scale: interpolate(progress.value, [0, 1], [AppToggleOffKnobScale, 1]) }
        ]
    }));
    const pressableStyles = [resolveUnistyleForAnimated(styles.pressable), pressableAnimatedStyles];
    const trackStyles = [styles.track, { opacity: disabled ? AppToggleDisabledOpacity : 1 }];
    const trackFillStyles = [
        resolveUnistyleForAnimated(styles.trackFill),
        { backgroundColor: theme.colors.text.primary },
        trackFillAnimatedStyles
    ];
    const knobStyles = [resolveUnistyleForAnimated(styles.knob), knobAnimatedStyles];
    const accessibilityState = { checked: value, disabled };

    return (
        <AnimatedPressable
            accessibilityRole="switch"
            accessibilityState={accessibilityState}
            hitSlop={AppToggleHitSlop}
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={pressableStyles}
            testID={testID}
        >
            <View style={trackStyles}>
                <Animated.View style={trackFillStyles} />
                <Animated.View style={knobStyles} />
            </View>
        </AnimatedPressable>
    );
};
