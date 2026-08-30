import { useLingui } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { use } from 'react';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { BlackTextStyles } from '../../../../@generic/components/black-text/black-text.styles';
import { useIridescentColor } from '../../../../@generic/hooks/use-iridescent-color.hook';
import { getDifficultyMessage } from '../../../../@generic/utils/get-difficulty-message.util';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { DifficultyComplexityOptionSelectors } from '../difficulty-complexity-option/difficulty-complexity-option.selectors';
import { difficultyComplexityRailOptionGetColor } from '../difficulty-complexity-rail-option/utils/difficulty-complexity-rail-option-get-color.util';
import { DifficultyComplexitySliderStyles as styles } from '../difficulty-complexity-slider.styles';

import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly isSelected: boolean;
    readonly onPress: () => void;
    readonly style: StyleProp<ViewStyle>;
}

export const DifficultyComplexityRailInfinityOption = ({ isSelected, onPress, style }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const iridescentColor = useIridescentColor(theme, isSelected);
    const animatedLabelStyle = useAnimatedStyle(() => ({ color: iridescentColor.value }));
    const staticLabelColor = difficultyComplexityRailOptionGetColor(theme, DifficultyEnum.Infinity, isSelected);
    const labelStyles = [
        resolveUnistyleForAnimated(BlackTextStyles.text),
        resolveUnistyleForAnimated(styles.optionLabel),
        { color: staticLabelColor },
        ...(isSelected ? [animatedLabelStyle] : [])
    ];

    return (
        <Pressable
            accessibilityRole="button"
            onPress={onPress}
            style={style}
            testID={`${DifficultyComplexityOptionSelectors.Option}.${DifficultyEnum.Infinity}`}
        >
            <Animated.Text allowFontScaling={false} numberOfLines={1} style={labelStyles}>
                {t(getDifficultyMessage(DifficultyEnum.Infinity))}
            </Animated.Text>
        </Pressable>
    );
};
