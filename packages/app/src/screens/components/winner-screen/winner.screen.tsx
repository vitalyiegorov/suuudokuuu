import { useLingui } from '@lingui/react/macro';
import { Redirect } from 'expo-router';

import { CompletedGameResultDetails } from '../../../@generic/components/completed-game-result-details/completed-game-result-details';
import { GameResultPage } from '../../../@generic/components/game-result-page/game-result-page';
import { useCompletedGameResult } from '../../../@generic/hooks/use-completed-game-result.hook';
import { ChallengeRunSummary } from '../../../challenge/components/challenge-run-summary/challenge-run-summary';
import { getChallengeRecordingSummary } from '../../../challenge/utils/get-challenge-recording-summary.util';
import { isChallengeRecording } from '../../../challenge/utils/is-challenge-recording.util';
import { getTimelineCellSteps } from '../../../game/utils/get-timeline-cell-steps.util';

import { WinnerCalmResultHero } from './winner-calm-result-hero/winner-calm-result-hero';
import { WinnerResultHero } from './winner-result-hero/winner-result-hero';
import { WinnerScreenActions } from './winner-screen-actions/winner-screen-actions';
import { WinnerScreenSelectors } from './winner-screen.selectors';

export const WinnerScreen = () => {
    const { i18n, t } = useLingui();
    const completedGameResult = useCompletedGameResult();

    if (completedGameResult.kind === 'redirect') {
        return <Redirect href="/" />;
    }

    const { gameState, isCalmMode, retrySetup, timeText } = completedGameResult;
    const { hasNewPersonalBestScore, mistakes, score } = gameState;

    const scoreText = i18n.number(score);
    const isCleanWin = mistakes === 0;
    const winDescriptor = isCleanWin ? t`Clean win` : t`Completed`;
    const calmDescriptor = t`Solved`;
    const scoredDescriptorText = `${winDescriptor} • ${completedGameResult.difficultyText} • ${completedGameResult.mistakesTypeText}`;
    const calmDescriptorText = `${calmDescriptor} • ${completedGameResult.difficultyText}`;
    const moveCount = getTimelineCellSteps(gameState.timelineEvents).length;
    const footer = <WinnerScreenActions gameState={gameState} retrySetup={retrySetup} />;
    const recordingSummary = isChallengeRecording(gameState) ? (
        <ChallengeRunSummary
            label={t`Your recording`}
            summary={getChallengeRecordingSummary(gameState.timelineEvents, gameState.elapsedTime)}
            totalTime={gameState.elapsedTime}
        />
    ) : null;
    const resultHero = isCalmMode ? (
        <WinnerCalmResultHero descriptorText={calmDescriptorText} moveCount={moveCount} />
    ) : (
        <WinnerResultHero descriptorText={scoredDescriptorText} isPersonalBest={hasNewPersonalBestScore} scoreText={scoreText} />
    );

    return (
        <GameResultPage footer={footer} testID={WinnerScreenSelectors.Root}>
            {resultHero}

            {recordingSummary}

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
