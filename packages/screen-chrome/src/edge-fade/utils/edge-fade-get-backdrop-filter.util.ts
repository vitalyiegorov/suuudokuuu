export const getEdgeFadeBackdropFilter = (intensity: number): string => {
    const minBlurPx = 8;
    const intensityMultiplier = 0.45;
    const saturation = 1.08;
    const blurPx = Math.max(minBlurPx, intensity * intensityMultiplier);

    return `blur(${blurPx}px) saturate(${saturation})`;
};
