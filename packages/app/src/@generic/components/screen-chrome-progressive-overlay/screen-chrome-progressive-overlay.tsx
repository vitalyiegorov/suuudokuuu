import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenChromeBottomFadeHeight, ScreenChromeHeaderGradientHeight } from '../screen-chrome/constant/screen-chrome.constant';

import { ScreenChromeProgressiveOverlayContent } from './screen-chrome-progressive-overlay-content/screen-chrome-progressive-overlay-content';

import type { BlurGradientPosition } from '../blur-gradient/constant/blur-gradient.constant';
import type { ComponentProps } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';

type ScreenChromeProgressiveOverlayContentInput = ComponentProps<typeof ScreenChromeProgressiveOverlayContent>;

interface Props {
    readonly animatedBlurProps?: ScreenChromeProgressiveOverlayContentInput['animatedBlurProps'];
    readonly height?: number;
    readonly intensity?: number;
    readonly position: BlurGradientPosition;
    readonly style?: StyleProp<AnimatedStyle<ViewStyle>>;
}

export const ScreenChromeProgressiveOverlay = ({ animatedBlurProps, height, intensity, position, style }: Props) => {
    const insets = useSafeAreaInsets();

    const edgeOffset = position === 'top' ? insets.top : insets.bottom;
    const defaultHeight = position === 'top' ? ScreenChromeHeaderGradientHeight : ScreenChromeBottomFadeHeight;
    const overlayHeight = height ?? defaultHeight;

    return (
        <ScreenChromeProgressiveOverlayContent
            animatedBlurProps={animatedBlurProps}
            edgeOffset={edgeOffset}
            height={overlayHeight}
            intensity={intensity}
            position={position}
            style={style}
        />
    );
};
