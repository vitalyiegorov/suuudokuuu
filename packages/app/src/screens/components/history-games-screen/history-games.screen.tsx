import { useLingui } from '@lingui/react/macro';
import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';

import { emptyFn, isDefined } from '@rnw-community/shared';

import { CollapsibleChromePage } from '../../../@generic/components/collapsible-chrome-page/collapsible-chrome-page';
import { getDifficultyMessage } from '../../../@generic/utils/get-difficulty-message.util';
import { HistoryGamesList } from '../../../history/components/history-games-list/history-games-list';
import { HistoryGamesSummaryBand } from '../../../history/components/history-games-summary-band/history-games-summary-band';
import { useCompletedGames } from '../../../history/query/use-completed-games.query';
import { useDifficultyStats } from '../../../history/query/use-difficulty-stats.query';

import { HistoryGamesScreenSelectors } from './history-games-screen.selectors';
import { HistoryGamesScreenStyles as styles } from './history-games-screen.styles';

import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly difficulty: DifficultyEnum;
}

export const HistoryGamesScreen = ({ difficulty }: Props) => {
    const { t } = useLingui();
    const completedGames = useCompletedGames().filter(game => game.difficulty === difficulty);
    const stats = useDifficultyStats().find(difficultyStats => difficultyStats.difficulty === difficulty);

    const title = `${t(getDifficultyMessage(difficulty))} ${t`Games`}`;
    const difficulties = [difficulty];

    return (
        <CollapsibleChromePage
            contentContainerStyle={resolveUnistyleForAnimated(styles.scrollViewContainer)}
            style={resolveUnistyleForAnimated(styles.scrollView)}
            testID={HistoryGamesScreenSelectors.Root}
            title={title}
        >
            {isDefined(stats) ? <HistoryGamesSummaryBand stats={stats} /> : null}

            <HistoryGamesList
                difficulties={difficulties}
                games={completedGames}
                onSelectDifficulty={emptyFn}
                selectedDifficulty={difficulty}
                showFilters={false}
            />
        </CollapsibleChromePage>
    );
};
