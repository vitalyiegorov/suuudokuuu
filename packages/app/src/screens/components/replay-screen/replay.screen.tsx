import { DifficultyEnum } from '@suuudokuuu/generator';
import { useAppLayout } from '@suuudokuuu/ui';
import { Redirect } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { useBoardCellSize } from '../../../game/hooks/use-board-cell-size.hook';
import { gameCompletedGameByIdSelector } from '../../../game/store/game.selectors';
import { stringToGameState } from '../../../game/utils/string-to-game-state.util';
import { ReplayControls } from '../../../history/components/replay-controls/replay-controls';
import { ReplayField } from '../../../history/components/replay-field/replay-field';
import { ReplayHeader } from '../../../history/components/replay-header/replay-header';
import { ReplayTopBar } from '../../../history/components/replay-top-bar/replay-top-bar';
import { getSudokuAtStep } from '../../../history/utils/get-sudoku-at-step.util';

import { ReplayScreenStyles as styles } from './replay-screen.styles';

interface Props {
    readonly difficulty: DifficultyEnum;
    readonly completedAt: number;
}

export const ReplayScreen = ({ difficulty, completedAt }: Props) => {
    const completedGame = useAppSelector(gameCompletedGameByIdSelector(difficulty, completedAt));
    const [currentStep, setCurrentStep] = useState(0);
    const { width, height } = useAppLayout();
    const boardCellSize = useBoardCellSize(width, height);

    const gameState = stringToGameState(completedGame?.encodedState);
    if (!isDefined(gameState) || !isDefined(completedGame)) {
        return <Redirect href="/history" />;
    }

    const handlePrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    const handleNextStep = () => {
        if (currentStep < gameState.challengeSteps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const { sudoku, highlightedCellKey, elapsedTime } = getSudokuAtStep(gameState, currentStep);

    return (
        <View style={styles.container}>
            <ReplayTopBar />
            <ReplayHeader game={completedGame} />
            <View style={styles.fieldWrapper}>
                <ReplayField cellSize={boardCellSize} highlightedCellKey={highlightedCellKey} sudoku={sudoku} />
            </View>
            <ReplayControls
                currentStep={currentStep}
                elapsedTime={elapsedTime}
                onNextStep={handleNextStep}
                onPrevStep={handlePrevStep}
                totalSteps={gameState.challengeSteps.length}
            />
        </View>
    );
};
