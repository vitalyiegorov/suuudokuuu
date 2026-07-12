import { View } from 'react-native';

import { getDifficultyText } from '../../../@generic/utils/get-difficulty-text.util';
import { HistoryDifficultyChip } from '../history-difficulty-chip/history-difficulty-chip';

import { HistoryDifficultySelectorStyles as styles } from './history-difficulty-selector.styles';

import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly difficulties: readonly DifficultyEnum[];
    readonly onSelectDifficulty: (difficulty: DifficultyEnum) => void;
    readonly selectedDifficulty: DifficultyEnum;
}

export const HistoryDifficultySelector = ({ difficulties, onSelectDifficulty, selectedDifficulty }: Props) => (
    <View style={styles.container}>
        {difficulties.map(difficulty => {
            const isSelected = difficulty === selectedDifficulty;
            const label = getDifficultyText(difficulty);
            const handlePress = () => {
                onSelectDifficulty(difficulty);
            };

            return <HistoryDifficultyChip isSelected={isSelected} key={difficulty} label={label} onPress={handlePress} />;
        })}
    </View>
);
