import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { use, useImperativeHandle } from 'react';
import { Pressable, Text, View } from 'react-native';
import Reanimated, {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { cs } from '@rnw-community/shared';

import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { settingsFontSizeMultiplierSelector } from '../../../settings/store/settings.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { PanelControlSizeConstant } from '../../constant/panel-control-size.constant';

import { AvailableValueItemSelectors as selectors } from './available-value-item.selectors';
import { AvailableValuesItemStyles as styles } from './available-values-item.styles';
import {
    AvailableValueButtonSize,
    AvailableValueProgressCenter,
    AvailableValueProgressCircumference,
    AvailableValueProgressRadius,
    AvailableValueProgressRingTransform,
    AvailableValueProgressStrokeWidth
} from './constant/available-value-button.constant';

import type { OnEventFn } from '@rnw-community/shared';
import type { Ref } from 'react';

const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);

const AvailableValueProgressOpacity = 0.65;

export interface AvailableValuesItemRef {
    triggerAnimation: OnEventFn<void>;
}

interface Props {
    readonly value: number;
    readonly canPress: boolean;
    readonly isExhausted: boolean;
    readonly progress: number;
    readonly correctValue?: number;
    readonly onSelect: OnEventFn<number>;
    readonly ref: Ref<AvailableValuesItemRef>;
}

export const AvailableValuesItem = ({ value, onSelect, progress, correctValue, canPress, isExhausted, ref }: Props) => {
    const { theme } = use(ThemeContext);

    const fontSizeMultiplier = useAppSelector(settingsFontSizeMultiplierSelector);

    const isCorrect = value === correctValue;
    const pressAnimatedBgColor = isCorrect ? theme.colors.cell.active : theme.colors.cell.error;

    const animated = useSharedValue(0);
    const animatedStyles = useAnimatedStyle(
        () => ({
            backgroundColor: interpolateColor(animated.value, [0, 1], [theme.colors.white, pressAnimatedBgColor]),
            ...(!isCorrect && {
                transform: [
                    { translateX: interpolate(animated.value, [0, 0.5, 1], [0, -10, 10]) },
                    { rotate: `${interpolate(animated.value, [0, 0.5, 1], [0, -20, 20])}deg` }
                ]
            })
        }),
        [pressAnimatedBgColor, isCorrect, theme.colors.white]
    );

    const triggerAnimationFn = () => {
        animated.value = withSequence(withTiming(1, { duration: 200 }), withTiming(0, { duration: 200 }));
    };

    useImperativeHandle(ref, () => ({
        triggerAnimation: triggerAnimationFn
    }));

    const handlePress = () => {
        triggerAnimationFn();
        onSelect(value);
    };

    const buttonStyles = [
        resolveUnistyleForAnimated(styles.button),
        { backgroundColor: theme.colors.candidate.bg },
        animatedStyles,
        cs(isExhausted, resolveUnistyleForAnimated(styles.exhausted))
    ];
    const normalizedProgress = Math.min(100, Math.max(0, progress));
    const progressDashOffset = AvailableValueProgressCircumference * (1 - normalizedProgress / 100);
    const textStyles = [
        styles.text,
        { fontSize: (PanelControlSizeConstant / 2.5) * fontSizeMultiplier },
        { color: theme.colors.value.text }
    ];

    return (
        <View style={styles.container} testID={selectors.Root}>
            <ReanimatedPressable
                key={value}
                style={buttonStyles}
                testID={`${selectors.Button}.${value}`}
                {...(canPress && !isExhausted && { onPress: handlePress })}
            >
                <Svg height={AvailableValueButtonSize} pointerEvents="none" style={styles.progressRing} width={AvailableValueButtonSize}>
                    <Circle
                        cx={AvailableValueProgressCenter}
                        cy={AvailableValueProgressCenter}
                        fill="none"
                        r={AvailableValueProgressRadius}
                        stroke={theme.colors.value.progress}
                        strokeWidth={AvailableValueProgressStrokeWidth}
                    />
                    <Circle
                        cx={AvailableValueProgressCenter}
                        cy={AvailableValueProgressCenter}
                        fill="none"
                        r={AvailableValueProgressRadius}
                        stroke={theme.colors.value.progressActive}
                        strokeOpacity={AvailableValueProgressOpacity}
                        transform={AvailableValueProgressRingTransform}
                        strokeDasharray={AvailableValueProgressCircumference}
                        strokeDashoffset={progressDashOffset}
                        strokeLinecap="round"
                        strokeWidth={AvailableValueProgressStrokeWidth}
                    />
                </Svg>
                <Text allowFontScaling={false} style={textStyles}>
                    {value}
                </Text>
            </ReanimatedPressable>
        </View>
    );
};
