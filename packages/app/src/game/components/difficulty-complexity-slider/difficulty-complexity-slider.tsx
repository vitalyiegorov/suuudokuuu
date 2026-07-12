import { Trans } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../theme/context/theme.context';

import {
    DifficultyComplexitySliderDifficulties,
    DifficultyComplexitySliderInitialIndex
} from './constant/difficulty-complexity-slider.constant';
import { DifficultyComplexityRail } from './difficulty-complexity-rail/difficulty-complexity-rail';
import { DifficultyComplexitySliderStyles as styles } from './difficulty-complexity-slider.styles';

interface Props {
    readonly difficulty: DifficultyEnum;
    readonly onChange: (difficulty: DifficultyEnum) => void;
}

export const DifficultyComplexitySlider = ({ difficulty, onChange }: Props) => {
    const { theme } = use(ThemeContext);
    const selectedDifficultyIndex = DifficultyComplexitySliderDifficulties.indexOf(difficulty);
    const selectedIndex = selectedDifficultyIndex < 0 ? DifficultyComplexitySliderInitialIndex : selectedDifficultyIndex;
    const selectedDifficulty = DifficultyComplexitySliderDifficulties[selectedIndex] ?? DifficultyEnum.Easy;
    const titleStyles = [styles.title, { color: theme.colors.label.main }];

    return (
        <View style={styles.panel}>
            <View style={styles.header}>
                <View style={styles.difficultySummary}>
                    <BlackText style={titleStyles}>
                        <Trans>Difficulty</Trans>
                    </BlackText>
                </View>
            </View>

            <DifficultyComplexityRail
                difficulty={difficulty}
                onChange={onChange}
                selectedDifficulty={selectedDifficulty}
                selectedIndex={selectedIndex}
            />
        </View>
    );
};
