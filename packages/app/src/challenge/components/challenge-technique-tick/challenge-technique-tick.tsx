import { use } from 'react';
import Animated, { interpolate, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';

import { ThemeContext } from '../../../theme/context/theme.context';
import { challengeTechniqueTierVisualConstant } from '../../constants/challenge-technique-tier-visual.constant';
import { getTechniqueTierColor } from '../../utils/get-technique-tier-color.util';

import { ChallengeTechniqueTickStyles as styles } from './challenge-technique-tick.styles';

import type { ChallengeTechniqueTierEnum } from '../../enums/challenge-technique-tier.enum';
import type { ViewStyle } from 'react-native';

const REVEAL_DURATION_MS = 260;
const DIM_OPACITY = 0.28;
const REVEAL_INPUT = [0, 1];
const REVEAL_OPACITY_OUTPUT = [DIM_OPACITY, 1];
const REVEAL_SCALE_OUTPUT = [0.5, 1];

interface Props {
    readonly positionPercent: number;
    readonly tier: ChallengeTechniqueTierEnum;
    readonly isPassed: boolean;
}

export const ChallengeTechniqueTick = ({ positionPercent, tier, isPassed }: Props) => {
    const { theme } = use(ThemeContext);

    const reveal = useDerivedValue(() => withTiming(isPassed ? 1 : 0, { duration: REVEAL_DURATION_MS }));

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(reveal.value, REVEAL_INPUT, REVEAL_OPACITY_OUTPUT),
        transform: [{ scaleY: interpolate(reveal.value, REVEAL_INPUT, REVEAL_SCALE_OUTPUT) }]
    }));

    const { height, width } = challengeTechniqueTierVisualConstant[tier];
    const color = getTechniqueTierColor(tier, theme);
    const positionStyle: ViewStyle = { backgroundColor: color, height, left: `${positionPercent}%`, width };
    const tickStyle = [styles.tick, positionStyle, animatedStyle];

    return <Animated.View style={tickStyle} />;
};
