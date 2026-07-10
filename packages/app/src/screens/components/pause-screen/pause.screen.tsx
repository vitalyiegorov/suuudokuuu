import { useLingui } from '@lingui/react/macro';
import { useAppLayout } from '@suuudokuuu/ui';
import { useRouter } from 'expo-router';
import { use } from 'react';
import { View } from 'react-native';

import { Alert } from '../../../@generic/components/alert/alert';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { getDifficultyText } from '../../../@generic/utils/get-difficulty-text.util';
import { getMistakesTypeText } from '../../../@generic/utils/get-mistakes-type-text.util';
import { GameContext } from '../../../game/context/game.context';
import { useResumeGame } from '../../../game/hooks/use-resume-game.hook';
import { useSharePuzzle } from '../../../game/hooks/use-share-puzzle/use-share-puzzle.hook';
import { gameResetAction } from '../../../game/store/game.actions';
import {
    gameElapsedTimeSelector,
    gameMaxMistakesSelector,
    gameMistakesSelector,
    gameScoreSelector
} from '../../../game/store/game.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { gameScreenExit } from '../game-screen/utils/game-screen-exit.util';

import { PauseScreenActions } from './pause-screen-actions/pause-screen-actions';
import { PauseScreenHeader } from './pause-screen-header/pause-screen-header';
import { PauseScreenProgressCard } from './pause-screen-progress-card/pause-screen-progress-card';
import { PauseScreenStats } from './pause-screen-stats/pause-screen-stats';
import { PauseScreenUkraineCard } from './pause-screen-ukraine-card/pause-screen-ukraine-card';
import { PauseScreenSelectors } from './pause-screen.selectors';
import { PauseScreenStyles as styles } from './pause-screen.styles';
import { pauseScreenGetProgress } from './utils/pause-screen-get-progress.util';

export const PauseScreen = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { sudoku } = use(GameContext);
    const { theme } = use(ThemeContext);
    const { t } = useLingui();
    const { sizeClass } = useAppLayout();
    const score = useAppSelector(gameScoreSelector);
    const mistakes = useAppSelector(gameMistakesSelector);
    const maxMistakes = useAppSelector(gameMaxMistakesSelector);
    const elapsedTime = useAppSelector(gameElapsedTimeSelector);

    const handleResume = useResumeGame();
    const handleShare = useSharePuzzle();
    const handleConfirmedQuit = () =>
        void gameScreenExit(
            () => dispatch(gameResetAction()),
            homeHref => void router.dismissTo(homeHref)
        );
    const handleQuit = () => {
        Alert(t`Stop current run?`, t`All progress will be lost`, [
            { text: t`Cancel`, style: 'cancel' },
            { text: t`OK`, onPress: handleConfirmedQuit }
        ]);
    };

    const progress = pauseScreenGetProgress(sudoku);
    const difficultyText = getDifficultyText(sudoku.Difficulty);
    const mistakesTypeText = getMistakesTypeText(maxMistakes);

    const { filledCells } = progress;
    const { totalCells } = progress;
    const detailsText = `${difficultyText} • ${mistakesTypeText}`;
    const progressMeta = t`${filledCells}/${totalCells} filled`;
    const timeText = useTimerText(elapsedTime);
    const scoreText = String(score);
    const mistakesText = `${mistakes} / ${maxMistakes}`;
    const containerStyles = [styles.container(sizeClass), { backgroundColor: theme.colors.background }];

    return (
        <View style={containerStyles} testID={PauseScreenSelectors.Root}>
            <View style={styles.summaryColumn}>
                <PauseScreenHeader detailsText={detailsText} />

                <PauseScreenProgressCard label={t`Your progress`} meta={progressMeta} progressPercent={progress.percent} sudoku={sudoku} />

                <PauseScreenStats mistakesText={mistakesText} scoreText={scoreText} timeText={timeText} />
            </View>

            <View style={styles.actionsColumn}>
                <PauseScreenUkraineCard />

                <PauseScreenActions onQuit={handleQuit} onResume={handleResume} onShare={handleShare} />
            </View>
        </View>
    );
};
