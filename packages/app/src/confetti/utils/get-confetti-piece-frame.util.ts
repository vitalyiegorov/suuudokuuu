import { confettiFadeOutFractionConstant } from '../constants/confetti-physics.constant';

import type { ConfettiFrameInterface } from '../interfaces/confetti-frame.interface';
import type { ConfettiParticleInterface } from '../interfaces/confetti-particle.interface';

export const getConfettiPieceFrame = (particle: ConfettiParticleInterface, elapsedSeconds: number): ConfettiFrameInterface | null => {
    'worklet';

    const particleSeconds = elapsedSeconds - particle.emissionDelaySeconds;

    if (particleSeconds < 0 || particleSeconds >= particle.lifetimeSeconds) {
        return null;
    }

    const horizontalDecay = 1 - Math.exp(-particle.horizontalDrag * particleSeconds);
    const verticalDecay = 1 - Math.exp(-particle.verticalDrag * particleSeconds);
    const terminalVelocity = particle.gravity / particle.verticalDrag;
    const sway = particle.swayAmplitude * Math.sin(particle.swayFrequency * particleSeconds + particle.swayPhase);
    const ballisticX = (particle.initialVelocityX / particle.horizontalDrag) * horizontalDecay;
    const ballisticY =
        terminalVelocity * particleSeconds + ((particle.initialVelocityY - terminalVelocity) / particle.verticalDrag) * verticalDecay;
    const fadeStartSeconds = particle.lifetimeSeconds * (1 - confettiFadeOutFractionConstant);
    const fadeProgress = (particleSeconds - fadeStartSeconds) / (particle.lifetimeSeconds - fadeStartSeconds);
    const opacity = particleSeconds < fadeStartSeconds ? 1 : 1 - fadeProgress;

    return {
        opacity,
        rotation: particle.spinRate * particleSeconds + particle.spinPhase,
        scaleX: Math.cos(particle.flipRate * particleSeconds + particle.flipPhase),
        translateX: particle.spawnX + ballisticX + sway,
        translateY: particle.spawnY + ballisticY
    };
};
