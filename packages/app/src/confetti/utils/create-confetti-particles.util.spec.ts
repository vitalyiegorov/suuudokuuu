import { describe, expect, it } from '@jest/globals';

import { winConfettiCelebrationDurationConstant, winConfettiPaletteConstant } from '../constants/win-confetti.constant';

import { createConfettiParticles } from './create-confetti-particles.util';

const MinSize = 6;
const MaxSize = 12;
const MinAspectRatio = 0.4;
const MaxAspectRatio = 1;
const MinHorizontalDrift = -60;
const MaxHorizontalDrift = 60;
const MinSwayAmplitude = 10;
const MaxSwayAmplitude = 40;
const MinRotationDegrees = 360;
const MaxRotationDegrees = 1080;

describe('createConfettiParticles', () => {
    const particles = createConfettiParticles(500);

    it('creates the requested amount of particles with unique ids', () => {
        expect(particles).toHaveLength(500);
        expect(new Set(particles.map(particle => particle.id)).size).toBe(500);
    });

    it('keeps every particle within the configured ranges', () => {
        for (const particle of particles) {
            expect(particle.leftRatio).toBeGreaterThanOrEqual(0);
            expect(particle.leftRatio).toBeLessThanOrEqual(1);
            expect(particle.size).toBeGreaterThanOrEqual(MinSize);
            expect(particle.size).toBeLessThanOrEqual(MaxSize);
            expect(particle.aspectRatio).toBeGreaterThanOrEqual(MinAspectRatio);
            expect(particle.aspectRatio).toBeLessThanOrEqual(MaxAspectRatio);
            expect(particle.horizontalDrift).toBeGreaterThanOrEqual(MinHorizontalDrift);
            expect(particle.horizontalDrift).toBeLessThanOrEqual(MaxHorizontalDrift);
            expect(particle.swayAmplitude).toBeGreaterThanOrEqual(MinSwayAmplitude);
            expect(particle.swayAmplitude).toBeLessThanOrEqual(MaxSwayAmplitude);
            expect(Math.abs(particle.spinDegrees)).toBeGreaterThanOrEqual(MinRotationDegrees);
            expect(Math.abs(particle.spinDegrees)).toBeLessThanOrEqual(MaxRotationDegrees);
            expect(particle.flipDegrees).toBeGreaterThanOrEqual(MinRotationDegrees);
            expect(particle.flipDegrees).toBeLessThanOrEqual(MaxRotationDegrees);
        }
    });

    it('assigns palette colors only', () => {
        for (const particle of particles) {
            expect(winConfettiPaletteConstant).toContain(particle.color);
        }
    });

    it('spins particles in both directions', () => {
        expect(particles.some(particle => particle.spinDegrees > 0)).toBe(true);
        expect(particles.some(particle => particle.spinDegrees < 0)).toBe(true);
    });

    it('finishes every particle within the celebration window', () => {
        for (const particle of particles) {
            expect(particle.delayMilliseconds + particle.durationMilliseconds).toBeLessThan(winConfettiCelebrationDurationConstant * 1000);
        }
    });
});
