import { describe, expect, it } from '@jest/globals';

import { createConfettiPieceKeyframes } from './create-confetti-piece-keyframes.util';

import type { ConfettiParticleInterface } from '../interfaces/confetti-particle.interface';

const particle: ConfettiParticleInterface = {
    aspectRatio: 0.5,
    color: '#f94144',
    delayMilliseconds: 100,
    durationMilliseconds: 3000,
    flipDegrees: 720,
    horizontalDrift: 30,
    id: 0,
    leftRatio: 0.5,
    size: 10,
    spinDegrees: -540,
    swayAmplitude: 20
};

describe('createConfettiPieceKeyframes', () => {
    it('builds the full fall, sway, spin and fade timeline for a particle', () => {
        expect(createConfettiPieceKeyframes(particle, 800)).toStrictEqual({
            from: {
                opacity: 1,
                transform: [{ translateY: -20 }, { translateX: 0 }, { rotate: '0deg' }, { rotateX: '0deg' }]
            },
            '25%': {
                transform: [{ translateY: 195 }, { translateX: 20 }, { rotate: '-135deg' }, { rotateX: '180deg' }]
            },
            '75%': {
                transform: [{ translateY: 625 }, { translateX: -20 }, { rotate: '-405deg' }, { rotateX: '540deg' }]
            },
            '85%': {
                opacity: 1,
                transform: [{ translateY: 711 }, { translateX: 0 }, { rotate: '-459deg' }, { rotateX: '612deg' }]
            },
            to: {
                opacity: 0,
                transform: [{ translateY: 840 }, { translateX: 30 }, { rotate: '-540deg' }, { rotateX: '720deg' }]
            }
        });
    });
});
