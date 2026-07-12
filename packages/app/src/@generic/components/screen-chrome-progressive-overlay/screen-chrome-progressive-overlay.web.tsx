import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenChromeProgressiveOverlayContent } from './screen-chrome-progressive-overlay-content/screen-chrome-progressive-overlay-content';

import type { BlurGradientPosition } from '../blur-gradient/constant/blur-gradient.constant';
import type { ComponentProps } from 'react';

type ScreenChromeProgressiveOverlayContentInput = ComponentProps<typeof ScreenChromeProgressiveOverlayContent>;

interface Props extends Pick<ScreenChromeProgressiveOverlayContentInput, 'animatedBlurProps' | 'height' | 'intensity' | 'style'> {
    readonly position: BlurGradientPosition;
}

export const ScreenChromeProgressiveOverlay = ({ animatedBlurProps, height, intensity, position, style }: Props) => {
    const insets = useSafeAreaInsets();

    if (position === 'bottom') {
        return null;
    }

    return (
        <ScreenChromeProgressiveOverlayContent
            animatedBlurProps={animatedBlurProps}
            edgeOffset={insets.top}
            height={height}
            intensity={intensity}
            position="top"
            style={style}
        />
    );
};
