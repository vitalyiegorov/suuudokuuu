import { useLingui } from '@lingui/react/macro';
import { Redirect, useRouter } from 'expo-router';
import { use } from 'react';
import { View } from 'react-native';

import { isNotEmptyString } from '@rnw-community/shared';

import { Alert } from '../../../@generic/components/alert/alert';
import { ChromeScrollPage } from '../../../@generic/components/chrome-scroll-page/chrome-scroll-page';
import { UkraineSupportCard } from '../../../@generic/components/ukraine-support-card/ukraine-support-card';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { getDifficultyMessage } from '../../../@generic/utils/get-difficulty-message.util';
import { getLevelRatingText } from '../../../@generic/utils/get-level-rating-text.util';
import { getMistakesTypeText } from '../../../@generic/utils/get-mistakes-type-text.util';
import { getSudokuProgress } from '../../../@generic/utils/get-sudoku-progress.util';
import { GameContext } from '../../../game/context/game.context';
import { useResumeGame } from '../../../game/hooks/use-resume-game.hook';
import { useShareGame } from '../../../game/hooks/use-share-game.hook';
import { useCurrentRun } from '../../../game/query/use-current-run.query';
import { useElapsedTime } from '../../../game/query/use-elapsed-time.query';
import { runCurrentRunCommand } from '../../../game/utils/run-current-run-command.util';
import { ThemeContext } from '../../../theme/context/theme.context';

import { PauseScreenActions } from './pause-screen-actions/pause-screen-actions';
import { PauseScreenHeader } from './pause-screen-header/pause-screen-header';
import { PauseScreenProgressCard } from './pause-screen-progress-card/pause-screen-progress-card';
import { PauseScreenStats } from './pause-screen-stats/pause-screen-stats';
import { PauseScreenSelectors } from './pause-screen.selectors';
import { PauseScreenStyles as styles } from './pause-screen.styles';

export const PauseScreen = () => {
    const router = useRouter();
    const { engine } = use(GameContext);
    const { theme } = use(ThemeContext);
    const { t } = useLingui();
    const { challengeState, difficulty, isRatingCeiling, maxMistakes, mistakes, rating, score } = useCurrentRun();
    const elapsedTime = useElapsedTime();

    const handleResume = useResumeGame();
    const handleShare = useShareGame();
    const handleConfirmedQuit = () => {
        void runCurrentRunCommand(currentRunService => currentRunService.reset);
        router.dismissTo('/');
    };
    const handleQuit = () => {
        Alert(t`Stop current run?`, t`All progress will be lost`, [
            { text: t`Cancel`, style: 'cancel' },
            { text: t`OK`, onPress: handleConfirmedQuit }
        ]);
    };

    const progress = getSudokuProgress(engine.Sudoku.toString());
    const difficultyText = t(getDifficultyMessage(difficulty));
    const levelRatingText = getLevelRatingText(difficultyText, rating, isRatingCeiling);
    const mistakesTypeText = t(getMistakesTypeText(maxMistakes));

    const { filledCells } = progress;
    const { totalCells } = progress;
    const detailsText = `${levelRatingText} • ${mistakesTypeText}`;
    const progressMeta = t`${filledCells}/${totalCells} filled`;
    const timeText = useTimerText(elapsedTime);
    const scoreText = String(score);
    const mistakesText = `${mistakes} / ${maxMistakes}`;
    const containerStyles = [styles.container, { backgroundColor: theme.colors.background }];

    if (isNotEmptyString(challengeState)) {
        return <Redirect href="/game" />;
    }
    const footer = <PauseScreenActions onQuit={handleQuit} onResume={handleResume} onShare={handleShare} />;

    return (
        <View style={containerStyles} testID={PauseScreenSelectors.Root}>
            <ChromeScrollPage footer={footer}>
                <View style={styles.content}>
                    <View style={styles.summaryColumn}>
                        <PauseScreenHeader detailsText={detailsText} testID={PauseScreenSelectors.DetailsValue} />

                        <PauseScreenProgressCard
                            label={t`Your progress`}
                            meta={progressMeta}
                            progressPercent={progress.percent}
                            sudoku={engine.Sudoku}
                        />

                        <PauseScreenStats mistakesText={mistakesText} scoreText={scoreText} timeText={timeText} />
                    </View>

                    <View style={styles.asideColumn}>
                        <UkraineSupportCard testID={PauseScreenSelectors.UkraineCta} />
                    </View>
                </View>
            </ChromeScrollPage>
        </View>
    );
};
