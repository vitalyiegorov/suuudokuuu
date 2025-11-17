import type { RefObject } from 'react';

export interface ConfettiMethods {
    restart: () => void;
    pause: () => void;
    resume: () => void;
    addParticles: (amount: number) => void;
}

export interface ConfettiRefInternal {
    pause: () => void;
    resume: () => void;
    restart: () => void;
    addParticles: (amount: number) => void;
}

// Convert hex color to [r, g, b, a] format for typegpu-confetti
export const hexToRgba = (hex: string): [number, number, number, number] => {
    const HEX_MAX = 255;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/iu.exec(hex);
    if (result) {
        return [
            parseInt(result[1], 16) / HEX_MAX,
            parseInt(result[2], 16) / HEX_MAX,
            parseInt(result[3], 16) / HEX_MAX,
            1
        ];
    }

    // Default to white
    return [1, 1, 1, 1];
};

// Create imperative handle methods for confetti ref
export const createConfettiMethods = (
    confettiRef: RefObject<ConfettiRefInternal | null>,
    count: number
): ConfettiMethods => ({
    restart: () => {
        confettiRef.current?.restart();
        confettiRef.current?.addParticles(count);
    },
    pause: () => confettiRef.current?.pause(),
    resume: () => confettiRef.current?.resume(),
    addParticles: (amount: number) => confettiRef.current?.addParticles(amount)
});
