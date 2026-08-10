import { DifficultyEnum } from '@suuudokuuu/generator';
import { useAppLayout } from '@suuudokuuu/ui';
import { Redirect } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { getChallengeAwayRanges } from '../../../challenge/utils/get-challenge-away-ranges.util';
import { useBoardGeometry } from '../../../game/hooks/use-board-geometry.hook';
import { gameCompletedGameByIdSelector } from '../../../game/store/game.selectors';
import { getTimelineCellSteps } from '../../../game/utils/get-timeline-cell-steps.util';
import { stringToGameState } from '../../../game/utils/string-to-game-state.util';
import { ReplayActions } from '../../../history/components/replay-actions/replay-actions';
import { ReplayControls } from '../../../history/components/replay-controls/replay-controls';
import { ReplayField } from '../../../history/components/replay-field/replay-field';
import { ReplayHeader } from '../../../history/components/replay-header/replay-header';
import { ReplayRunReview } from '../../../history/components/replay-run-review/replay-run-review';
import { ReplayShareAction } from '../../../history/components/replay-share-action/replay-share-action';
import { getReplayHardestStep } from '../../../history/utils/get-replay-hardest-step.util';
import { getReplayPaceStats } from '../../../history/utils/get-replay-pace-stats.util';
import { getReplayRunTechniqueEvents } from '../../../history/utils/get-replay-run-technique-events.util';
import { getReplayTechniqueUsageCounts } from '../../../history/utils/get-replay-technique-usage-counts.util';
import { getReplayTimeline } from '../../../history/utils/get-replay-timeline.util';
import { getSudokuAtStep } from '../../../history/utils/get-sudoku-at-step.util';

import { ReplayScreenStyles as styles } from './replay-screen.styles';

interface Props {
    readonly difficulty: DifficultyEnum;
    readonly completedAt: number;
}

export const ReplayScreen = ({ difficulty, completedAt }: Props) => {
    const { sizeClass } = useAppLayout();
    const isWideLayout = sizeClass === 'wide';

    const completedGame = useAppSelector(gameCompletedGameByIdSelector(difficulty, completedAt));
    const [currentStep, setCurrentStep] = useState(0);
    const [gameState] = useState(() => stringToGameState(completedGame?.encodedState));
    const [runReview] = useState(() => {
        const techniqueEvents = getReplayRunTechniqueEvents(gameState);

        return {
            techniqueEvents,
            techniqueUsageCounts: getReplayTechniqueUsageCounts(techniqueEvents),
            hardestStep: getReplayHardestStep(techniqueEvents),
            paceStats: isDefined(completedGame) ? getReplayPaceStats(gameState, completedGame) : null
        };
    });
    const { cellSize: boardCellSize, onBoardAreaLayout } = useBoardGeometry(0);

    if (!isDefined(gameState) || !isDefined(completedGame) || !isDefined(runReview.paceStats)) {
        return <Redirect href="/history" />;
    }

    const replayTimeline = getReplayTimeline(gameState);
    const totalSteps = getTimelineCellSteps(replayTimeline.events).length;

    const handlePrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    const handleNextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };
    const handleScrubStep = (step: number) => {
        setCurrentStep(Math.min(Math.max(step, 0), totalSteps));
    };

    const { sudoku, highlightedCellKey, elapsedTime, moveClassification } = getSudokuAtStep(gameState, currentStep);
    const awayRanges = getChallengeAwayRanges(replayTimeline.events, completedGame.elapsedTime);
    const replayHeader = <ReplayHeader game={completedGame} />;
    const replayControls = (
        <ReplayControls
            awayRanges={awayRanges}
            currentStep={currentStep}
            elapsedTime={elapsedTime}
            hardestStep={runReview.hardestStep}
            moveClassification={moveClassification}
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
            onScrubStep={handleScrubStep}
            techniqueEvents={runReview.techniqueEvents}
            totalSteps={totalSteps}
        />
    );

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {isWideLayout ? null : (
                    <View style={styles.topBar}>
                        {replayHeader}
                        <ReplayActions />
                    </View>
                )}

                <View onLayout={onBoardAreaLayout} style={styles.fieldWrapper}>
                    <ReplayField cellSize={boardCellSize} highlightedCellKey={highlightedCellKey} sudoku={sudoku} />
                </View>

                <View style={styles.controlsColumn}>
                    {isWideLayout ? replayHeader : null}

                    {replayControls}

                    <ReplayShareAction gameState={gameState} />

                    <ScrollView showsVerticalScrollIndicator={false} style={styles.reviewScroll}>
                        <ReplayRunReview paceStats={runReview.paceStats} techniqueUsageCounts={runReview.techniqueUsageCounts} />
                    </ScrollView>

                    {isWideLayout ? <ReplayActions /> : null}
                </View>
            </View>
        </View>
    );
};
