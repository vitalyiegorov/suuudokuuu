import { describe, expect, it } from '@jest/globals';

import {
    confettiEmissionStaggerSecondsConstant,
    confettiMaxAspectRatioConstant,
    confettiMaxLaunchAngleDegreesConstant,
    confettiMaxLifespanSecondsConstant,
    confettiMaxWidthConstant,
    confettiMinAspectRatioConstant,
    confettiMinLaunchAngleDegreesConstant,
    confettiMinWidthConstant,
    confettiRadiansPerDegreeConstant,
    confettiSpawnJitterRatioConstant
} from '../constants/confetti-physics.constant';
import { winConfettiPaletteConstant } from '../constants/win-confetti.constant';

import { createConfettiBurst } from './create-confetti-burst.util';
import { getConfettiPieceFrame } from './get-confetti-piece-frame.util';

import type { ConfettiParticleInterface } from '../interfaces/confetti-particle.interface';

const screenWidth = 390;
const screenHeight = 844;
const particleAmount = 240;
const firstSeed = 12345;
const secondSeed = 98765;
const angleTolerance = 0.001;
const sampleStepSeconds = 0.02;
const apexUpperBoundRatio = 0.65;
const highFlyerRatio = 0.3;

const createSeededRandom = (initialSeed: number): (() => number) => {
    const multiplier = 16807;
    const modulus = 2147483647;
    let state = initialSeed;

    return () => {
        state = (state * multiplier) % modulus;

        return state / modulus;
    };
};

const getApexTranslateY = (particle: ConfettiParticleInterface): number => {
    let apex = particle.spawnY;
    let seconds = particle.emissionDelaySeconds;

    while (seconds < particle.emissionDelaySeconds + particle.lifetimeSeconds) {
        const frame = getConfettiPieceFrame(particle, seconds);

        if (frame !== null) {
            apex = Math.min(apex, frame.translateY);
        }

        seconds += sampleStepSeconds;
    }

    return apex;
};

describe('createConfettiBurst', () => {
    const particles = createConfettiBurst(screenWidth, screenHeight, particleAmount, createSeededRandom(firstSeed));

    it('creates the requested amount of particles', () => {
        expect(particles).toHaveLength(particleAmount);
    });

    it('is deterministic for a seeded random function', () => {
        const repeated = createConfettiBurst(screenWidth, screenHeight, particleAmount, createSeededRandom(firstSeed));
        const different = createConfettiBurst(screenWidth, screenHeight, particleAmount, createSeededRandom(secondSeed));

        expect(repeated).toStrictEqual(particles);
        expect(different).not.toStrictEqual(particles);
    });

    it('falls back to Math.random when no random function is given', () => {
        expect(createConfettiBurst(screenWidth, screenHeight, particleAmount)).toHaveLength(particleAmount);
    });

    it('staggers emission delays inside the stagger window', () => {
        for (const particle of particles) {
            expect(particle.emissionDelaySeconds).toBeGreaterThanOrEqual(0);
            expect(particle.emissionDelaySeconds).toBeLessThanOrEqual(confettiEmissionStaggerSecondsConstant);
        }

        expect(particles.some(particle => particle.emissionDelaySeconds > confettiEmissionStaggerSecondsConstant / 2)).toBe(true);
    });

    it('expires every particle well before the celebration ends', () => {
        for (const particle of particles) {
            expect(particle.emissionDelaySeconds + particle.lifetimeSeconds).toBeLessThan(confettiMaxLifespanSecondsConstant);
        }
    });

    it('fires from both bottom corners up and inward', () => {
        const jitter = screenWidth * confettiSpawnJitterRatioConstant;
        const leftCannonParticles = particles.filter(particle => particle.initialVelocityX > 0);
        const rightCannonParticles = particles.filter(particle => particle.initialVelocityX < 0);

        expect(leftCannonParticles.length).toBeGreaterThan(0);
        expect(rightCannonParticles.length).toBeGreaterThan(0);

        for (const particle of leftCannonParticles) {
            expect(particle.spawnX).toBeGreaterThanOrEqual(0);
            expect(particle.spawnX).toBeLessThanOrEqual(jitter);
        }

        for (const particle of rightCannonParticles) {
            expect(particle.spawnX).toBeGreaterThanOrEqual(screenWidth - jitter);
            expect(particle.spawnX).toBeLessThanOrEqual(screenWidth);
        }

        for (const particle of particles) {
            expect(particle.initialVelocityY).toBeLessThan(0);
            expect(particle.spawnY).toBeGreaterThan(screenHeight - jitter);
            expect(particle.spawnY).toBeLessThanOrEqual(screenHeight);
        }
    });

    it('launches inside the configured angle window', () => {
        for (const particle of particles) {
            const angleDegrees =
                Math.atan2(-particle.initialVelocityY, Math.abs(particle.initialVelocityX)) / confettiRadiansPerDegreeConstant;

            expect(angleDegrees).toBeGreaterThanOrEqual(confettiMinLaunchAngleDegreesConstant - angleTolerance);
            expect(angleDegrees).toBeLessThanOrEqual(confettiMaxLaunchAngleDegreesConstant + angleTolerance);
        }
    });

    it('uses palette colors and configured sizes only', () => {
        for (const particle of particles) {
            expect(particle.colorIndex).toBeGreaterThanOrEqual(0);
            expect(particle.colorIndex).toBeLessThan(winConfettiPaletteConstant.length);
            expect(particle.width).toBeGreaterThanOrEqual(confettiMinWidthConstant);
            expect(particle.width).toBeLessThanOrEqual(confettiMaxWidthConstant);
            expect(particle.height).toBeGreaterThanOrEqual(particle.width * confettiMinAspectRatioConstant);
            expect(particle.height).toBeLessThanOrEqual(particle.width * confettiMaxAspectRatioConstant);
        }
    });

    it('spins particles in both directions', () => {
        expect(particles.some(particle => particle.spinRate > 0)).toBe(true);
        expect(particles.some(particle => particle.spinRate < 0)).toBe(true);
    });

    it('arcs every particle into the upper part of the screen', () => {
        const apexes = particles.map(getApexTranslateY);
        const highFlyers = apexes.filter(apex => apex < screenHeight / 2);

        for (const apex of apexes) {
            expect(apex).toBeLessThan(screenHeight * apexUpperBoundRatio);
        }

        expect(highFlyers.length / apexes.length).toBeGreaterThan(highFlyerRatio);
    });
});
