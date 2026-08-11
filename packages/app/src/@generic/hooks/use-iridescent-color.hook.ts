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

import { getIridescentColorStops } from '../utils/get-iridescent-color-stops.util';

import { useReduceMotion } from './use-reduce-motion.hook';

import type { ThemeInterface } from '@suuudokuuu/ui/theme';
import type { SharedValue } from 'react-native-reanimated';

const IridescentSweepDurationMs = 6000;
const IridescentSweepInputRange = [0, 1 / 3, 2 / 3, 1];

export const useIridescentColor = (theme: Pick<ThemeInterface, 'colors'>, isActive: boolean): SharedValue<string> => {
    const isMotionReduced = useReduceMotion();
    const sweep = useSharedValue(0);
    const isAnimating = isActive && !isMotionReduced;
    const colorStops = getIridescentColorStops(theme);

    useEffect(() => {
        if (isAnimating) {
            sweep.value = withRepeat(withTiming(1, { duration: IridescentSweepDurationMs, easing: Easing.linear }), -1, false);
        } else {
            sweep.value = 0;
        }

        return () => void cancelAnimation(sweep);
    }, [isAnimating, sweep]);

    return useDerivedValue(() => interpolateColor(sweep.value, IridescentSweepInputRange, colorStops));
};
