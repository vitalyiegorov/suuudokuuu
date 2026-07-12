import type { ColorValue } from 'react-native';

export type BlurGradientPosition = 'top' | 'bottom';

type GradientColors = readonly [ColorValue, ColorValue];
type GradientColorSchema = {
    readonly dark: GradientColors;
    readonly light: GradientColors;
};

type MaskColorStops = Record<number, { readonly color: string }>;

type BlurGradientConfigInterface = {
    readonly mask: Record<BlurGradientPosition, MaskColorStops>;
    readonly overlay: Record<BlurGradientPosition, GradientColorSchema>;
};

export const BlurGradientDefaultBottomHeight = 150;
export const BlurGradientDefaultHeaderHeight = 150;
export const BlurGradientDefaultIntensity = 50;
const BlurGradientBottomTransparentStop = 0.16;

const BlurGradientLightSolid = 'rgba(255, 255, 255, 0.42)';
const BlurGradientLightWash = 'rgba(255, 255, 255, 0.08)';
const BlurGradientDarkSolid = 'rgba(0, 0, 0, 0.48)';
const BlurGradientDarkWash = 'rgba(0, 0, 0, 0.12)';

export const BlurGradientConfig: BlurGradientConfigInterface = {
    mask: {
        bottom: {
            0: { color: 'transparent' },
            [BlurGradientBottomTransparentStop]: { color: 'transparent' },
            0.7: { color: '#000000' },
            1: { color: 'rgba(0, 0, 0, 0.99)' }
        },
        top: {
            0: { color: 'rgba(0, 0, 0, 0.99)' },
            0.5: { color: '#000000' },
            1: { color: 'transparent' }
        }
    },
    overlay: {
        bottom: {
            dark: [BlurGradientDarkWash, BlurGradientDarkSolid],
            light: [BlurGradientLightWash, BlurGradientLightSolid]
        },
        top: {
            dark: [BlurGradientDarkSolid, BlurGradientDarkWash],
            light: [BlurGradientLightSolid, BlurGradientLightWash]
        }
    }
};
