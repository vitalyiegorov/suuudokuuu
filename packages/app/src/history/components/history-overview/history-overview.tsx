import { Trans, useLingui } from '@lingui/react/macro';
import { View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { DifficultyComplexitySliderDifficulties } from '../../../game/components/difficulty-complexity-slider/constant/difficulty-complexity-slider.constant';
import { historyGetSeProfile } from '../../utils/history-get-se-profile.util';
import { HistoryDifficultyUnplayed } from '../history-difficulty-unplayed/history-difficulty-unplayed';
import { HistoryDifficulty } from '../history-difficulty/history-difficulty';
import { HistoryEmptyState } from '../history-empty-state/history-empty-state';
import { HistoryProgressBox } from '../history-progress-box/history-progress-box';
import { HistorySectionTitle } from '../history-section-title/history-section-title';
import { HistorySolverProfile } from '../history-solver-profile/history-solver-profile';
import { HistoryTechniques } from '../history-techniques/history-techniques';

import { HistoryOverviewStyles as styles } from './history-overview.styles';

import type { CompletedGameType, DifficultyStatsType } from '@suuudokuuu/progress';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

interface Props {
    readonly completedGames: readonly CompletedGameType[];
    readonly difficultyStats: readonly DifficultyStatsType[];
    readonly playedDayNumbers: readonly number[];
    readonly techniqueUsageCounts: Partial<Record<SolutionTechniqueEnum, number>>;
}

export const HistoryOverview = ({ completedGames, difficultyStats, playedDayNumbers, techniqueUsageCounts }: Props) => {
    const { t } = useLingui();
    const playedStats = difficultyStats.filter(stats => stats.gamesCompleted > 0);

    if (playedStats.length === 0) {
        return <HistoryEmptyState message={t`Your stats will build as you finish puzzles.`} title={t`No stats yet`} />;
    }

    const seProfile = historyGetSeProfile(difficultyStats, completedGames);

    return (
        <View style={styles.container}>
            <HistoryTechniques techniqueUsageCounts={techniqueUsageCounts} />

            <HistoryProgressBox difficultyStats={difficultyStats} playedDayNumbers={playedDayNumbers} />

            <View style={styles.difficultySection}>
                <HistorySectionTitle>
                    <Trans>Difficulty</Trans>
                </HistorySectionTitle>

                <View>
                    {DifficultyComplexitySliderDifficulties.map(difficulty => {
                        const stats = playedStats.find(played => played.difficulty === difficulty);

                        return isDefined(stats) ? (
                            <HistoryDifficulty key={difficulty} stats={stats} />
                        ) : (
                            <HistoryDifficultyUnplayed difficulty={difficulty} key={difficulty} />
                        );
                    })}
                </View>
            </View>

            <HistorySolverProfile completedGames={completedGames} profile={seProfile} />
        </View>
    );
};
