import { useLingui } from '@lingui/react/macro';
import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';

import { CollapsibleChromePage } from '../../../@generic/components/collapsible-chrome-page/collapsible-chrome-page';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { DifficultyComplexitySliderDifficulties } from '../../../game/components/difficulty-complexity-slider/constant/difficulty-complexity-slider.constant';
import { gameHistoryByDifficultySelector } from '../../../game/store/game.selectors';
import { HistoryOverview } from '../../../history/components/history-overview/history-overview';

import { HistoryScreenSelectors } from './history-screen.selectors';
import { HistoryScreenStyles } from './history-screen.styles';

export const HistoryScreen = () => {
    const { t } = useLingui();
    const historyByDifficulty = useAppSelector(gameHistoryByDifficultySelector);

    const difficulties = DifficultyComplexitySliderDifficulties.filter(
        difficulty => historyByDifficulty[difficulty].gamesCompleted > 0
    ).reverse();

    return (
        <CollapsibleChromePage
            contentContainerStyle={resolveUnistyleForAnimated(HistoryScreenStyles.scrollViewContainer)}
            contentStyle={HistoryScreenStyles.content}
            showsVerticalScrollIndicator={false}
            style={resolveUnistyleForAnimated(HistoryScreenStyles.scrollView)}
            testID={HistoryScreenSelectors.Root}
            title={t`Statistics`}
        >
            <HistoryOverview difficulties={difficulties} historyByDifficulty={historyByDifficulty} />
        </CollapsibleChromePage>
    );
};
