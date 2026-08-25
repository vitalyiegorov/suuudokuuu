import { useLingui } from '@lingui/react/macro';
import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { Zap } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { useReduceMotion } from '../../../@generic/hooks/use-reduce-motion.hook';
import { useVibration } from '../../../@generic/hooks/use-vibration.hook';
import { settingsSetAction } from '../../../settings/store/settings.actions';
import { settingsLastGameChallengeModeSelector } from '../../../settings/store/settings.selectors';

import { ChallengeModeSwitchSelectors } from './challenge-mode-switch.selectors';
import { ChallengeModeSwitchStyles as styles } from './challenge-mode-switch.styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const GlyphSize = 11;
const PressedScale = 0.94;
const ColorDurationMs = 180;
const PressDurationMs = 90;
const InstantDurationMs = 0;

export const ChallengeModeSwitch = () => {
    const { t } = useLingui();
    const { theme } = useUnistyles();
    const dispatch = useAppDispatch();
    const [, hapticImpact] = useVibration();
    const isChallengeMode = useAppSelector(settingsLastGameChallengeModeSelector);
    const isMotionReduced = useReduceMotion();
    const colorDurationMs = isMotionReduced ? InstantDurationMs : ColorDurationMs;
    const pressDurationMs = isMotionReduced ? InstantDurationMs : PressDurationMs;

    const progress = useSharedValue(isChallengeMode ? 1 : 0);
    const pressed = useSharedValue(0);

    useEffect(() => {
        progress.value = withTiming(isChallengeMode ? 1 : 0, { duration: colorDurationMs });
    }, [isChallengeMode, colorDurationMs, progress]);

    const handlePress = () => {
        hapticImpact(ImpactFeedbackStyle.Light);
        dispatch(settingsSetAction({ lastGameChallengeMode: !isChallengeMode }));
    };
    const handlePressIn = () => {
        pressed.value = withTiming(1, { duration: pressDurationMs });
    };
    const handlePressOut = () => {
        pressed.value = withTiming(0, { duration: pressDurationMs });
    };

    const chipAnimatedStyles = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(progress.value, [0, 1], ['rgba(0, 0, 0, 0)', theme.colors.ink]),
        borderColor: interpolateColor(progress.value, [0, 1], [theme.colors.surface.border, theme.colors.ink]),
        transform: [{ scale: interpolate(pressed.value, [0, 1], [1, isMotionReduced ? 1 : PressedScale]) }]
    }));
    const contentAnimatedStyles = useAnimatedStyle(() => ({
        color: interpolateColor(progress.value, [0, 1], [theme.colors.text.hint, theme.colors.inkText])
    }));

    const chipStyles = [resolveUnistyleForAnimated(styles.chip), chipAnimatedStyles];
    const labelStyles = [resolveUnistyleForAnimated(styles.label), contentAnimatedStyles];
    const glyphColor = isChallengeMode ? theme.colors.inkText : theme.colors.text.hint;
    const glyphFill = isChallengeMode ? glyphColor : 'transparent';
    const accessibilityState = { checked: isChallengeMode };

    return (
        <AnimatedPressable
            accessibilityHint={t`Challenge runs cannot be paused and record when you leave the app`}
            accessibilityLabel={t`Challenge mode`}
            accessibilityRole="switch"
            accessibilityState={accessibilityState}
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={chipStyles}
            testID={ChallengeModeSwitchSelectors.Root}
        >
            <Zap color={glyphColor} fill={glyphFill} size={GlyphSize} strokeWidth={2.6} />

            <Animated.Text maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant} style={labelStyles}>
                {t`Challenge`}
            </Animated.Text>
        </AnimatedPressable>
    );
};
