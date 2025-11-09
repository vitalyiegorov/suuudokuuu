import { use } from 'react';
import { Pressable, Text, View } from 'react-native';
import Reanimated, { interpolate, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { settingsFontSizeMultiplierSelector } from '../../../settings/store/settings.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { CellFontSizeConstant } from '../constants/dimensions.contant';

import { CandidateInputItemStyles as styles } from './candidate-input-item.styles';

import type { OnEventFn } from '@rnw-community/shared';

const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);

interface Props {
    readonly value: number;
    readonly canPress: boolean;
    readonly onSelect: OnEventFn<number>;
}

export const CandidateInputItem = ({ value, onSelect, canPress }: Props) => {
    const { theme } = use(ThemeContext);

    const fontSizeMultiplier = useAppSelector(settingsFontSizeMultiplierSelector);

    const animated = useSharedValue(0);
    
    // Subtle opacity pulse animation for candidate input
    const candidateOpacityMin = 0.6;
    const animatedStyles = useAnimatedStyle(() => ({
        opacity: interpolate(animated.value, [0, 0.5, 1], [1, candidateOpacityMin, 1])
    }));

    const triggerAnimationFn = () => {
        animated.value = withSequence(withTiming(1, { duration: 200 }), withTiming(0, { duration: 200 }));
    };

    const handlePress = () => {
        triggerAnimationFn();
        onSelect(value);
    };

    const buttonStyles = [
        styles.button,
        { 
            borderColor: theme.colors.candidate.bgActive,
            borderWidth: 2
        },
        animatedStyles
    ];
    
    const textStyles = [
        { fontSize: CellFontSizeConstant * fontSizeMultiplier },
        { color: theme.colors.value.text }
    ];

    return (
        <View style={styles.container}>
            <ReanimatedPressable style={buttonStyles} {...(canPress && { onPress: handlePress })}>
                <Text allowFontScaling={false} style={textStyles}>
                    {value}
                </Text>
            </ReanimatedPressable>
        </View>
    );
};
