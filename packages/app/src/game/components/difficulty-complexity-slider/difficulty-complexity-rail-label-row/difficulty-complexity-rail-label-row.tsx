import { View } from 'react-native';

import { DifficultyComplexitySliderDifficulties } from '../constant/difficulty-complexity-slider.constant';
import { DifficultyComplexityRailOption } from '../difficulty-complexity-rail-option/difficulty-complexity-rail-option';
import { DifficultyComplexitySliderStyles as styles } from '../difficulty-complexity-slider.styles';

import type { DifficultyEnum } from '@suuudokuuu/generator';
import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly labelSlotIndexes: readonly number[];
    readonly onPressDifficulty: (difficulty: DifficultyEnum) => void;
    readonly selectedDifficulty: DifficultyEnum;
}

const OptionCount = DifficultyComplexitySliderDifficulties.length;
const LabelSlotStyles: readonly StyleProp<ViewStyle>[] = DifficultyComplexitySliderDifficulties.map((_, index) => ({
    alignItems: 'center',
    justifyContent: 'center',
    left: `${((index + 0.5) / OptionCount) * 100}%`,
    position: 'absolute',
    transform: [{ translateX: '-50%' }],
    width: `${(2 / OptionCount) * 100}%`,
    ...(index % 2 === 1 ? { bottom: 0 } : { top: 0 })
}));

export const DifficultyComplexityRailLabelRow = ({ labelSlotIndexes, onPressDifficulty, selectedDifficulty }: Props) => {
    const handlePress = (difficulty: DifficultyEnum) => () => {
        onPressDifficulty(difficulty);
    };

    return (
        <View style={styles.labelRow}>
            {labelSlotIndexes.map(index => {
                const difficulty = DifficultyComplexitySliderDifficulties[index] ?? selectedDifficulty;

                return (
                    <DifficultyComplexityRailOption
                        difficulty={difficulty}
                        key={difficulty}
                        onPress={handlePress(difficulty)}
                        selectedDifficulty={selectedDifficulty}
                        style={LabelSlotStyles[index]}
                    />
                );
            })}
        </View>
    );
};
