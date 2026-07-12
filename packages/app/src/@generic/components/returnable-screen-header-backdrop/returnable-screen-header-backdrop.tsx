import { Extrapolation, interpolate, useAnimatedProps, useAnimatedStyle } from 'react-native-reanimated';

import {
    ReturnableScreenHeaderMaxBlurIntensity,
    ReturnableScreenHeaderProgressiveHeight,
    ReturnableScreenHeaderScrollEnd,
    ReturnableScreenHeaderScrollStart,
    ReturnableScreenHeaderSmallTitleStart
} from '../returnable-screen-header/constant/returnable-screen-header.constant';
import { ScreenChromeProgressiveOverlay } from '../screen-chrome-progressive-overlay/screen-chrome-progressive-overlay';

import type { SharedValue } from 'react-native-reanimated';

interface Props {
    readonly scrollY: SharedValue<number>;
}

export const ReturnableScreenHeaderBackdrop = ({ scrollY }: Props) => {
    const backgroundAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            scrollY.value,
            [ReturnableScreenHeaderScrollStart, ReturnableScreenHeaderSmallTitleStart],
            [0, 1],
            Extrapolation.CLAMP
        )
    }));
    const blurAnimatedProps = useAnimatedProps(() => ({
        intensity: interpolate(
            scrollY.value,
            [ReturnableScreenHeaderScrollStart, ReturnableScreenHeaderScrollEnd],
            [0, ReturnableScreenHeaderMaxBlurIntensity],
            Extrapolation.CLAMP
        )
    }));

    return (
        <ScreenChromeProgressiveOverlay
            animatedBlurProps={blurAnimatedProps}
            height={ReturnableScreenHeaderProgressiveHeight}
            intensity={0}
            position="top"
            style={backgroundAnimatedStyle}
        />
    );
};
