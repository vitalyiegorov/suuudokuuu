import { isDefined } from '@rnw-community/shared';

export interface ParsedColorInterface {
    readonly red: number;
    readonly green: number;
    readonly blue: number;
    readonly alpha: number;
}

const MaxColorChannelValue = 255;

const HexPattern = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/iu;
const RgbPattern = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d*\.?\d+)\s*)?\)$/u;

const parseHexColor = (hex: string): ParsedColorInterface => {
    if (hex.length === 3) {
        const [redChar, greenChar, blueChar] = hex;

        return {
            red: parseInt(`${redChar}${redChar}`, 16),
            green: parseInt(`${greenChar}${greenChar}`, 16),
            blue: parseInt(`${blueChar}${blueChar}`, 16),
            alpha: 1
        };
    }

    const alpha = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / MaxColorChannelValue : 1;

    return {
        red: parseInt(hex.slice(0, 2), 16),
        green: parseInt(hex.slice(2, 4), 16),
        blue: parseInt(hex.slice(4, 6), 16),
        alpha
    };
};

const parseRgbColor = (trimmedColor: string): ParsedColorInterface | null => {
    const rgbMatch = RgbPattern.exec(trimmedColor);

    if (rgbMatch === null) {
        return null;
    }

    const [, redGroup, greenGroup, blueGroup, alphaGroup] = rgbMatch;
    const red = Number(redGroup);
    const green = Number(greenGroup);
    const blue = Number(blueGroup);
    const alpha = isDefined(alphaGroup) ? Number(alphaGroup) : 1;

    if (red > MaxColorChannelValue || green > MaxColorChannelValue || blue > MaxColorChannelValue || alpha > 1) {
        return null;
    }

    return { red, green, blue, alpha };
};

export const parseColor = (color: string): ParsedColorInterface | null => {
    const trimmedColor = color.trim();
    const hexMatch = HexPattern.exec(trimmedColor);

    if (hexMatch !== null) {
        const [, hex] = hexMatch;

        return parseHexColor(hex);
    }

    return parseRgbColor(trimmedColor);
};
