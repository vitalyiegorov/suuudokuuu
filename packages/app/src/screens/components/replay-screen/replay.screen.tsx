import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { Redirect } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { getCellKey } from '../../../@generic/utils/get-cell-key.util';
import { ReplayField } from '../../../game/components/replay-field/replay-field';
import { gameCompletedGameByIdSelector } from '../../../game/store/game.selectors';
import { createSudokuAtStep, getElapsedTimeAtStep } from '../../../game/utils/replay.util';
import { stringToGameState } from '../../../game/utils/string-to-game-state.util';

import { ReplayControls } from './components/replay-controls';
import { ReplayHeader } from './components/replay-header';
import { ReplayTopBar } from './components/replay-top-bar';
import { ReplayScreenStyles as styles } from './replay-screen.styles';

import type { GameState } from '../../../game/store/game.state';

interface Props {
    readonly difficulty: DifficultyEnum;
    readonly completedAt: number;
}

const createEmptySudokuResult = () => ({ sudoku: new Sudoku(defaultSudokuConfig), highlightedCellKey: '' });

const getSudokuAtStep = (gameState: GameState, currentStep: number) => {
    const newSudoku = createSudokuAtStep(gameState.sudokuString, gameState.solutionSteps, currentStep);
    let cellKey = '';

    if (currentStep > 0) {
        const currentStepData = gameState.solutionSteps[currentStep - 1];
        const x = currentStepData.cellIndex % defaultSudokuConfig.fieldSize;
        const y = Math.floor(currentStepData.cellIndex / defaultSudokuConfig.fieldSize);
        cellKey = getCellKey({ x, y, value: 0, group: 0 });
    }

    return { sudoku: newSudoku, highlightedCellKey: cellKey };
};

export const ReplayScreen = ({ difficulty, completedAt }: Props) => {
    const completedGame = useAppSelector(gameCompletedGameByIdSelector(difficulty, completedAt));
    const [currentStep, setCurrentStep] = useState(0);

    const gameState = useMemo(() => (completedGame ? stringToGameState(completedGame.encodedState) : null), [completedGame]);
    const { sudoku, highlightedCellKey } = useMemo(
        () => (gameState ? getSudokuAtStep(gameState, currentStep) : createEmptySudokuResult()),
        [gameState, currentStep]
    );
    const elapsedTime = useMemo(() => (gameState ? getElapsedTimeAtStep(gameState.solutionSteps, currentStep) : 0), [gameState, currentStep]);

    if (!completedGame || !gameState) {
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
