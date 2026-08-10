import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { emptyFn, isDefined } from '@rnw-community/shared';

import { getConfettiAverageFrameDuration, isConfettiFrameBudgetExceeded } from '../../utils/confetti-frame-budget.util';
import { createConfettiBurst } from '../../utils/create-confetti-burst.util';
import { drawConfettiFrame } from '../../utils/draw-confetti-frame.util.web';
import { getConfettiParticleAmount } from '../../utils/get-confetti-particle-amount.util';
import { observeConfettiCanvasSize } from '../../utils/observe-confetti-canvas-size.util.web';

import { ConfettiBurstSelectors } from './confetti-burst.selectors';
import { ConfettiBurstStyles as styles } from './confetti-burst.styles';

const canvasElementStyle = { display: 'block', height: '100%', width: '100%' } as const;

export const ConfettiBurst = () => {
    const { height: screenHeight, width: screenWidth } = useWindowDimensions();

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [particles] = useState(() =>
        createConfettiBurst(screenWidth, screenHeight, getConfettiParticleAmount(screenWidth, screenHeight))
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d') ?? null;

        if (!isDefined(canvas) || !isDefined(context)) {
            return emptyFn;
        }

        const startTime = performance.now();
        let animationFrameId = 0;
        let previousTime = startTime;
        let averageFrameDuration = 0;
        let visibleParticleAmount = particles.length;

        const renderFrame = (frameTime: number) => {
            animationFrameId = requestAnimationFrame(renderFrame);

            if (document.hidden) {
                previousTime = frameTime;

                return;
            }

            averageFrameDuration = getConfettiAverageFrameDuration(averageFrameDuration, frameTime - previousTime);
            previousTime = frameTime;

            const elapsedMilliseconds = frameTime - startTime;
            const isDegraded = visibleParticleAmount !== particles.length;

            if (!isDegraded && isConfettiFrameBudgetExceeded(elapsedMilliseconds, averageFrameDuration)) {
                visibleParticleAmount = Math.round(particles.length / 2);
            }

            drawConfettiFrame(context, particles, visibleParticleAmount, elapsedMilliseconds / 1000);
        };

        const resizeObserver = observeConfettiCanvasSize(canvas, context);

        animationFrameId = requestAnimationFrame(renderFrame);

        return () => {
            resizeObserver.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    }, [particles]);

    const overlayStyle = [StyleSheet.absoluteFill, styles.overlay];

    return (
        <View accessible={false} aria-hidden style={overlayStyle} testID={ConfettiBurstSelectors.Root}>
            <canvas ref={canvasRef} style={canvasElementStyle} />
        </View>
    );
};
