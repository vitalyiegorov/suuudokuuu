import { DifficultyEnum } from '@suuudokuuu/generator';
import { use } from 'react';

import { ThemeContext } from '../../../../theme/context/theme.context';
import { DifficultyComplexityOption } from '../difficulty-complexity-option/difficulty-complexity-option';
import { DifficultyComplexityRailInfinityOption } from '../difficulty-complexity-rail-infinity-option/difficulty-complexity-rail-infinity-option';
import { DifficultyComplexitySliderStyles as styles } from '../difficulty-complexity-slider.styles';

import { difficultyComplexityRailOptionGetColor } from './utils/difficulty-complexity-rail-option-get-color.util';

import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly difficulty: DifficultyEnum;
    readonly onPress: () => void;
    readonly selectedDifficulty: DifficultyEnum;
    readonly style: StyleProp<ViewStyle>;
}

export const DifficultyComplexityRailOption = (props: Props) => {
    const { difficulty, onPress, selectedDifficulty, style } = props;
    const { theme } = use(ThemeContext);
    const isSelected = difficulty === selectedDifficulty;

    if (difficulty === DifficultyEnum.Infinity) {
        return <DifficultyComplexityRailInfinityOption isSelected={isSelected} onPress={onPress} style={style} />;
    }

    const optionLabelColor = difficultyComplexityRailOptionGetColor(theme, difficulty, isSelected);
    const optionLabelStyles = [styles.optionLabel, { color: optionLabelColor }];

    return <DifficultyComplexityOption difficulty={difficulty} labelStyle={optionLabelStyles} onPress={onPress} style={style} />;
};
