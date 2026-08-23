export type CelebrationPulseVariant = 'default' | 'hell' | 'infinity';

export const CelebrationPulseRepeatCount = 4;

interface CelebrationPulseExtraRingConfig {
    readonly delayMs: number;
    readonly opacityOutput: readonly [number, number];
    readonly scaleOutput: readonly [number, number];
}

const HellExtraRingDelayMs = 260;
const HellExtraRingOpacityStart = 0.32;
const HellExtraRingOpacityEnd = 0;
const HellExtraRingScaleStart = 0.75;
const HellExtraRingScaleEnd = 1.55;

const InfinityFirstExtraRingDelayMs = 220;
const InfinityFirstExtraRingOpacityStart = 0.5;
const InfinityFirstExtraRingOpacityEnd = 0;
const InfinityFirstExtraRingScaleStart = 0.7;
const InfinityFirstExtraRingScaleEnd = 2.05;

const InfinitySecondExtraRingDelayMs = 440;
const InfinitySecondExtraRingOpacityStart = 0.4;
const InfinitySecondExtraRingOpacityEnd = 0;
const InfinitySecondExtraRingScaleStart = 0.7;
const InfinitySecondExtraRingScaleEnd = 2.3;

export const CelebrationPulseExtraRingsByVariant: Record<CelebrationPulseVariant, readonly CelebrationPulseExtraRingConfig[]> = {
    default: [],
    hell: [
        {
            delayMs: HellExtraRingDelayMs,
            opacityOutput: [HellExtraRingOpacityStart, HellExtraRingOpacityEnd],
            scaleOutput: [HellExtraRingScaleStart, HellExtraRingScaleEnd]
        }
    ],
    infinity: [
        {
            delayMs: InfinityFirstExtraRingDelayMs,
            opacityOutput: [InfinityFirstExtraRingOpacityStart, InfinityFirstExtraRingOpacityEnd],
            scaleOutput: [InfinityFirstExtraRingScaleStart, InfinityFirstExtraRingScaleEnd]
        },
        {
            delayMs: InfinitySecondExtraRingDelayMs,
            opacityOutput: [InfinitySecondExtraRingOpacityStart, InfinitySecondExtraRingOpacityEnd],
            scaleOutput: [InfinitySecondExtraRingScaleStart, InfinitySecondExtraRingScaleEnd]
        }
    ]
};
