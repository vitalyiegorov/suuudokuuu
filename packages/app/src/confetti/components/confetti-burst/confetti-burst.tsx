import { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useFrameCallback, useSharedValue } from 'react-native-reanimated';

import { getConfettiAverageFrameDuration, isConfettiFrameBudgetExceeded } from '../../utils/confetti-frame-budget.util';
import { createConfettiBurst } from '../../utils/create-confetti-burst.util';
import { getConfettiParticleAmount } from '../../utils/get-confetti-particle-amount.util';
import { ConfettiPiece } from '../confetti-piece/confetti-piece';

import { ConfettiBurstSelectors } from './confetti-burst.selectors';
import { ConfettiBurstStyles as styles } from './confetti-burst.styles';

export const ConfettiBurst = () => {
    const { height: screenHeight, width: screenWidth } = useWindowDimensions();

    const [particles] = useState(() =>
        createConfettiBurst(screenWidth, screenHeight, getConfettiParticleAmount(screenWidth, screenHeight))
    );
    const elapsedSeconds = useSharedValue(0);
    const visibleParticleAmount = useSharedValue(particles.length);
    const averageFrameDuration = useSharedValue(0);

    useFrameCallback(({ timeSinceFirstFrame, timeSincePreviousFrame }) => {
        elapsedSeconds.set(timeSinceFirstFrame / 1000);

        if (timeSincePreviousFrame === null) {
            return;
        }

        averageFrameDuration.set(getConfettiAverageFrameDuration(averageFrameDuration.get(), timeSincePreviousFrame));

        const isDegraded = visibleParticleAmount.get() !== particles.length;

        if (!isDegraded && isConfettiFrameBudgetExceeded(timeSinceFirstFrame, averageFrameDuration.get())) {
            visibleParticleAmount.set(Math.round(particles.length / 2));
        }
    });

    const overlayStyle = [StyleSheet.absoluteFill, styles.overlay];

    return (
        <View accessible={false} aria-hidden style={overlayStyle} testID={ConfettiBurstSelectors.Root}>
            {particles.map((particle, index) => (
                <ConfettiPiece
                    elapsedSeconds={elapsedSeconds}
                    index={index}
                    key={index}
                    particle={particle}
                    visibleParticleAmount={visibleParticleAmount}
                />
            ))}
        </View>
    );
};
