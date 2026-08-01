import type { ConfettiParticleInterface } from '../interfaces/confetti-particle.interface';
import type { ViewStyle } from 'react-native';
import type { CSSAnimationKeyframes } from 'react-native-reanimated';

const QuarterProgress = 0.25;
const ThreeQuarterProgress = 0.75;
const LateProgress = 0.85;
const LateHorizontalProgress = 0.4;
const FallOvershoot = 40;

const interpolateLinear = (from: number, to: number, progress: number): number => from + (to - from) * progress;

export const createConfettiPieceKeyframes = (
    particle: ConfettiParticleInterface,
    screenHeight: number
): CSSAnimationKeyframes<ViewStyle> => {
    const startTranslateY = -particle.size * 2;
    const endTranslateY = screenHeight + FallOvershoot;
    const quarterTranslateY = interpolateLinear(startTranslateY, endTranslateY, QuarterProgress);
    const threeQuarterTranslateY = interpolateLinear(startTranslateY, endTranslateY, ThreeQuarterProgress);
    const lateTranslateY = interpolateLinear(startTranslateY, endTranslateY, LateProgress);
    const lateTranslateX = interpolateLinear(-particle.swayAmplitude, particle.horizontalDrift, LateHorizontalProgress);

    return {
        from: {
            opacity: 1,
            transform: [{ translateY: startTranslateY }, { translateX: 0 }, { rotate: '0deg' }, { rotateX: '0deg' }]
        },
        '25%': {
            transform: [
                { translateY: quarterTranslateY },
                { translateX: particle.swayAmplitude },
                { rotate: `${particle.spinDegrees * QuarterProgress}deg` },
                { rotateX: `${particle.flipDegrees * QuarterProgress}deg` }
            ]
        },
        '75%': {
            transform: [
                { translateY: threeQuarterTranslateY },
                { translateX: -particle.swayAmplitude },
                { rotate: `${particle.spinDegrees * ThreeQuarterProgress}deg` },
                { rotateX: `${particle.flipDegrees * ThreeQuarterProgress}deg` }
            ]
        },
        '85%': {
            opacity: 1,
            transform: [
                { translateY: lateTranslateY },
                { translateX: lateTranslateX },
                { rotate: `${particle.spinDegrees * LateProgress}deg` },
                { rotateX: `${particle.flipDegrees * LateProgress}deg` }
            ]
        },
        to: {
            opacity: 0,
            transform: [
                { translateY: endTranslateY },
                { translateX: particle.horizontalDrift },
                { rotate: `${particle.spinDegrees}deg` },
                { rotateX: `${particle.flipDegrees}deg` }
            ]
        }
    };
};
