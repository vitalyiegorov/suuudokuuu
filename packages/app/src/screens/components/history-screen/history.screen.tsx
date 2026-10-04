import { useLingui } from '@lingui/react/macro';
import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';

import { CollapsibleChromePage } from '../../../@generic/components/collapsible-chrome-page/collapsible-chrome-page';
import { DifficultyComplexitySliderDifficulties } from '../../../game/components/difficulty-complexity-slider/constant/difficulty-complexity-slider.constant';
import { HistoryOverview } from '../../../history/components/history-overview/history-overview';
import { useCompletedGames } from '../../../history/query/use-completed-games.query';
import { useDifficultyStats } from '../../../history/query/use-difficulty-stats.query';
import { usePlayerStats } from '../../../history/query/use-player-stats.query';

import { HistoryScreenSelectors } from './history-screen.selectors';
import { HistoryScreenStyles } from './history-screen.styles';

export const HistoryScreen = () => {
    const { t } = useLingui();
    const difficultyStats = useDifficultyStats();
    const completedGames = useCompletedGames();
    const { playedDayNumbers, techniqueUsageCounts } = usePlayerStats();

    const difficulties = DifficultyComplexitySliderDifficulties.filter(difficulty =>
        difficultyStats.some(stats => stats.difficulty === difficulty && stats.gamesCompleted > 0)
    ).reverse();

    return (
        <CollapsibleChromePage
            contentContainerStyle={resolveUnistyleForAnimated(HistoryScreenStyles.scrollViewContainer)}
            style={resolveUnistyleForAnimated(HistoryScreenStyles.scrollView)}
            testID={HistoryScreenSelectors.Root}
            title={t`Statistics`}
        >
            <HistoryOverview
                completedGames={completedGames}
                difficulties={difficulties}
                difficultyStats={difficultyStats}
                playedDayNumbers={playedDayNumbers}
                techniqueUsageCounts={techniqueUsageCounts}
            />
        </CollapsibleChromePage>
    );
};
