import { use } from 'react';
import { type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { ThemeContext } from '../../../../theme/context/theme.context';
import { DifficultyComplexitySliderMaxIndex } from '../constant/difficulty-complexity-slider.constant';
import { DifficultyComplexityOption } from '../difficulty-complexity-option/difficulty-complexity-option';
import { DifficultyComplexitySliderStyles as styles } from '../difficulty-complexity-slider.styles';

import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly difficulty: DifficultyEnum;
    readonly onPress: () => void;
    readonly optionIndex: number;
    readonly selectedDifficulty: DifficultyEnum;
}

export const DifficultyComplexityRailOption = (props: Props) => {
    const { difficulty, onPress, optionIndex, selectedDifficulty } = props;
    const { theme } = use(ThemeContext);
    const isSelected = difficulty === selectedDifficulty;
    const isFirstOption = optionIndex === 0;
    const isLastOption = optionIndex === DifficultyComplexitySliderMaxIndex;
    let optionTriggerAlignmentStyles: StyleProp<ViewStyle> = styles.optionTriggerCenter;
    let optionLabelAlignmentStyles: StyleProp<TextStyle> = styles.optionLabelCenter;

    if (isFirstOption) {
        optionTriggerAlignmentStyles = styles.optionTriggerStart;
        optionLabelAlignmentStyles = styles.optionLabelStart;
    }

    if (isLastOption) {
        optionTriggerAlignmentStyles = styles.optionTriggerEnd;
        optionLabelAlignmentStyles = styles.optionLabelEnd;
    }

    const optionLabelStyles = [
        styles.optionLabel,
        optionLabelAlignmentStyles,
        { color: isSelected ? theme.colors.label.main : theme.colors.label.hint }
    ];
    const optionTriggerStyles = [styles.optionTrigger, optionTriggerAlignmentStyles];

    return (
        <DifficultyComplexityOption difficulty={difficulty} labelStyle={optionLabelStyles} onPress={onPress} style={optionTriggerStyles} />
    );
};
