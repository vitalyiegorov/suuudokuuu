import Animated from 'react-native-reanimated';

import { BlurGradient } from '../../blur-gradient/blur-gradient';
import { ScreenChromeProgressiveOverlayStyles as styles } from '../screen-chrome-progressive-overlay.styles';

import type { BlurGradientPosition } from '../../blur-gradient/constant/blur-gradient.constant';
import type { ComponentProps } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';

type BlurGradientInput = ComponentProps<typeof BlurGradient>;

interface Props {
    readonly animatedBlurProps?: BlurGradientInput['animatedBlurProps'];
    readonly edgeOffset?: number;
    readonly height?: number;
    readonly intensity?: number;
    readonly position: BlurGradientPosition;
    readonly style?: StyleProp<AnimatedStyle<ViewStyle>>;
}

export const ScreenChromeProgressiveOverlayContent = ({ animatedBlurProps, edgeOffset, height, intensity, position, style }: Props) => {
    const containerStyles = [styles.container, style];

    return (
        <Animated.View pointerEvents="none" style={containerStyles}>
            <BlurGradient
                animatedBlurProps={animatedBlurProps}
                edgeOffset={edgeOffset}
                height={height}
                intensity={intensity}
                position={position}
            />
        </Animated.View>
    );
};
