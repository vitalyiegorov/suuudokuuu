import { plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { use } from 'react';
import { Pressable, Text, View } from 'react-native';
import Reanimated, { interpolateColor, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';

import { cs, isDefined } from '@rnw-community/shared';

import { useReduceMotion } from '../../../@generic/hooks/use-reduce-motion.hook';
import { getCellKey } from '../../../@generic/utils/get-cell-key.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { PanelControlHitSlopConstant } from '../../constant/panel-control-size.constant';
import { GameContext } from '../../context/game.context';
import { DigitButtonStyles } from '../../styles/digit-button.styles';

import { CandidateInputItemSelectors as selectors } from './candidate-input-item.selectors';
import { CandidateInputItemStyles as styles } from './candidate-input-item.styles';

import type { OnEventFn } from '@rnw-community/shared';
import type { CellInterface } from '@suuudokuuu/generator';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);

const selectionFillAnimationDurationMs = 90;
const selectionReleaseAnimationDurationMs = 40;
const selectionInstantAnimationDurationMs = 0;

interface Props {
    readonly selectedCell?: CellInterface;
    readonly value: number;
    readonly canPress: boolean;
    readonly isExhausted: boolean;
    readonly remaining: number;
    readonly onSelect: OnEventFn<number>;
    readonly sizeStyle: StyleProp<ViewStyle>;
    readonly digitTextStyle: StyleProp<TextStyle>;
}

export const CandidateInputItem = (props: Props) => {
    const { selectedCell, value, onSelect, canPress, isExhausted, remaining, sizeStyle, digitTextStyle } = props;

    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const { snapshot } = use(GameContext);

    const isMotionReduced = useReduceMotion();

    const { candidates } = snapshot;

    const isSelected = isDefined(selectedCell) && (candidates[getCellKey(selectedCell)] ?? []).includes(value);
    const selectedAnimationDuration = isSelected ? selectionFillAnimationDurationMs : selectionReleaseAnimationDurationMs;
    const selectionAnimationDuration = isMotionReduced ? selectionInstantAnimationDurationMs : selectedAnimationDuration;

    const selectionAnimation = useDerivedValue(() => withTiming(isSelected ? 1 : 0, { duration: selectionAnimationDuration }));

    const animatedStyles = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            selectionAnimation.value,
            [0, 1],
            [theme.colors.candidate.fill, theme.colors.candidate.fillSelected]
        )
    }));

    const handlePress = () => {
        onSelect(value);
    };

    const buttonStyles = [
        resolveUnistyleForAnimated(DigitButtonStyles.button),
        resolveUnistyleForAnimated(styles.button),
        {
            borderColor: isSelected ? theme.colors.candidate.borderSelected : theme.colors.surface.border,
            backgroundColor: isSelected ? theme.colors.candidate.fillSelected : theme.colors.candidate.fill
        },
        animatedStyles,
        cs(isExhausted, resolveUnistyleForAnimated(DigitButtonStyles.exhausted))
    ];
    const textStyles = [digitTextStyle, { color: isSelected ? theme.colors.candidate.textSelected : theme.colors.candidate.text }];
    const containerStyles = [DigitButtonStyles.container, sizeStyle];
    const isDisabled = !canPress || isExhausted;
    const noteAccessibilityLabel = t({
        message: plural(remaining, { one: `Note ${value}, # left to place`, other: `Note ${value}, # left to place` })
    });
    const noteAccessibilityState = { checked: isSelected, disabled: isDisabled };

    return (
        <View style={containerStyles} testID={selectors.Root}>
            <ReanimatedPressable
                accessibilityLabel={noteAccessibilityLabel}
                accessibilityRole="togglebutton"
                accessibilityState={noteAccessibilityState}
                hitSlop={PanelControlHitSlopConstant}
                style={buttonStyles}
                testID={`${selectors.Button}.${value}`}
                {...(canPress && !isExhausted && { onPress: handlePress })}
            >
                <Text allowFontScaling={false} style={textStyles}>
                    {value}
                </Text>
            </ReanimatedPressable>
        </View>
    );
};
