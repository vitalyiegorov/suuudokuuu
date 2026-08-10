import { describe, expect, it } from '@jest/globals';

import { confettiFadeOutFractionConstant } from '../constants/confetti-physics.constant';

import { getConfettiPieceFrame } from './get-confetti-piece-frame.util';

import type { ConfettiParticleInterface } from '../interfaces/confetti-particle.interface';

const ballisticParticle: ConfettiParticleInterface = {
    colorIndex: 0,
    emissionDelaySeconds: 0.2,
    flipPhase: 0.4,
    flipRate: 7,
    gravity: 970,
    height: 8,
    horizontalDrag: 4.5,
    initialVelocityX: 1400,
    initialVelocityY: -2400,
    lifetimeSeconds: 3.4,
    spawnX: 5,
    spawnY: 840,
    spinPhase: 0.3,
    spinRate: -6,
    swayAmplitude: 0,
    swayFrequency: 2,
    swayPhase: 1,
    verticalDrag: 2.5,
    width: 10
};

const swayingParticle: ConfettiParticleInterface = { ...ballisticParticle, swayAmplitude: 12 };

const integrationStepSeconds = 0.00002;
const firstSampleSeconds = 0.25;
const lastSampleSeconds = 3.3;
const sampleStepSeconds = 0.75;
const positionPrecisionDigits = 2;
const exactPrecisionDigits = 6;
const nearDeathSeconds = 0.001;
const nearDeathOpacityBound = 0.01;
const midFlightSeconds = 1.1;

const integrateParticle = (particle: ConfettiParticleInterface, seconds: number): { x: number; y: number } => {
    const steps = Math.round(seconds / integrationStepSeconds);
    let x = particle.spawnX;
    let y = particle.spawnY;
    let velocityX = particle.initialVelocityX;
    let velocityY = particle.initialVelocityY;

    for (let step = 0; step < steps; step += 1) {
        const accelerationX = -particle.horizontalDrag * velocityX;
        const accelerationY = particle.gravity - particle.verticalDrag * velocityY;
        const predictedVelocityX = velocityX + accelerationX * integrationStepSeconds;
        const predictedVelocityY = velocityY + accelerationY * integrationStepSeconds;
        const predictedAccelerationX = -particle.horizontalDrag * predictedVelocityX;
        const predictedAccelerationY = particle.gravity - particle.verticalDrag * predictedVelocityY;

        x += ((velocityX + predictedVelocityX) / 2) * integrationStepSeconds;
        y += ((velocityY + predictedVelocityY) / 2) * integrationStepSeconds;
        velocityX += ((accelerationX + predictedAccelerationX) / 2) * integrationStepSeconds;
        velocityY += ((accelerationY + predictedAccelerationY) / 2) * integrationStepSeconds;
    }

    return { x, y };
};

describe('getConfettiPieceFrame', () => {
    it('matches numeric integration of the linear drag equations', () => {
        for (let seconds = firstSampleSeconds; seconds < lastSampleSeconds; seconds += sampleStepSeconds) {
            const frame = getConfettiPieceFrame(ballisticParticle, ballisticParticle.emissionDelaySeconds + seconds);
            const integrated = integrateParticle(ballisticParticle, seconds);

            expect(frame).not.toBeNull();
            expect(frame?.translateX).toBeCloseTo(integrated.x, positionPrecisionDigits);
            expect(frame?.translateY).toBeCloseTo(integrated.y, positionPrecisionDigits);
        }
    });

    it('adds a sinusoidal sway on top of the ballistic path', () => {
        const ballisticFrame = getConfettiPieceFrame(ballisticParticle, ballisticParticle.emissionDelaySeconds + midFlightSeconds);
        const swayingFrame = getConfettiPieceFrame(swayingParticle, swayingParticle.emissionDelaySeconds + midFlightSeconds);
        const expectedSway =
            swayingParticle.swayAmplitude * Math.sin(swayingParticle.swayFrequency * midFlightSeconds + swayingParticle.swayPhase);

        expect(swayingFrame?.translateY).toBe(ballisticFrame?.translateY);
        expect((swayingFrame?.translateX ?? 0) - (ballisticFrame?.translateX ?? 0)).toBeCloseTo(expectedSway, exactPrecisionDigits);
    });

    it('returns no frame before the emission delay', () => {
        expect(getConfettiPieceFrame(ballisticParticle, 0)).toBeNull();
        expect(getConfettiPieceFrame(ballisticParticle, ballisticParticle.emissionDelaySeconds - nearDeathSeconds)).toBeNull();
    });

    it('returns no frame once the lifetime is over', () => {
        const deathSeconds = ballisticParticle.emissionDelaySeconds + ballisticParticle.lifetimeSeconds;

        expect(getConfettiPieceFrame(ballisticParticle, deathSeconds)).toBeNull();
        expect(getConfettiPieceFrame(ballisticParticle, deathSeconds + 1)).toBeNull();
    });

    it('spins and flips as an analytic function of elapsed time', () => {
        const frame = getConfettiPieceFrame(ballisticParticle, ballisticParticle.emissionDelaySeconds + midFlightSeconds);
        const expectedRotation = ballisticParticle.spinRate * midFlightSeconds + ballisticParticle.spinPhase;
        const expectedScaleX = Math.cos(ballisticParticle.flipRate * midFlightSeconds + ballisticParticle.flipPhase);

        expect(frame?.rotation).toBeCloseTo(expectedRotation, exactPrecisionDigits);
        expect(frame?.scaleX).toBeCloseTo(expectedScaleX, exactPrecisionDigits);
    });

    it('stays opaque until the fade out window and then fades to zero', () => {
        const fadeStartSeconds = ballisticParticle.lifetimeSeconds * (1 - confettiFadeOutFractionConstant);
        const halfFadedSeconds = (fadeStartSeconds + ballisticParticle.lifetimeSeconds) / 2;
        const opaqueFrame = getConfettiPieceFrame(ballisticParticle, ballisticParticle.emissionDelaySeconds + fadeStartSeconds);
        const halfFadedFrame = getConfettiPieceFrame(ballisticParticle, ballisticParticle.emissionDelaySeconds + halfFadedSeconds);
        const lastFrame = getConfettiPieceFrame(
            ballisticParticle,
            ballisticParticle.emissionDelaySeconds + ballisticParticle.lifetimeSeconds - nearDeathSeconds
        );

        expect(opaqueFrame?.opacity).toBe(1);
        expect(halfFadedFrame?.opacity).toBeCloseTo(0.5, exactPrecisionDigits);
        expect(lastFrame?.opacity).toBeLessThan(nearDeathOpacityBound);
        expect(lastFrame?.opacity).toBeGreaterThan(0);
    });
});
