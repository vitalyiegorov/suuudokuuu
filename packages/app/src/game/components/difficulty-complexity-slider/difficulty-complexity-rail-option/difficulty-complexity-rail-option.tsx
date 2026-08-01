import { use } from 'react';

import { ThemeContext } from '../../../../theme/context/theme.context';
import { DifficultyComplexityOption } from '../difficulty-complexity-option/difficulty-complexity-option';
import { DifficultyComplexitySliderStyles as styles } from '../difficulty-complexity-slider.styles';

import { difficultyComplexityRailOptionGetColor } from './utils/difficulty-complexity-rail-option-get-color.util';

import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly difficulty: DifficultyEnum;
    readonly onPress: () => void;
    readonly selectedDifficulty: DifficultyEnum;
}

export const DifficultyComplexityRailOption = (props: Props) => {
    const { difficulty, onPress, selectedDifficulty } = props;
    const { theme } = use(ThemeContext);
    const isSelected = difficulty === selectedDifficulty;

    const optionLabelColor = difficultyComplexityRailOptionGetColor(theme, difficulty, isSelected);
    const optionLabelStyles = [styles.optionLabel, { color: optionLabelColor }];

    return (
        <DifficultyComplexityOption difficulty={difficulty} labelStyle={optionLabelStyles} onPress={onPress} style={styles.optionTrigger} />
    );
};
