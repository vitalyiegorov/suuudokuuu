import type { ParsedColorInterface } from './parse-color.util';

export const compositeColors = (foreground: ParsedColorInterface, background: ParsedColorInterface): ParsedColorInterface => {
    if (foreground.alpha >= 1) {
        return foreground;
    }

    const blendChannel = (foregroundChannel: number, backgroundChannel: number) =>
        foregroundChannel * foreground.alpha + backgroundChannel * (1 - foreground.alpha);

    return {
        red: blendChannel(foreground.red, background.red),
        green: blendChannel(foreground.green, background.green),
        blue: blendChannel(foreground.blue, background.blue),
        alpha: 1
    };
};
