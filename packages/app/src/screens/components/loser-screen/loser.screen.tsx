import { useLingui } from '@lingui/react/macro';
import { Redirect } from 'expo-router';

import { CompletedGameResultDetails } from '../../../@generic/components/completed-game-result-details/completed-game-result-details';
import { GameResultPage } from '../../../@generic/components/game-result-page/game-result-page';
import { useCompletedGameResult } from '../../../@generic/hooks/use-completed-game-result.hook';
import { pauseScreenGetProgress } from '../pause-screen/utils/pause-screen-get-progress.util';

import { LoserScreenActions } from './loser-screen-actions/loser-screen-actions';
import { LoserScreenResultHero } from './loser-screen-result-hero/loser-screen-result-hero';
import { LoserScreenSelectors } from './loser-screen.selectors';

export const LoserScreen = () => {
    const { t } = useLingui();
    const completedGameResult = useCompletedGameResult();

    if (completedGameResult.kind === 'redirect') {
        return <Redirect href="/" />;
    }

    const { gameState, retrySetup, sudoku, timeText } = completedGameResult;
    const { isRatingCeiling, mistakes, rating } = gameState;

    const progress = pauseScreenGetProgress(sudoku);
    const detailsText = `${t`Incomplete`} • ${completedGameResult.difficultyText} • ${completedGameResult.mistakesTypeText}`;
    const footer = <LoserScreenActions retrySetup={retrySetup} />;

    return (
        <GameResultPage footer={footer} testID={LoserScreenSelectors.Root}>
            <LoserScreenResultHero
                detailsText={detailsText}
                isRatingCeiling={isRatingCeiling}
                progressPercent={progress.percent}
                rating={rating}
            />

            <CompletedGameResultDetails
                resultContext="loser"
                mistakes={mistakes}
                mistakesTestID={LoserScreenSelectors.MistakesValue}
                timeTestID={LoserScreenSelectors.TimeValue}
                timeText={timeText}
                ukraineSupportTestID={LoserScreenSelectors.UkraineCta}
            />
        </GameResultPage>
    );
};
