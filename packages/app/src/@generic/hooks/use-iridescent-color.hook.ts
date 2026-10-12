import { useEffect } from 'react';
import {
    Easing,
    cancelAnimation,
    interpolateColor,
    useDerivedValue,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

import { useReduceMotion } from './use-reduce-motion.hook';

import type { ThemeInterface } from '@suuudokuuu/ui/theme';
import type { SharedValue } from 'react-native-reanimated';

const IridescentSweepDurationMs = 6000;
const IridescentSweepInputRange = [0, 1 / 3, 2 / 3, 1];

export const useIridescentColor = (theme: Pick<ThemeInterface, 'colors'>, isActive: boolean): SharedValue<string> => {
    const isMotionReduced = useReduceMotion();
    const sweep = useSharedValue(0);
    const isAnimating = isActive && !isMotionReduced;
    const colorStops = [theme.colors.accent, theme.colors.surface.raisedText, theme.colors.board.selected, theme.colors.accent];

    useEffect(() => {
        if (isAnimating) {
            sweep.set(withRepeat(withTiming(1, { duration: IridescentSweepDurationMs, easing: Easing.linear }), -1, false));
        } else {
            sweep.set(0);
        }

        return () => void cancelAnimation(sweep);
    }, [isAnimating, sweep]);

    return useDerivedValue(() => interpolateColor(sweep.value, IridescentSweepInputRange, colorStops));
};
