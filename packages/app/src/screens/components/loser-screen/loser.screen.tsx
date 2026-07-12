import { useLingui } from '@lingui/react/macro';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { Redirect } from 'expo-router';
import { use } from 'react';
import { ScrollView, View } from 'react-native';

import { useResetGame } from '../../../@generic/hooks/use-reset-game.hook';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { getDifficultyText } from '../../../@generic/utils/get-difficulty-text.util';
import { getMistakesTypeText } from '../../../@generic/utils/get-mistakes-type-text.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { pauseScreenGetProgress } from '../pause-screen/utils/pause-screen-get-progress.util';

import { LoserScreenActions } from './loser-screen-actions/loser-screen-actions';
import { LoserScreenMetrics } from './loser-screen-metrics/loser-screen-metrics';
import { LoserScreenResultHero } from './loser-screen-result-hero/loser-screen-result-hero';
import { LoserScreenUkraineCard } from './loser-screen-ukraine-card/loser-screen-ukraine-card';
import { LoserScreenSelectors } from './loser-screen.selectors';
import { LoserScreenStyles } from './loser-screen.styles';

export const LoserScreen = () => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const [isGameStarted, gameState] = useResetGame();
    const { elapsedTime, maxMistakes, mistakes, sudokuString } = gameState;
    const timeText = useTimerText(elapsedTime);

    if (!isGameStarted && elapsedTime === 0) {
        return <Redirect href="/" />;
    }

    let sudoku: Sudoku;
    try {
        sudoku = Sudoku.fromString(sudokuString, defaultSudokuConfig);
    } catch {
        return <Redirect href="/" />;
    }

    const progress = pauseScreenGetProgress(sudoku);
    const difficultyText = getDifficultyText(sudoku.Difficulty);
    const mistakesTypeText = getMistakesTypeText(maxMistakes);
    const detailsText = `${t`Loooooser =)`} • ${difficultyText} • ${mistakesTypeText}`;
    const containerStyles = [LoserScreenStyles.container, { backgroundColor: theme.colors.background }];
    const contentContainerStyles = [LoserScreenStyles.contentContainer, { backgroundColor: theme.colors.background }];

    return (
        <ScrollView
            alwaysBounceVertical
            contentContainerStyle={contentContainerStyles}
            contentInsetAdjustmentBehavior="automatic"
            style={containerStyles}
            testID={LoserScreenSelectors.Root}
        >
            <View style={LoserScreenStyles.content}>
                <LoserScreenResultHero detailsText={detailsText} progressPercent={progress.percent} />

                <LoserScreenMetrics mistakesText={String(mistakes)} timeText={timeText} />

                <LoserScreenUkraineCard />

                <LoserScreenActions />
            </View>
        </ScrollView>
    );
};
