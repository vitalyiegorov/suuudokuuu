import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { Redirect } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { getCellKey } from '../../../@generic/utils/get-cell-key.util';
import { gameCompletedGameByIdSelector } from '../../../game/store/game.selectors';
import { stringToGameState } from '../../../game/utils/string-to-game-state.util';
import { ReplayControls } from '../../../history/components/replay-controls/replay-controls';
import { ReplayField } from '../../../history/components/replay-field/replay-field';
import { ReplayHeader } from '../../../history/components/replay-header/replay-header';
import { ReplayTopBar } from '../../../history/components/replay-top-bar/replay-top-bar';

import { ReplayScreenStyles as styles } from './replay-screen.styles';

import type { GameState } from '../../../game/store/game.state';

interface Props {
    readonly difficulty: DifficultyEnum;
    readonly completedAt: number;
}

const getSudokuAtStep = (gameState: GameState, currentStep: number) => {
    const sudoku = Sudoku.fromString(gameState.sudokuString, defaultSudokuConfig);

    const steps = gameState.solutionSteps;
    let elapsedTime = 0;
    let highlightedCellKey = '';

    for (let i = 0; i < currentStep && i < steps.length; i += 1) {
        const x = steps[i].cellIndex % defaultSudokuConfig.fieldSize;
        const y = Math.floor(steps[i].cellIndex / defaultSudokuConfig.fieldSize);

        sudoku.Field[y][x] = { ...sudoku.Field[y][x], value: steps[i].value };
        elapsedTime += steps[i].ts;
        highlightedCellKey = getCellKey({ x, y });
    }

    return { sudoku, highlightedCellKey, elapsedTime };
};

export const ReplayScreen = ({ difficulty, completedAt }: Props) => {
    const completedGame = useAppSelector(gameCompletedGameByIdSelector(difficulty, completedAt));
    const [currentStep, setCurrentStep] = useState(0);

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
        if (currentStep < gameState.solutionSteps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const { sudoku, highlightedCellKey, elapsedTime } = getSudokuAtStep(gameState, currentStep);

    return (
        <View style={styles.container}>
            <ReplayTopBar />
            <ReplayHeader game={completedGame} />
            <View style={styles.fieldWrapper}>
                <ReplayField highlightedCellKey={highlightedCellKey} sudoku={sudoku} />
            </View>
            <ReplayControls
                currentStep={currentStep}
                elapsedTime={elapsedTime}
                onNextStep={handleNextStep}
                onPrevStep={handlePrevStep}
                totalSteps={gameState.solutionSteps.length}
            />
        </View>
    );
};
