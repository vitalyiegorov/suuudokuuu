import { useLingui } from '@lingui/react/macro';
import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';

import { CollapsibleChromePage } from '../../../@generic/components/collapsible-chrome-page/collapsible-chrome-page';
import { ScreenChromeWashAlphaContext } from '../../../@generic/components/screen-chrome-theme-provider/context/screen-chrome-wash-alpha.context';
import { HistoryOverview } from '../../../history/components/history-overview/history-overview';
import { useCompletedGames } from '../../../history/query/use-completed-games.query';
import { useDifficultyStats } from '../../../history/query/use-difficulty-stats.query';
import { usePlayerStats } from '../../../history/query/use-player-stats.query';

import { HistoryScreenSelectors } from './history-screen.selectors';
import { HistoryScreenStyles } from './history-screen.styles';

const HistoryScreenHeaderWashAlpha = 1;

export const HistoryScreen = () => {
    const { t } = useLingui();
    const difficultyStats = useDifficultyStats();
    const completedGames = useCompletedGames();
    const { playedDayNumbers, techniqueUsageCounts } = usePlayerStats();

    return (
        <ScreenChromeWashAlphaContext value={HistoryScreenHeaderWashAlpha}>
            <CollapsibleChromePage
                contentContainerStyle={resolveUnistyleForAnimated(HistoryScreenStyles.scrollViewContainer)}
                style={resolveUnistyleForAnimated(HistoryScreenStyles.scrollView)}
                testID={HistoryScreenSelectors.Root}
                title={t`Statistics`}
            >
                <HistoryOverview
                    completedGames={completedGames}
                    difficultyStats={difficultyStats}
                    playedDayNumbers={playedDayNumbers}
                    techniqueUsageCounts={techniqueUsageCounts}
                />
            </CollapsibleChromePage>
        </ScreenChromeWashAlphaContext>
    );
};
