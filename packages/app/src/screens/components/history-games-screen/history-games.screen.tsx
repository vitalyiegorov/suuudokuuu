import { useLingui } from '@lingui/react/macro';
import { resolveUnistyleForAnimated, useAppLayout } from '@suuudokuuu/ui';

import { emptyFn } from '@rnw-community/shared';

import { CollapsibleChromePage } from '../../../@generic/components/collapsible-chrome-page/collapsible-chrome-page';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { getDifficultyText } from '../../../@generic/utils/get-difficulty-text.util';
import { gameCompletedGamesSelector } from '../../../game/store/game.selectors';
import { HistoryGamesList } from '../../../history/components/history-games-list/history-games-list';

import { HistoryGamesScreenStyles as styles } from './history-games-screen.styles';

import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly difficulty: DifficultyEnum;
}

export const HistoryGamesScreen = ({ difficulty }: Props) => {
    const { t } = useLingui();
    const { sizeClass } = useAppLayout();
    const completedGames = useAppSelector(gameCompletedGamesSelector(difficulty));

    const title = `${getDifficultyText(difficulty)} ${t`Games`}`;
    const difficulties = [difficulty];

    return (
        <CollapsibleChromePage
            contentContainerStyle={resolveUnistyleForAnimated(styles.scrollViewContainer)}
            contentStyle={styles.content}
            showsVerticalScrollIndicator={false}
            style={resolveUnistyleForAnimated(styles.scrollView(sizeClass))}
            title={title}
        >
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
