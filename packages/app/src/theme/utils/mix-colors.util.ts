import { parseColor } from './parse-color.util';

import type { ParsedColorInterface } from './parse-color.util';

const OpaqueBlack: ParsedColorInterface = { red: 0, green: 0, blue: 0, alpha: 1 };

const lerpChannel = (start: number, end: number, progress: number): number => start + (end - start) * progress;

export const mixColors = (fromColor: string, toColor: string, progress: number): string => {
    const from = parseColor(fromColor) ?? OpaqueBlack;
    const to = parseColor(toColor) ?? OpaqueBlack;

    const red = Math.round(lerpChannel(from.red, to.red, progress));
    const green = Math.round(lerpChannel(from.green, to.green, progress));
    const blue = Math.round(lerpChannel(from.blue, to.blue, progress));
    const alpha = lerpChannel(from.alpha, to.alpha, progress);

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};
