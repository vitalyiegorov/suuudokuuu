import { useLingui } from '@lingui/react/macro';
import { use } from 'react';
import { View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { ThemeContext } from '../../../theme/context/theme.context';
import { historyGetSeProfile } from '../../utils/history-get-se-profile.util';
import { HistoryDifficulty } from '../history-difficulty/history-difficulty';
import { HistoryEmptyState } from '../history-empty-state/history-empty-state';
import { HistorySolverProfile } from '../history-solver-profile/history-solver-profile';
import { HistoryTechniques } from '../history-techniques/history-techniques';
import { HistoryTotalsCard } from '../history-totals-card/history-totals-card';

import { HistoryOverviewStyles as styles } from './history-overview.styles';

import type { DifficultyEnum } from '@suuudokuuu/generator';
import type { CompletedGameType, DifficultyStatsType } from '@suuudokuuu/progress';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import type { ReactNode } from 'react';

interface Props {
    readonly difficulties: readonly DifficultyEnum[];
    readonly completedGames: readonly CompletedGameType[];
    readonly difficultyStats: readonly DifficultyStatsType[];
    readonly playedDayNumbers: readonly number[];
    readonly techniqueUsageCounts: Partial<Record<SolutionTechniqueEnum, number>>;
}

export const HistoryOverview = ({ completedGames, difficulties, difficultyStats, playedDayNumbers, techniqueUsageCounts }: Props) => {
    const { theme } = use(ThemeContext);
    const { t } = useLingui();

    if (difficulties.length === 0) {
        return <HistoryEmptyState message={t`Your stats will build as you finish puzzles.`} title={t`No stats yet`} />;
    }

    const seProfile = historyGetSeProfile(difficultyStats, completedGames);
    const separatorStyles = [styles.separator, { backgroundColor: theme.colors.surface.border }];

    const ladderRows = difficulties
        .map(difficulty => difficultyStats.find(stats => stats.difficulty === difficulty))
        .filter(isDefined)
        .map(stats => <HistoryDifficulty key={stats.difficulty} stats={stats} />);
    const lastLadderIndex = ladderRows.length - 1;
    const ladderRowsWithSeparators: ReactNode[] = ladderRows.flatMap((row, index) =>
        index === lastLadderIndex ? [row] : [row, <View key={`separator-${difficulties[index]}`} style={separatorStyles} />]
    );

    return (
        <View style={styles.container}>
            <HistorySolverProfile completedGames={completedGames} profile={seProfile} />

            <HistoryTechniques techniqueUsageCounts={techniqueUsageCounts} />

            <HistoryTotalsCard difficultyStats={difficultyStats} playedDayNumbers={playedDayNumbers} />

            <View style={styles.difficultySection}>{ladderRowsWithSeparators}</View>
        </View>
    );
};
