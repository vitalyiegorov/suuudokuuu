import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { use } from 'react';
import { Pressable, Text, View } from 'react-native';
import Reanimated, { interpolateColor, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';

import { cs, isDefined } from '@rnw-community/shared';

import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { getCellKey } from '../../../@generic/utils/get-cell-key.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { gameCandidatesSelector } from '../../store/game.selectors';
import { DigitButtonStyles } from '../../styles/digit-button.styles';

import { CandidateInputItemStyles as styles } from './candidate-input-item.styles';

import type { OnEventFn } from '@rnw-community/shared';
import type { CellInterface } from '@suuudokuuu/generator';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);

const selectionFillAnimationDurationMs = 90;
const selectionReleaseAnimationDurationMs = 40;

interface Props {
    readonly selectedCell?: CellInterface;
    readonly value: number;
    readonly canPress: boolean;
    readonly isExhausted: boolean;
    readonly onSelect: OnEventFn<number>;
    readonly sizeStyle: StyleProp<ViewStyle>;
    readonly digitTextStyle: StyleProp<TextStyle>;
}

export const CandidateInputItem = (props: Props) => {
    const { selectedCell, value, onSelect, canPress, isExhausted, sizeStyle, digitTextStyle } = props;

    const { theme } = use(ThemeContext);

    const candidates = useAppSelector(gameCandidatesSelector);

    const isSelected = isDefined(selectedCell) && (candidates[getCellKey(selectedCell)] ?? []).includes(value);
    const selectionAnimationDuration = isSelected ? selectionFillAnimationDurationMs : selectionReleaseAnimationDurationMs;

    const selectionAnimation = useDerivedValue(() => withTiming(isSelected ? 1 : 0, { duration: selectionAnimationDuration }));

    const animatedStyles = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(selectionAnimation.value, [0, 1], [theme.colors.candidate.bg, theme.colors.candidate.bgActive])
    }));

    const handlePress = () => {
        onSelect(value);
    };

    const buttonStyles = [
        resolveUnistyleForAnimated(DigitButtonStyles.button),
        resolveUnistyleForAnimated(styles.button),
        {
            borderColor: isSelected ? theme.colors.candidate.borderActive : theme.colors.candidate.border,
            backgroundColor: isSelected ? theme.colors.candidate.bgActive : theme.colors.candidate.bg
        },
        animatedStyles,
        cs(isExhausted, resolveUnistyleForAnimated(DigitButtonStyles.exhausted))
    ];
    const textStyles = [digitTextStyle, { color: isSelected ? theme.colors.candidate.textActive : theme.colors.candidate.text }];
    const containerStyles = [DigitButtonStyles.container, sizeStyle];

    return (
        <View style={containerStyles}>
            <ReanimatedPressable style={buttonStyles} {...(canPress && !isExhausted && { onPress: handlePress })}>
                <Text allowFontScaling={false} style={textStyles}>
                    {value}
                </Text>
            </ReanimatedPressable>
        </View>
    );
};
