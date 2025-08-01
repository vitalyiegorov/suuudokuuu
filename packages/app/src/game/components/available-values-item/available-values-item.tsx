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

import { ThemeContext } from '../../../@generic/context/theme.context';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { settingsFontSizeMultiplierSelector } from '../../../settings/store/settings.selectors';
import { CellFontSizeConstant } from '../constants/dimensions.contant';

import { AvailableValueItemSelectors as selectors } from './available-value-item.selectors';
import { AvailableValuesItemStyles as styles } from './available-values-item.styles';

import type { OnEventFn } from '@rnw-community/shared';
import type { Ref } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);

interface Props {
    readonly value: number;
    readonly canPress: boolean;
    readonly isActive: boolean;
    readonly progress: number;
    readonly correctValue?: number;
    readonly onSelect: OnEventFn<number>;
    readonly ref: Ref<AvailableValuesItemRef>;
}

export interface AvailableValuesItemRef {
    triggerAnimation: () => void;
}

export const AvailableValuesItem = ({ value, isActive, onSelect, progress, correctValue, canPress, ref }: Props) => {
    const { theme } = use(ThemeContext);

    const fontSizeMultiplier = useAppSelector(settingsFontSizeMultiplierSelector);

    const isCorrect = value === correctValue;
    const pressAnimatedBgColor = isCorrect ? theme.colors.cell.active : theme.colors.cell.error;

    const animated = useSharedValue(0);
    const animatedStyles = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(animated.value, [0, 1], [theme.colors.white, pressAnimatedBgColor]),
        ...(!isCorrect && {
            transform: [
                { translateX: interpolate(animated.value, [0, 0.5, 1], [0, -10, 10]) },
                { rotate: `${interpolate(animated.value, [0, 0.5, 1], [0, -20, 20])}deg` }
            ]
        })
    }));

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
        styles.button,
        { borderBottomColor: theme.colors.value.progress, borderColor: theme.colors.value.border },
        { backgroundColor: isActive ? theme.colors.cell.highlightedText : 'transparent' },
        animatedStyles
    ];
    const progressStyles = [
        styles.progress,
        { backgroundColor: theme.colors.cell.active },
        { width: `${progress}%` }
    ] as StyleProp<ViewStyle>;
    const textStyles = [
        { fontSize: CellFontSizeConstant * fontSizeMultiplier },
        { color: isActive ? theme.colors.cell.activeValueText : theme.colors.value.text }
    ];

    return (
        <View style={styles.container} testID={selectors.Root}>
            <ReanimatedPressable key={value} style={buttonStyles} testID={selectors.Button} {...(canPress && { onPress: handlePress })}>
                <Text allowFontScaling={false} style={textStyles}>
                    {value}
                </Text>
            </ReanimatedPressable>

            <View style={progressStyles} />
        </View>
    );
};
