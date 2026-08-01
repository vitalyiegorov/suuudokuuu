import { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { winConfettiParticleAmountConstant } from '../../constants/win-confetti.constant';
import { createConfettiParticles } from '../../utils/create-confetti-particles.util';
import { ConfettiPiece } from '../confetti-piece/confetti-piece';

import { ConfettiBurstStyles as styles } from './confetti-burst.styles';

export const ConfettiBurst = () => {
    const { height: screenHeight, width: screenWidth } = useWindowDimensions();

    const [particles] = useState(() => createConfettiParticles(winConfettiParticleAmountConstant));
    const overlayStyle = [StyleSheet.absoluteFill, styles.overlay];

    return (
        <View style={overlayStyle}>
            {particles.map(particle => (
                <ConfettiPiece key={particle.id} particle={particle} screenHeight={screenHeight} screenWidth={screenWidth} />
            ))}
        </View>
    );
};
