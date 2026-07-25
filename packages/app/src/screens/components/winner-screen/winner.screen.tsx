import { useLingui } from '@lingui/react/macro';
import { Redirect } from 'expo-router';

import { CompletedGameResultDetails } from '../../../@generic/components/completed-game-result-details/completed-game-result-details';
import { GameResultPage } from '../../../@generic/components/game-result-page/game-result-page';
import { useCompletedGameResult } from '../../../@generic/hooks/use-completed-game-result.hook';

import { WinnerResultHero } from './winner-result-hero/winner-result-hero';
import { WinnerScreenActions } from './winner-screen-actions/winner-screen-actions';
import { WinnerScreenSelectors } from './winner-screen.selectors';

export const WinnerScreen = () => {
    const { i18n, t } = useLingui();
    const completedGameResult = useCompletedGameResult();

    if (completedGameResult.kind === 'redirect') {
        return <Redirect href="/" />;
    }

    const { gameState, sudoku, timeText } = completedGameResult;
    const { hasNewPersonalBestScore, mistakes, score } = gameState;

    const scoreText = i18n.number(score);
    const isCleanWin = mistakes === 0;
    const winDescriptor = isCleanWin ? t`Clean win` : t`Completed`;
    const descriptorText = `${winDescriptor} • ${completedGameResult.difficultyText} • ${completedGameResult.mistakesTypeText}`;
    const footer = <WinnerScreenActions difficulty={sudoku.Difficulty} gameState={gameState} />;

    return (
        <GameResultPage footer={footer} testID={WinnerScreenSelectors.Root}>
            <WinnerResultHero descriptorText={descriptorText} isPersonalBest={hasNewPersonalBestScore} scoreText={scoreText} />

            <CompletedGameResultDetails
                resultContext="winner"
                mistakes={mistakes}
                mistakesTestID={WinnerScreenSelectors.MistakesValue}
                timeTestID={WinnerScreenSelectors.TimeValue}
                timeText={timeText}
                ukraineSupportTestID={WinnerScreenSelectors.UkraineSupportCta}
            />
        </GameResultPage>
    );
};
