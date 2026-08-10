import { isDefined } from '@rnw-community/shared';

import { winConfettiPaletteConstant } from '../constants/win-confetti.constant';

import { getConfettiPieceFrame } from './get-confetti-piece-frame.util';

import type { ConfettiParticleInterface } from '../interfaces/confetti-particle.interface';

export const drawConfettiFrame = (
    context: CanvasRenderingContext2D,
    particles: readonly ConfettiParticleInterface[],
    visibleParticleAmount: number,
    elapsedSeconds: number
): void => {
    const { height, width } = context.canvas;

    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, width, height);
    context.restore();

    for (let index = 0; index < visibleParticleAmount; index += 1) {
        const particle = particles[index];
        const frame = getConfettiPieceFrame(particle, elapsedSeconds);

        if (isDefined(frame)) {
            context.save();
            context.globalAlpha = frame.opacity;
            context.fillStyle = winConfettiPaletteConstant[particle.colorIndex];
            context.translate(frame.translateX, frame.translateY);
            context.rotate(frame.rotation);
            context.scale(frame.scaleX, 1);
            context.fillRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height);
            context.restore();
        }
    }
};
