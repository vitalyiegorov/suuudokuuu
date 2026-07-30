import type { ParsedColorInterface } from './parse-color.util';

const MaxColorChannelValue = 255;
const SrgbLinearizationThreshold = 0.03928;
const SrgbLinearSlope = 12.92;
const SrgbGammaOffset = 0.055;
const SrgbGammaDivisor = 1.055;
const SrgbGammaExponent = 2.4;
const RedLuminanceCoefficient = 0.2126;
const GreenLuminanceCoefficient = 0.7152;
const BlueLuminanceCoefficient = 0.0722;

const getChannelLuminance = (channel: number): number => {
    const normalized = channel / MaxColorChannelValue;

    return normalized <= SrgbLinearizationThreshold
        ? normalized / SrgbLinearSlope
        : ((normalized + SrgbGammaOffset) / SrgbGammaDivisor) ** SrgbGammaExponent;
};

const getRelativeLuminance = (color: ParsedColorInterface): number =>
    RedLuminanceCoefficient * getChannelLuminance(color.red) +
    GreenLuminanceCoefficient * getChannelLuminance(color.green) +
    BlueLuminanceCoefficient * getChannelLuminance(color.blue);

export const getContrastRatio = (foreground: ParsedColorInterface, background: ParsedColorInterface): number => {
    const foregroundLuminance = getRelativeLuminance(foreground);
    const backgroundLuminance = getRelativeLuminance(background);
    const lighter = Math.max(foregroundLuminance, backgroundLuminance);
    const darker = Math.min(foregroundLuminance, backgroundLuminance);

    return (lighter + 0.05) / (darker + 0.05);
};
