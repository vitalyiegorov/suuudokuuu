import { MaskedView } from '@expo/ui/community/masked-view';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { use } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ThemeContext } from '../../../theme/context/theme.context';
import { ColorSchemaEnum } from '../../../theme/enum/color-schema.enum';
import { getBlurTint } from '../../utils/get-blur-tint.util';

import { BlurGradientStyles as styles } from './blur-gradient.styles';
import {
    BlurGradientConfig,
    BlurGradientDefaultBottomHeight,
    BlurGradientDefaultHeaderHeight,
    BlurGradientDefaultIntensity,
    type BlurGradientPosition
} from './constant/blur-gradient.constant';
import { blurGradientGetGradientStops } from './utils/blur-gradient-get-gradient-stops.util';

import type { ComponentProps, ReactNode } from 'react';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

type AnimatedBlurViewInput = ComponentProps<typeof AnimatedBlurView>;

interface Props {
    readonly animatedBlurProps?: AnimatedBlurViewInput['animatedProps'];
    readonly children?: ReactNode;
    readonly edgeOffset?: number;
    readonly height?: number;
    readonly intensity?: number;
    readonly position: BlurGradientPosition;
    readonly safeAreaTop?: number;
}

const BlurGradientMaskStops = {
    bottom: blurGradientGetGradientStops('bottom'),
    top: blurGradientGetGradientStops('top')
};

export const BlurGradient = ({
    animatedBlurProps,
    children,
    edgeOffset = 0,
    height,
    intensity = BlurGradientDefaultIntensity,
    position,
    safeAreaTop = 0
}: Props) => {
    const { colorScheme } = use(ThemeContext);

    const maskConfig = BlurGradientMaskStops[position];
    const overlayConfig = BlurGradientConfig.overlay[position];
    const computedHeight = position === 'top' ? safeAreaTop + BlurGradientDefaultHeaderHeight : BlurGradientDefaultBottomHeight;
    const overlayColors = colorScheme === ColorSchemaEnum.Dark ? overlayConfig.dark : overlayConfig.light;
    const isIos = Platform.OS === 'ios';
    const blurTint = getBlurTint(colorScheme, isIos);
    const positionStyle = position === 'top' ? styles.top : styles.bottom;
    const edgeOffsetStyle = position === 'top' ? { top: -edgeOffset } : { bottom: -edgeOffset };
    const containerStyle = [styles.container, positionStyle, edgeOffsetStyle, { height: (height ?? computedHeight) + edgeOffset }];

    return (
        <>
            <View pointerEvents="none" style={containerStyle}>
                <MaskedView
                    maskElement={
                        <LinearGradient colors={maskConfig.colors} locations={maskConfig.locations} style={StyleSheet.absoluteFill} />
                    }
                    style={StyleSheet.absoluteFill}
                >
                    <LinearGradient colors={overlayColors} style={StyleSheet.absoluteFill} />
                    <AnimatedBlurView
                        animatedProps={animatedBlurProps}
                        intensity={intensity}
                        style={StyleSheet.absoluteFill}
                        tint={blurTint}
                    />
                </MaskedView>
            </View>

            {children}
        </>
    );
};
