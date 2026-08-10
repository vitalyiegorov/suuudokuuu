import {
    confettiEmissionStaggerSecondsConstant,
    confettiFullTurnRadiansConstant,
    confettiMaxAspectRatioConstant,
    confettiMaxFlipRateConstant,
    confettiMaxGravityRatioConstant,
    confettiMaxHorizontalDragRatioConstant,
    confettiMaxLaunchAngleDegreesConstant,
    confettiMaxLifetimeSecondsConstant,
    confettiMaxSpeedRatioConstant,
    confettiMaxSpinRateConstant,
    confettiMaxSwayAmplitudeConstant,
    confettiMaxSwayFrequencyConstant,
    confettiMaxVerticalDragConstant,
    confettiMaxWidthConstant,
    confettiMinAspectRatioConstant,
    confettiMinFlipRateConstant,
    confettiMinGravityRatioConstant,
    confettiMinHorizontalDragRatioConstant,
    confettiMinLaunchAngleDegreesConstant,
    confettiMinLifetimeSecondsConstant,
    confettiMinSpeedRatioConstant,
    confettiMinSpinRateConstant,
    confettiMinSwayAmplitudeConstant,
    confettiMinSwayFrequencyConstant,
    confettiMinVerticalDragConstant,
    confettiMinWidthConstant,
    confettiRadiansPerDegreeConstant,
    confettiSpawnJitterRatioConstant
} from '../constants/confetti-physics.constant';
import { winConfettiPaletteConstant } from '../constants/win-confetti.constant';

import type { ConfettiParticleInterface } from '../interfaces/confetti-particle.interface';

const leftCannonDirection = 1;
const rightCannonDirection = -1;
const counterClockwiseProbability = 0.5;

const randomInRange = (random: () => number, minimum: number, maximum: number): number => minimum + random() * (maximum - minimum);

const createConfettiParticle = (
    screenWidth: number,
    screenHeight: number,
    index: number,
    random: () => number
): ConfettiParticleInterface => {
    const cannonDirection = index % 2 === 0 ? leftCannonDirection : rightCannonDirection;
    const cannonX = cannonDirection === leftCannonDirection ? 0 : screenWidth;
    const spawnJitter = screenWidth * confettiSpawnJitterRatioConstant;
    const launchAngle =
        randomInRange(random, confettiMinLaunchAngleDegreesConstant, confettiMaxLaunchAngleDegreesConstant) *
        confettiRadiansPerDegreeConstant;
    const speed = screenHeight * randomInRange(random, confettiMinSpeedRatioConstant, confettiMaxSpeedRatioConstant);
    const verticalDrag = randomInRange(random, confettiMinVerticalDragConstant, confettiMaxVerticalDragConstant);
    const horizontalDragRatio = randomInRange(random, confettiMinHorizontalDragRatioConstant, confettiMaxHorizontalDragRatioConstant);
    const width = randomInRange(random, confettiMinWidthConstant, confettiMaxWidthConstant);

    return {
        colorIndex: Math.floor(random() * winConfettiPaletteConstant.length),
        emissionDelaySeconds: random() * confettiEmissionStaggerSecondsConstant,
        flipPhase: random() * confettiFullTurnRadiansConstant,
        flipRate: randomInRange(random, confettiMinFlipRateConstant, confettiMaxFlipRateConstant),
        gravity: screenHeight * randomInRange(random, confettiMinGravityRatioConstant, confettiMaxGravityRatioConstant),
        height: width * randomInRange(random, confettiMinAspectRatioConstant, confettiMaxAspectRatioConstant),
        horizontalDrag: (verticalDrag * screenHeight * horizontalDragRatio) / screenWidth,
        initialVelocityX: cannonDirection * speed * Math.cos(launchAngle),
        initialVelocityY: -speed * Math.sin(launchAngle),
        lifetimeSeconds: randomInRange(random, confettiMinLifetimeSecondsConstant, confettiMaxLifetimeSecondsConstant),
        spawnX: cannonX + cannonDirection * random() * spawnJitter,
        spawnY: screenHeight - random() * spawnJitter,
        spinPhase: random() * confettiFullTurnRadiansConstant,
        spinRate:
            (random() < counterClockwiseProbability ? -1 : 1) *
            randomInRange(random, confettiMinSpinRateConstant, confettiMaxSpinRateConstant),
        swayAmplitude: randomInRange(random, confettiMinSwayAmplitudeConstant, confettiMaxSwayAmplitudeConstant),
        swayFrequency: randomInRange(random, confettiMinSwayFrequencyConstant, confettiMaxSwayFrequencyConstant),
        swayPhase: random() * confettiFullTurnRadiansConstant,
        verticalDrag,
        width
    };
};

export const createConfettiBurst = (
    screenWidth: number,
    screenHeight: number,
    particleAmount: number,
    random: () => number = Math.random
): ConfettiParticleInterface[] =>
    Array.from({ length: particleAmount }, (_unused, index) => createConfettiParticle(screenWidth, screenHeight, index, random));
