import { use, useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Reanimated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { isDefined } from '@rnw-community/shared';

import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { getCellKey } from '../../../@generic/utils/get-cell-key.util';
import { settingsFontSizeMultiplierSelector } from '../../../settings/store/settings.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { gameCandidatesSelector } from '../../store/game.selectors';
import { CellFontSizeConstant } from '../constants/dimensions.contant';

import { CandidateInputItemStyles as styles } from './candidate-input-item.styles';

import type { OnEventFn } from '@rnw-community/shared';
import type { CellInterface } from '@suuudokuuu/generator';

const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);

interface Props {
    readonly selectedCell?: CellInterface;
    readonly value: number;
    readonly canPress: boolean;
    readonly onSelect: OnEventFn<number>;
}

export const CandidateInputItem = ({ selectedCell, value, onSelect, canPress }: Props) => {
    const { theme } = use(ThemeContext);

    const candidates = useAppSelector(gameCandidatesSelector);
    const fontSizeMultiplier = useAppSelector(settingsFontSizeMultiplierSelector);

    const isSelected = isDefined(selectedCell) && (candidates[getCellKey(selectedCell)] ?? []).includes(value);

    const animated = useSharedValue(isSelected ? 1 : 0);

    useEffect(() => {
        animated.value = withTiming(isSelected ? 1 : 0, { duration: 200 });
    }, [isSelected, animated]);

    const animatedStyles = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(animated.value, [0, 1], [theme.colors.white, theme.colors.candidate.bgActive])
    }));

    const handlePress = () => {
        onSelect(value);
    };

    const buttonStyles = [
        styles.button,
        {
            borderColor: isSelected ? theme.colors.candidate.borderActive : theme.colors.candidate.border,
            backgroundColor: isSelected ? theme.colors.candidate.bgActive : theme.colors.candidate.bg
        },
        animatedStyles
    ];
    const textStyles = [
        { fontSize: CellFontSizeConstant * fontSizeMultiplier },
        { color: isSelected ? theme.colors.candidate.textActive : theme.colors.candidate.text }
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
