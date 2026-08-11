import { linearizeSrgbChannel } from './srgb-channel.util';

import type { ParsedColorInterface } from './parse-color.util';

const RedLuminanceCoefficient = 0.2126;
const GreenLuminanceCoefficient = 0.7152;
const BlueLuminanceCoefficient = 0.0722;

const getRelativeLuminance = (color: ParsedColorInterface): number =>
    RedLuminanceCoefficient * linearizeSrgbChannel(color.red) +
    GreenLuminanceCoefficient * linearizeSrgbChannel(color.green) +
    BlueLuminanceCoefficient * linearizeSrgbChannel(color.blue);

export const getContrastRatio = (foreground: ParsedColorInterface, background: ParsedColorInterface): number => {
    const foregroundLuminance = getRelativeLuminance(foreground);
    const backgroundLuminance = getRelativeLuminance(background);
    const lighter = Math.max(foregroundLuminance, backgroundLuminance);
    const darker = Math.min(foregroundLuminance, backgroundLuminance);

    return (lighter + 0.05) / (darker + 0.05);
};
