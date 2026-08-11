const MaxColorChannelValue = 255;
const SrgbLinearizationThreshold = 0.03928;
const SrgbDelinearizationThreshold = 0.0031308;
const SrgbLinearSlope = 12.92;
const SrgbGammaOffset = 0.055;
const SrgbGammaDivisor = 1.055;
const SrgbGammaExponent = 2.4;
const SrgbGammaNumerator = 1;
const SrgbInverseGammaExponent = SrgbGammaNumerator / SrgbGammaExponent;

export const linearizeSrgbChannel = (channel: number): number => {
    const normalized = channel / MaxColorChannelValue;

    return normalized <= SrgbLinearizationThreshold
        ? normalized / SrgbLinearSlope
        : ((normalized + SrgbGammaOffset) / SrgbGammaDivisor) ** SrgbGammaExponent;
};

export const delinearizeSrgbChannel = (linearChannel: number): number => {
    const clamped = Math.min(1, Math.max(0, linearChannel));
    const normalized =
        clamped <= SrgbDelinearizationThreshold
            ? clamped * SrgbLinearSlope
            : SrgbGammaDivisor * clamped ** SrgbInverseGammaExponent - SrgbGammaOffset;

    return normalized * MaxColorChannelValue;
};
