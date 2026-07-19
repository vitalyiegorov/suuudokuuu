import { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';

import { useScreenChrome } from './use-screen-chrome.hook';

export const useScrollFadeStyle = (inputRange: readonly [number, number], outputRange: readonly [number, number]) => {
    const { scrollY } = useScreenChrome();

    return useAnimatedStyle(() => ({
        opacity: interpolate(scrollY.value, inputRange, outputRange, Extrapolation.CLAMP)
    }));
};
