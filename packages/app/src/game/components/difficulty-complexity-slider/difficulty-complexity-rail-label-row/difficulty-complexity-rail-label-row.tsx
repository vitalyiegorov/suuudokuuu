import { View } from 'react-native';

import { DifficultyComplexitySliderDifficulties } from '../constant/difficulty-complexity-slider.constant';
import { DifficultyComplexityRailOption } from '../difficulty-complexity-rail-option/difficulty-complexity-rail-option';
import { DifficultyComplexitySliderStyles as styles } from '../difficulty-complexity-slider.styles';

import type { DifficultyEnum } from '@suuudokuuu/generator';
import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly labelDifficulties: readonly DifficultyEnum[];
    readonly onPressDifficulty: (difficulty: DifficultyEnum) => void;
    readonly selectedDifficulty: DifficultyEnum;
}

const OptionCount = DifficultyComplexitySliderDifficulties.length;
const LabelSlotStyleEntries = new Map<DifficultyEnum, StyleProp<ViewStyle>>(
    DifficultyComplexitySliderDifficulties.map((difficulty, index) => [
        difficulty,
        {
            alignItems: 'center',
            justifyContent: 'center',
            left: `${((index + 0.5) / OptionCount) * 100}%`,
            position: 'absolute',
            transform: [{ translateX: '-50%' }],
            width: `${(2 / OptionCount) * 100}%`,
            ...(index % 2 === 1 ? { bottom: 0 } : { top: 0 })
        }
    ])
);

export const DifficultyComplexityRailLabelRow = ({ labelDifficulties, onPressDifficulty, selectedDifficulty }: Props) => {
    const handlePress = (difficulty: DifficultyEnum) => () => {
        onPressDifficulty(difficulty);
    };

    return (
        <View style={styles.labelRow}>
            {labelDifficulties.map(difficulty => (
                <DifficultyComplexityRailOption
                    difficulty={difficulty}
                    key={difficulty}
                    onPress={handlePress(difficulty)}
                    selectedDifficulty={selectedDifficulty}
                    style={LabelSlotStyleEntries.get(difficulty)}
                />
            ))}
        </View>
    );
};
