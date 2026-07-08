import { useLingui } from '@lingui/react/macro';
import { View } from 'react-native';

import { HistoryDifficulty } from '../history-difficulty/history-difficulty';
import { HistoryDifficultySelector } from '../history-difficulty-selector/history-difficulty-selector';
import { HistoryEmptyState } from '../history-empty-state/history-empty-state';
import { HistoryTotalsCard } from '../history-totals-card/history-totals-card';

import { HistoryOverviewTabStyles as styles } from './history-overview-tab.styles';

import type { HistoryGameInterface } from '../../interfaces/history-game.interface';
import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly difficulties: readonly DifficultyEnum[];
    readonly historyByDifficulty: Record<DifficultyEnum, HistoryGameInterface>;
    readonly onSelectDifficulty: (difficulty: DifficultyEnum) => void;
    readonly onShowGames: (difficulty: DifficultyEnum) => void;
    readonly selectedDifficulty: DifficultyEnum;
}

export const HistoryOverviewTab = ({ difficulties, historyByDifficulty, onSelectDifficulty, onShowGames, selectedDifficulty }: Props) => {
    const { t } = useLingui();

    if (difficulties.length === 0) {
        return <HistoryEmptyState message={t`Your stats will build as you finish puzzles.`} title={t`No stats yet`} />;
    }

    return (
        <View style={styles.container}>
            <HistoryTotalsCard historyByDifficulty={historyByDifficulty} />

            <View style={styles.difficultySection}>
                <HistoryDifficultySelector
                    difficulties={difficulties}
                    onSelectDifficulty={onSelectDifficulty}
                    selectedDifficulty={selectedDifficulty}
                />
                <HistoryDifficulty difficulty={selectedDifficulty} onShowGames={onShowGames} />
            </View>
        </View>
    );
};
