import { useAtomValue } from '@effect/atom-react/Hooks';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { useAppLayout } from '@suuudokuuu/ui';
import * as AsyncResult from 'effect/reactivity/AsyncResult';
import { Redirect } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { getChallengeAwayRanges } from '../../../challenge/utils/get-challenge-away-ranges.util';
import { useBoardGeometry } from '../../../game/hooks/use-board-geometry.hook';
import { getTimelineCellSteps } from '../../../game/utils/get-timeline-cell-steps.util';
import { stringToGameState } from '../../../game/utils/string-to-game-state.util';
import { ReplayActions } from '../../../history/components/replay-actions/replay-actions';
import { ReplayControls } from '../../../history/components/replay-controls/replay-controls';
import { ReplayStepCard } from '../../../history/components/replay-controls/replay-step-card/replay-step-card';
import { ReplayStepNavigation } from '../../../history/components/replay-controls/replay-step-navigation/replay-step-navigation';
import { ReplayField } from '../../../history/components/replay-field/replay-field';
import { ReplayHeader } from '../../../history/components/replay-header/replay-header';
import { completedGamesAtom } from '../../../history/query/use-completed-games.query';
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

    const completedGamesResult = useAtomValue(completedGamesAtom);
    const [currentStep, setCurrentStep] = useState(0);
    const { cellSize: boardCellSize, cellMargin: boardCellMargin, onBoardAreaLayout } = useBoardGeometry(0);
    const completedGame = AsyncResult.getOrElse(completedGamesResult, () => []).find(
        game => game.difficulty === difficulty && game.completedAt === completedAt
    );
    const gameState = stringToGameState(completedGame?.encodedState);

    if (AsyncResult.isInitial(completedGamesResult)) {
        return null;
    }

    if (!isDefined(completedGame) || !isNotEmptyString(gameState.sudokuString)) {
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
    const headerRow = (
        <View style={styles.headerRow}>
            <ReplayActions />
            <ReplayHeader game={completedGame} />
        </View>
    );
    const replayControls = (
        <ReplayControls>
            <ReplayStepCard
                awayRanges={awayRanges}
                currentStep={currentStep}
                elapsedTime={elapsedTime}
                moveClassification={moveClassification}
                onScrubStep={handleScrubStep}
                totalSteps={totalSteps}
            />
            <ReplayStepNavigation
                currentStep={currentStep}
                gameState={gameState}
                onNextStep={handleNextStep}
                onPrevStep={handlePrevStep}
                totalSteps={totalSteps}
            />
        </ReplayControls>
    );

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {isWideLayout ? null : headerRow}

                <View onLayout={onBoardAreaLayout} style={styles.fieldWrapper}>
                    <ReplayField
                        cellMargin={boardCellMargin}
                        cellSize={boardCellSize}
                        highlightedCellKey={highlightedCellKey}
                        sudoku={sudoku}
                    />
                </View>

                <View style={styles.controlsColumn}>
                    {isWideLayout ? headerRow : null}

                    {replayControls}
                </View>
            </View>
        </View>
    );
};
