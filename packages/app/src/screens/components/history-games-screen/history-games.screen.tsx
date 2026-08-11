import { useLingui } from '@lingui/react/macro';
import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';

import { emptyFn } from '@rnw-community/shared';

import { CollapsibleChromePage } from '../../../@generic/components/collapsible-chrome-page/collapsible-chrome-page';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { getDifficultyText } from '../../../@generic/utils/get-difficulty-text.util';
import { gameCompletedGamesSelector } from '../../../game/store/game.selectors';
import { HistoryGamesList } from '../../../history/components/history-games-list/history-games-list';
import { HistoryGamesSummaryBand } from '../../../history/components/history-games-summary-band/history-games-summary-band';

import { HistoryGamesScreenSelectors } from './history-games-screen.selectors';
import { HistoryGamesScreenStyles as styles } from './history-games-screen.styles';

import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly difficulty: DifficultyEnum;
}

export const HistoryGamesScreen = ({ difficulty }: Props) => {
    const { t } = useLingui();
    const completedGames = useAppSelector(gameCompletedGamesSelector(difficulty));

    const title = `${getDifficultyText(difficulty)} ${t`Games`}`;
    const difficulties = [difficulty];

    return (
        <CollapsibleChromePage
            contentContainerStyle={resolveUnistyleForAnimated(styles.scrollViewContainer)}
            contentStyle={styles.content}
            showsVerticalScrollIndicator={false}
            style={resolveUnistyleForAnimated(styles.scrollView)}
            testID={HistoryGamesScreenSelectors.Root}
            title={title}
        >
            <HistoryGamesSummaryBand difficulty={difficulty} />

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
