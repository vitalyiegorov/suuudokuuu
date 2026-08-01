import { winConfettiPaletteConstant } from '../constants/win-confetti.constant';

import type { ConfettiParticleInterface } from '../interfaces/confetti-particle.interface';

const MinSize = 6;
const MaxSize = 12;
const MinAspectRatio = 0.4;
const MaxAspectRatio = 1;
const MinDurationMilliseconds = 2800;
const MaxDurationMilliseconds = 4000;
const MinDelayMilliseconds = 0;
const MaxDelayMilliseconds = 800;
const MaxHorizontalDrift = 60;
const MinSwayAmplitude = 10;
const MaxSwayAmplitude = 40;
const MinSpinDegrees = 360;
const MaxSpinDegrees = 1080;
const MinFlipDegrees = 360;
const MaxFlipDegrees = 1080;

const randomInRange = (min: number, max: number): number => min + Math.random() * (max - min);

const randomSign = (): number => (Math.random() < 0.5 ? -1 : 1);

const pickRandomColor = (palette: readonly string[]): string => palette[Math.floor(Math.random() * palette.length)];

const createConfettiParticle = (id: number): ConfettiParticleInterface => ({
    id,
    leftRatio: Math.random(),
    size: randomInRange(MinSize, MaxSize),
    aspectRatio: randomInRange(MinAspectRatio, MaxAspectRatio),
    color: pickRandomColor(winConfettiPaletteConstant),
    durationMilliseconds: randomInRange(MinDurationMilliseconds, MaxDurationMilliseconds),
    delayMilliseconds: randomInRange(MinDelayMilliseconds, MaxDelayMilliseconds),
    horizontalDrift: randomInRange(-MaxHorizontalDrift, MaxHorizontalDrift),
    swayAmplitude: randomInRange(MinSwayAmplitude, MaxSwayAmplitude),
    spinDegrees: randomSign() * randomInRange(MinSpinDegrees, MaxSpinDegrees),
    flipDegrees: randomInRange(MinFlipDegrees, MaxFlipDegrees)
});

export const createConfettiParticles = (amount: number): ConfettiParticleInterface[] =>
    Array.from({ length: amount }, (_unused, index) => createConfettiParticle(index));
