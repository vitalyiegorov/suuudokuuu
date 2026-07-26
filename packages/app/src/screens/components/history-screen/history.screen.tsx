import { useLingui } from '@lingui/react/macro';
import { resolveUnistyleForAnimated, useAppLayout } from '@suuudokuuu/ui';

import { CollapsibleChromePage } from '../../../@generic/components/collapsible-chrome-page/collapsible-chrome-page';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { gameHistoryByDifficultySelector } from '../../../game/store/game.selectors';
import { HistoryOverview } from '../../../history/components/history-overview/history-overview';
import { historyGetCompletedDifficulties } from '../../../history/utils/history-get-completed-difficulties.util';

import { HistoryScreenSelectors } from './history-screen.selectors';
import { HistoryScreenStyles } from './history-screen.styles';

export const HistoryScreen = () => {
    const { t } = useLingui();
    const { sizeClass } = useAppLayout();
    const historyByDifficulty = useAppSelector(gameHistoryByDifficultySelector);

    const difficulties = historyGetCompletedDifficulties(historyByDifficulty);

    return (
        <CollapsibleChromePage
            contentContainerStyle={resolveUnistyleForAnimated(HistoryScreenStyles.scrollViewContainer)}
            contentStyle={HistoryScreenStyles.content}
            showsVerticalScrollIndicator={false}
            style={resolveUnistyleForAnimated(HistoryScreenStyles.scrollView(sizeClass))}
            testID={HistoryScreenSelectors.Root}
            title={t`Statistics`}
        >
            <HistoryOverview difficulties={difficulties} historyByDifficulty={historyByDifficulty} />
        </CollapsibleChromePage>
    );
};
