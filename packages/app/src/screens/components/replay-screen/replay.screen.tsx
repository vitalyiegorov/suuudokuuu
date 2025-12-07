import { useLingui } from '@lingui/react/macro';
import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { Redirect } from 'expo-router';
import { LucideChevronLeft, LucideChevronRight } from 'lucide-react-native';
import { use, useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { BlackText } from '../../../@generic/components/black-text/black-text';
import { Header } from '../../../@generic/components/header/header';
import { ReturnButton } from '../../../@generic/components/return-button/return-button';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { getCellKey } from '../../../@generic/utils/get-cell-key.util';
import { getDifficultyText } from '../../../@generic/utils/get-difficulty-text.util';
import { getTimerText } from '../../../@generic/utils/get-timer-text.util';
import { ReplayField } from '../../../game/components/replay-field/replay-field';
import { gameCompletedGameByIdSelector } from '../../../game/store/game.selectors';
import { createSudokuAtStep, getElapsedTimeAtStep } from '../../../game/utils/replay.util';
import { stringToGameState } from '../../../game/utils/string-to-game-state.util';
import { ThemeContext } from '../../../theme/context/theme.context';

import { ReplayScreenStyles as styles } from './replay-screen.styles';

import type { GameState } from '../../../game/store/game.state';
import type { CompletedGameInterface } from '../../../history/interfaces/completed-game.interface';

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

const renderReplayInfo = (completedGame: CompletedGameInterface, t: ReturnType<typeof useLingui>['t']) => (
    <View style={styles.infoContainer}>
        <BlackText>
            {getDifficultyText(completedGame.difficulty)} - {completedGame.isWon ? t`Won` : t`Lost`}
        </BlackText>
        <View style={styles.statsRow}>
            <BlackText>
                {t`Score`}: <Text style={styles.boldText}>{completedGame.score}</Text>
            </BlackText>
            <BlackText>
                {t`Mistakes`}: <Text style={styles.boldText}>{completedGame.mistakes}/{completedGame.maxMistakes}</Text>
            </BlackText>
        </View>
    </View>
);

const getNavigationState = (currentStep: number, totalSteps: number) => ({
    canGoBack: currentStep > 0,
    canGoForward: currentStep < totalSteps
});

const getButtonColors = (canGoBack: boolean, canGoForward: boolean, activeColor: string, disabledColor: string) => ({
    prevButtonColor: canGoBack ? activeColor : disabledColor,
    nextButtonColor: canGoForward ? activeColor : disabledColor
});

export const ReplayScreen = ({ difficulty, completedAt }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

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

    const { canGoBack, canGoForward } = getNavigationState(currentStep, gameState.solutionSteps.length);
    const { prevButtonColor, nextButtonColor } = getButtonColors(canGoBack, canGoForward, theme.colors.label.inverted, theme.colors.label.hint);
    const handlePrevStep = () => {
        if (canGoBack) {
            setCurrentStep(currentStep - 1);
        }
    };
    const handleNextStep = () => {
        if (canGoForward) {
            setCurrentStep(currentStep + 1);
        }
    };

    return (
        <View style={styles.container}>
            <Header text={t`Replay`} />
            {renderReplayInfo(completedGame, t)}
            <View style={styles.fieldWrapper}>
                <ReplayField highlightedCellKey={highlightedCellKey} sudoku={sudoku} />
            </View>
            <View style={styles.infoContainer}>
                <BlackText>
                    {t`Time`}: <Text style={styles.boldText}>{getTimerText(elapsedTime)}</Text>
                </BlackText>
            </View>
            <View style={styles.controlsContainer}>
                <BlackButton disabled={!canGoBack} onPress={handlePrevStep}>
                    <LucideChevronLeft color={prevButtonColor} size={24} />
                </BlackButton>
                <BlackText style={styles.stepCounter}>
                    <Text style={styles.boldText}>{currentStep}</Text> / {gameState.solutionSteps.length}
                </BlackText>
                <BlackButton disabled={!canGoForward} onPress={handleNextStep}>
                    <LucideChevronRight color={nextButtonColor} size={24} />
                </BlackButton>
            </View>
            <ReturnButton />
        </View>
    );
};
