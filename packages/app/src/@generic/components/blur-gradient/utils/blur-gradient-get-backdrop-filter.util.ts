const WebBackdropBlurMultiplier = 0.45;
const WebBackdropMinimumBlurRadius = 8;
const WebBackdropSaturation = 1.08;
const WebBackdropBlurPrefix = 'blur(';
const WebBackdropPixelSuffix = 'px)';
const WebBackdropSaturatePrefix = ' saturate(';
const WebBackdropFilterSuffix = ')';

export const blurGradientGetBackdropFilter = (intensity: number) => {
    const blurRadius = Math.max(WebBackdropMinimumBlurRadius, intensity * WebBackdropBlurMultiplier);
    const blurRadiusValue = String(blurRadius);
    const saturationValue = String(WebBackdropSaturation);

    return (
        WebBackdropBlurPrefix +
        blurRadiusValue +
        WebBackdropPixelSuffix +
        WebBackdropSaturatePrefix +
        saturationValue +
        WebBackdropFilterSuffix
    );
};
