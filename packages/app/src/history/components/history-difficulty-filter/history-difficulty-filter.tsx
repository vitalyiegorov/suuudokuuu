import { useLingui } from '@lingui/react/macro';
import { View } from 'react-native';

import { getDifficultyMessage } from '../../../@generic/utils/get-difficulty-message.util';
import { HistoryDifficultyChip } from '../history-difficulty-chip/history-difficulty-chip';

import { HistoryDifficultyFilterStyles as styles } from './history-difficulty-filter.styles';

import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly difficulties: readonly DifficultyEnum[];
    readonly onSelectDifficulty: (difficulty: DifficultyEnum | null) => void;
    readonly selectedDifficulty: DifficultyEnum | null;
}

export const HistoryDifficultyFilter = ({ difficulties, onSelectDifficulty, selectedDifficulty }: Props) => {
    const { t } = useLingui();
    const allOptions = [null, ...difficulties];

    return (
        <View style={styles.container}>
            {allOptions.map(difficulty => {
                const isSelected = selectedDifficulty === difficulty;
                const label = difficulty === null ? t`All` : t(getDifficultyMessage(difficulty));
                const handlePress = () => {
                    onSelectDifficulty(difficulty);
                };

                return <HistoryDifficultyChip isSelected={isSelected} key={label} label={label} onPress={handlePress} />;
            })}
        </View>
    );
};
