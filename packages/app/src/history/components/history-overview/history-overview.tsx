import { useLingui } from '@lingui/react/macro';
import { View } from 'react-native';

import { historyGetCompletedGames } from '../../utils/history-get-completed-games.util';
import { HistoryDifficulty } from '../history-difficulty/history-difficulty';
import { HistoryEmptyState } from '../history-empty-state/history-empty-state';
import { HistoryRatingBands } from '../history-rating-bands/history-rating-bands';
import { HistoryTechniques } from '../history-techniques/history-techniques';
import { HistoryTotalsCard } from '../history-totals-card/history-totals-card';

import { HistoryOverviewStyles as styles } from './history-overview.styles';

import type { HistoryGameInterface } from '../../interfaces/history-game.interface';
import type { DifficultyEnum } from '@suuudokuuu/generator';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

interface Props {
    readonly difficulties: readonly DifficultyEnum[];
    readonly historyByDifficulty: Record<DifficultyEnum, HistoryGameInterface>;
    readonly playedDayNumbers: readonly number[];
    readonly techniqueUsageCounts: Partial<Record<SolutionTechniqueEnum, number>>;
}

export const HistoryOverview = ({ difficulties, historyByDifficulty, playedDayNumbers, techniqueUsageCounts }: Props) => {
    const { t } = useLingui();

    if (difficulties.length === 0) {
        return <HistoryEmptyState message={t`Your stats will build as you finish puzzles.`} title={t`No stats yet`} />;
    }

    const completedGames = historyGetCompletedGames(historyByDifficulty);

    return (
        <View style={styles.container}>
            <HistoryTotalsCard historyByDifficulty={historyByDifficulty} playedDayNumbers={playedDayNumbers} />

            <HistoryRatingBands completedGames={completedGames} />

            <HistoryTechniques techniqueUsageCounts={techniqueUsageCounts} />

            <View style={styles.difficultySection}>
                {difficulties.map(difficulty => (
                    <HistoryDifficulty difficulty={difficulty} key={difficulty} />
                ))}
            </View>
        </View>
    );
};
