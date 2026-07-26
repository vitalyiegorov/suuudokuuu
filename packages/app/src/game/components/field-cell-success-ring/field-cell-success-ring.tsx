import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { use } from 'react';
import Reanimated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';

import { ThemeContext } from '../../../theme/context/theme.context';

import { FieldCellSuccessRingStyles as styles } from './field-cell-success-ring.styles';

import type { SharedValue } from 'react-native-reanimated';

const OPACITY_INPUT = [0, 0.1, 1];
const OPACITY_OUTPUT = [0, 0.8, 0];
const SCALE_INPUT = [0, 1];
const SCALE_OUTPUT = [0.8, 1.3];

interface Props {
    readonly animation: SharedValue<number>;
}

export const FieldCellSuccessRing = ({ animation }: Props) => {
    const { theme } = use(ThemeContext);

    const ringAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(animation.value, OPACITY_INPUT, OPACITY_OUTPUT),
        transform: [{ scale: interpolate(animation.value, SCALE_INPUT, SCALE_OUTPUT) }]
    }));
    const ringStyle = [resolveUnistyleForAnimated(styles.ring), { borderColor: theme.colors.cell.active }, ringAnimatedStyle];

    return <Reanimated.View pointerEvents="none" style={ringStyle} />;
};
