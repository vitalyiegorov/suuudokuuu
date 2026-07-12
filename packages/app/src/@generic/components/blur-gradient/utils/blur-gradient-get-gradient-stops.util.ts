import { easeGradient } from 'react-native-easing-gradient';

import { BlurGradientConfig } from '../constant/blur-gradient.constant';

import type { BlurGradientPosition } from '../constant/blur-gradient.constant';
import type { ColorValue } from 'react-native';

interface BlurGradientStopsInterface {
    readonly colors: readonly [ColorValue, ColorValue, ...ColorValue[]];
    readonly locations: readonly [number, number, ...number[]];
}

export const blurGradientGetGradientStops = (position: BlurGradientPosition): BlurGradientStopsInterface => {
    const { colors, locations } = easeGradient({
        colorStops: BlurGradientConfig.mask[position]
    });

    const [firstColor, secondColor, ...remainingColors] = colors;
    const [firstLocation, secondLocation, ...remainingLocations] = locations;

    return {
        colors: [firstColor, secondColor, ...remainingColors],
        locations: [firstLocation, secondLocation, ...remainingLocations]
    };
};
