const MaxColorChannelValue = 255;
const SrgbLinearizationThreshold = 0.03928;
const SrgbLinearSlope = 12.92;
const SrgbGammaOffset = 0.055;
const SrgbGammaDivisor = 1.055;
const SrgbGammaExponent = 2.4;

export const linearizeSrgbChannel = (channel: number): number => {
    const normalized = channel / MaxColorChannelValue;

    return normalized <= SrgbLinearizationThreshold
        ? normalized / SrgbLinearSlope
        : ((normalized + SrgbGammaOffset) / SrgbGammaDivisor) ** SrgbGammaExponent;
};
