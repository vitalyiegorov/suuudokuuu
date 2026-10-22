import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { winConfettiPaletteConstant } from '../../constants/win-confetti.constant';
import { getConfettiPieceFrame } from '../../utils/get-confetti-piece-frame.util';

import { ConfettiPieceStyles as styles } from './confetti-piece.styles';

import type { ConfettiParticleInterface } from '../../interfaces/confetti-particle.interface';
import type { SharedValue } from 'react-native-reanimated';

interface Props {
    readonly elapsedSeconds: SharedValue<number>;
    readonly index: number;
    readonly particle: ConfettiParticleInterface;
    readonly visibleParticleAmount: SharedValue<number>;
}

const hiddenPieceStyle = {
    opacity: 0,
    transform: [{ translateX: 0 }, { translateY: 0 }, { rotate: '0rad' }, { scaleX: 1 }]
};

export const ConfettiPiece = ({ elapsedSeconds, index, particle, visibleParticleAmount }: Props) => {
    const animatedStyle = useAnimatedStyle(() => {
        const frame = index < visibleParticleAmount.get() ? getConfettiPieceFrame(particle, elapsedSeconds.get()) : null;

        if (frame === null) {
            return hiddenPieceStyle;
        }

        return {
            opacity: frame.opacity,
            transform: [
                { translateX: frame.translateX - particle.width / 2 },
                { translateY: frame.translateY - particle.height / 2 },
                { rotate: `${frame.rotation}rad` },
                { scaleX: frame.scaleX }
            ]
        };
    });

    const pieceStyle = [
        styles.piece,
        { backgroundColor: winConfettiPaletteConstant[particle.colorIndex], height: particle.height, width: particle.width },
        animatedStyle
    ];

    return <Animated.View style={pieceStyle} />;
};
