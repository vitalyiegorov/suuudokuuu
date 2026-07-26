import { useLingui } from '@lingui/react/macro';
import { resolveUnistyleForAnimated, useAppLayout } from '@suuudokuuu/ui';
import { useState } from 'react';

import { CollapsibleChromePage } from '../../../@generic/components/collapsible-chrome-page/collapsible-chrome-page';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { gameHistoryByDifficultySelector } from '../../../game/store/game.selectors';
import { HistoryGamesList } from '../../../history/components/history-games-list/history-games-list';
import { HistoryOverviewTab } from '../../../history/components/history-overview-tab/history-overview-tab';
import { HistorySegmentedControl } from '../../../history/components/history-segmented-control/history-segmented-control';
import { historyGetCompletedDifficulties } from '../../../history/utils/history-get-completed-difficulties.util';
import { historyGetCompletedGames } from '../../../history/utils/history-get-completed-games.util';
import { historyGetSelectedDifficulty } from '../../../history/utils/history-get-selected-difficulty.util';
import { settingsSetAction } from '../../../settings/store/settings.actions';
import { settingsLastStatsDifficultySelector } from '../../../settings/store/settings.selectors';

import { HistoryScreenGamesTab, HistoryScreenStatsTab } from './constant/history-screen-tab.constant';
import { HistoryScreenSelectors } from './history-screen.selectors';
import { HistoryScreenStyles } from './history-screen.styles';

import type { HistoryScreenTab } from './constant/history-screen-tab.constant';
import type { DifficultyEnum } from '@suuudokuuu/generator';

export const HistoryScreen = () => {
    const { t } = useLingui();
    const dispatch = useAppDispatch();
    const { sizeClass } = useAppLayout();
    const historyByDifficulty = useAppSelector(gameHistoryByDifficultySelector);
    const lastStatsDifficulty = useAppSelector(settingsLastStatsDifficultySelector);
    const [selectedTab, setSelectedTab] = useState<HistoryScreenTab>(HistoryScreenStatsTab);
    const [selectedGamesDifficulty, setSelectedGamesDifficulty] = useState<DifficultyEnum | null>(null);

    const difficulties = historyGetCompletedDifficulties(historyByDifficulty);
    const selectedStatsDifficulty = historyGetSelectedDifficulty(difficulties, lastStatsDifficulty);
    const completedGames = historyGetCompletedGames(historyByDifficulty, difficulties);
    const handleSelectStatsDifficulty = (difficulty: DifficultyEnum) => {
        dispatch(settingsSetAction({ lastStatsDifficulty: difficulty }));
    };
    const handleShowGames = (difficulty: DifficultyEnum) => {
        setSelectedGamesDifficulty(difficulty);
        setSelectedTab(HistoryScreenGamesTab);
    };
    const content =
        selectedTab === HistoryScreenStatsTab ? (
            <HistoryOverviewTab
                difficulties={difficulties}
                historyByDifficulty={historyByDifficulty}
                onSelectDifficulty={handleSelectStatsDifficulty}
                onShowGames={handleShowGames}
                selectedDifficulty={selectedStatsDifficulty}
            />
        ) : (
            <HistoryGamesList
                difficulties={difficulties}
                games={completedGames}
                onSelectDifficulty={setSelectedGamesDifficulty}
                selectedDifficulty={selectedGamesDifficulty}
                showFilters
            />
        );

    return (
        <CollapsibleChromePage
            contentContainerStyle={resolveUnistyleForAnimated(HistoryScreenStyles.scrollViewContainer)}
            contentStyle={HistoryScreenStyles.content}
            showsVerticalScrollIndicator={false}
            style={resolveUnistyleForAnimated(HistoryScreenStyles.scrollView(sizeClass))}
            testID={HistoryScreenSelectors.Root}
            title={t`Statistics`}
        >
            <HistorySegmentedControl selectedTab={selectedTab} onSelectTab={setSelectedTab} />

            {content}
        </CollapsibleChromePage>
    );
};
