import {
    Atlas,
    Canvas,
    Skia,
    useClock,
    useColorBuffer,
    usePictureAsTexture,
    useRSXformBuffer,
    useRectBuffer
} from '@shopify/react-native-skia';
import { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useAnimatedReaction, useSharedValue } from 'react-native-reanimated';

import { confettiTextureSizeConstant } from '../../constants/confetti-physics.constant';
import { winConfettiPaletteConstant } from '../../constants/win-confetti.constant';
import { getConfettiAverageFrameDuration, isConfettiFrameBudgetExceeded } from '../../utils/confetti-frame-budget.util';
import { createConfettiBurst } from '../../utils/create-confetti-burst.util';
import { createConfettiTexturePicture } from '../../utils/create-confetti-texture-picture.util';
import { getConfettiParticleAmount } from '../../utils/get-confetti-particle-amount.util';
import { getConfettiPieceFrame } from '../../utils/get-confetti-piece-frame.util';

import { ConfettiBurstSelectors } from './confetti-burst.selectors';
import { ConfettiBurstStyles as styles } from './confetti-burst.styles';

const textureSize = { height: confettiTextureSizeConstant, width: confettiTextureSizeConstant };
const alphaChannelIndex = 3;

export const ConfettiBurst = () => {
    const { height: screenHeight, width: screenWidth } = useWindowDimensions();

    const clock = useClock();
    const [particles] = useState(() =>
        createConfettiBurst(screenWidth, screenHeight, getConfettiParticleAmount(screenWidth, screenHeight))
    );
    const [paletteColors] = useState(() => winConfettiPaletteConstant.map(paletteColor => Skia.Color(paletteColor)));
    const [texturePicture] = useState(createConfettiTexturePicture);
    const visibleParticleAmount = useSharedValue(particles.length);
    const averageFrameDuration = useSharedValue(0);

    const texture = usePictureAsTexture(texturePicture, textureSize);

    useAnimatedReaction(
        () => clock.value,
        (currentClock, previousClock) => {
            if (previousClock === null) {
                return;
            }

            averageFrameDuration.value = getConfettiAverageFrameDuration(averageFrameDuration.value, currentClock - previousClock);

            const isDegraded = visibleParticleAmount.value !== particles.length;

            if (!isDegraded && isConfettiFrameBudgetExceeded(currentClock, averageFrameDuration.value)) {
                visibleParticleAmount.value = Math.round(particles.length / 2);
            }
        }
    );

    const sprites = useRectBuffer(particles.length, (sprite, index) => {
        'worklet';

        if (index >= visibleParticleAmount.value) {
            sprite.setXYWH(0, 0, 0, 0);

            return;
        }

        const particle = particles[index];
        const frame = getConfettiPieceFrame(particle, clock.value / 1000);

        if (frame === null) {
            sprite.setXYWH(0, 0, 0, 0);

            return;
        }

        sprite.setXYWH(0, 0, Math.abs(particle.width * frame.scaleX), particle.height);
    });

    const transforms = useRSXformBuffer(particles.length, (transform, index) => {
        'worklet';

        if (index >= visibleParticleAmount.value) {
            transform.set(1, 0, 0, 0);

            return;
        }

        const particle = particles[index];
        const frame = getConfettiPieceFrame(particle, clock.value / 1000);

        if (frame === null) {
            transform.set(1, 0, 0, 0);

            return;
        }

        const rotationCosine = Math.cos(frame.rotation);
        const rotationSine = Math.sin(frame.rotation);
        const anchorX = Math.abs(particle.width * frame.scaleX) / 2;
        const anchorY = particle.height / 2;

        transform.set(
            rotationCosine,
            rotationSine,
            frame.translateX - (rotationCosine * anchorX - rotationSine * anchorY),
            frame.translateY - (rotationSine * anchorX + rotationCosine * anchorY)
        );
    });

    const colors = useColorBuffer(particles.length, (color, index) => {
        'worklet';

        if (index >= visibleParticleAmount.value) {
            color[alphaChannelIndex] = 0;

            return;
        }

        const particle = particles[index];
        const frame = getConfettiPieceFrame(particle, clock.value / 1000);

        if (frame === null) {
            color[alphaChannelIndex] = 0;

            return;
        }

        color.set(paletteColors[particle.colorIndex]);
        color[alphaChannelIndex] = frame.opacity;
    });

    const overlayStyle = [StyleSheet.absoluteFill, styles.overlay];

    return (
        <View accessible={false} aria-hidden style={overlayStyle} testID={ConfettiBurstSelectors.Root}>
            <Canvas style={StyleSheet.absoluteFill}>
                <Atlas colorBlendMode="modulate" colors={colors} image={texture} sprites={sprites} transforms={transforms} />
            </Canvas>
        </View>
    );
};
