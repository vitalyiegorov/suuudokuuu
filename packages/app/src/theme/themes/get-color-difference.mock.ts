import { linearizeSrgbChannel } from '../utils/srgb-channel.util';

import type { ParsedColorInterface } from '../utils/parse-color.util';

interface LabColorInterface {
    readonly lightness: number;
    readonly greenRedAxis: number;
    readonly blueYellowAxis: number;
}

const WhitePointX = 0.95047;
const WhitePointY = 1;
const WhitePointZ = 1.08883;
const LabEpsilonNumerator = 216;
const LabEpsilonDenominator = 24389;
const LabKappaDenominator = 27;
const LabEpsilon = LabEpsilonNumerator / LabEpsilonDenominator;
const LabKappa = LabEpsilonDenominator / LabKappaDenominator;
const LabLightnessScale = 116;
const LabLightnessOffset = 16;
const LabGreenRedScale = 500;
const LabBlueYellowScale = 200;
const XyzXFromRed = 0.4124;
const XyzXFromGreen = 0.3576;
const XyzXFromBlue = 0.1805;
const XyzYFromRed = 0.2126;
const XyzYFromGreen = 0.7152;
const XyzYFromBlue = 0.0722;
const XyzZFromRed = 0.0193;
const XyzZFromGreen = 0.1192;
const XyzZFromBlue = 0.9505;

const getLabComponent = (normalizedValue: number): number =>
    normalizedValue > LabEpsilon ? Math.cbrt(normalizedValue) : (LabKappa * normalizedValue + LabLightnessOffset) / LabLightnessScale;

const toLabColor = (color: ParsedColorInterface): LabColorInterface => {
    const linearRed = linearizeSrgbChannel(color.red);
    const linearGreen = linearizeSrgbChannel(color.green);
    const linearBlue = linearizeSrgbChannel(color.blue);
    const componentX = getLabComponent((XyzXFromRed * linearRed + XyzXFromGreen * linearGreen + XyzXFromBlue * linearBlue) / WhitePointX);
    const componentY = getLabComponent((XyzYFromRed * linearRed + XyzYFromGreen * linearGreen + XyzYFromBlue * linearBlue) / WhitePointY);
    const componentZ = getLabComponent((XyzZFromRed * linearRed + XyzZFromGreen * linearGreen + XyzZFromBlue * linearBlue) / WhitePointZ);

    return {
        lightness: LabLightnessScale * componentY - LabLightnessOffset,
        greenRedAxis: LabGreenRedScale * (componentX - componentY),
        blueYellowAxis: LabBlueYellowScale * (componentY - componentZ)
    };
};

export const getLightnessDifference = (first: ParsedColorInterface, second: ParsedColorInterface): number =>
    Math.abs(toLabColor(first).lightness - toLabColor(second).lightness);

export const getColorDifference = (first: ParsedColorInterface, second: ParsedColorInterface): number => {
    const firstLab = toLabColor(first);
    const secondLab = toLabColor(second);

    return Math.hypot(
        firstLab.lightness - secondLab.lightness,
        firstLab.greenRedAxis - secondLab.greenRedAxis,
        firstLab.blueYellowAxis - secondLab.blueYellowAxis
    );
};
