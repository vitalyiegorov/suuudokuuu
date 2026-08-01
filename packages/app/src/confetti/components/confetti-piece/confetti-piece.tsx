import Reanimated from 'react-native-reanimated';

import { createConfettiPieceKeyframes } from '../../utils/create-confetti-piece-keyframes.util';

import { ConfettiPieceStyles as styles } from './confetti-piece.styles';

import type { ConfettiParticleInterface } from '../../interfaces/confetti-particle.interface';
import type { ViewStyle } from 'react-native';
import type { CSSStyle } from 'react-native-reanimated';

interface Props {
    readonly particle: ConfettiParticleInterface;
    readonly screenHeight: number;
    readonly screenWidth: number;
}

export const ConfettiPiece = ({ particle, screenHeight, screenWidth }: Props) => {
    const keyframes = createConfettiPieceKeyframes(particle, screenHeight);
    const pieceStyle: CSSStyle<ViewStyle> = {
        ...styles.piece,
        animationDelay: particle.delayMilliseconds,
        animationDuration: particle.durationMilliseconds,
        animationFillMode: 'both',
        animationName: keyframes,
        animationTimingFunction: 'ease-in',
        backgroundColor: particle.color,
        height: particle.size * particle.aspectRatio,
        left: particle.leftRatio * screenWidth,
        width: particle.size
    };

    return <Reanimated.View style={pieceStyle} />;
};
