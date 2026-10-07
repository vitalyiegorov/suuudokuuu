import { useLingui } from '@lingui/react/macro';
import { AppButton, resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { use } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenChromeScrollView } from '@rnw-community/react-native-screen-chrome';
import { isDefined, isPositiveNumber } from '@rnw-community/shared';

import { Alert } from '../../../@generic/components/alert/alert';
import { ChromePage } from '../../../@generic/components/chrome-page/chrome-page';
import { Header } from '../../../@generic/components/header/header';
import { TabBarInsetContext } from '../../../@generic/components/main-tab-layout/context/tab-bar-inset.context';
import { DailyBestStreak } from '../../../daily/components/daily-best-streak/daily-best-streak';
import { DailyNextPuzzleBar } from '../../../daily/components/daily-next-puzzle-bar/daily-next-puzzle-bar';
import { DailyRecentSolves } from '../../../daily/components/daily-recent-solves/daily-recent-solves';
import { DailyShareButton } from '../../../daily/components/daily-share-button/daily-share-button';
import { DailyStreakPill } from '../../../daily/components/daily-streak-pill/daily-streak-pill';
import { DailyTodayCardAction } from '../../../daily/components/daily-today-card-action/daily-today-card-action';
import { DailyTodayCard } from '../../../daily/components/daily-today-card/daily-today-card';
import { DailyTodayResult } from '../../../daily/components/daily-today-result/daily-today-result';
import { DailyTodaySummary } from '../../../daily/components/daily-today-summary/daily-today-summary';
import { DailyWeekCard } from '../../../daily/components/daily-week-card/daily-week-card';
import { useDailyChallenge } from '../../../daily/hooks/use-daily-challenge.hook';
import { useDailyResults } from '../../../daily/query/use-daily-results.query';
import { dailyGetCompletedDays } from '../../../daily/utils/daily-get-completed-days.util';
import { useResumeGame } from '../../../game/hooks/use-resume-game.hook';

import { DailyScreenSelectors } from './daily-screen.selectors';
import { DailyScreenStyles as styles } from './daily-screen.styles';

const DailyScreenBottomScrollPadding = 12;
const DailyScreenTopContentPadding = 12;
const DailyScreenTopOverlayIntensity = 0.12;

export const DailyScreen = () => {
    const { t } = useLingui();
    const safeAreaInsets = useSafeAreaInsets();
    const tabBarInset = use(TabBarInsetContext);
    const {
        bestStreak,
        completedDayNumbers,
        difficulty,
        isCreatingGame,
        isGameStarted,
        nowMs,
        startDaily,
        status,
        streak,
        todayDateString,
        todayDayNumber
    } = useDailyChallenge();
    const dailyResults = useDailyResults();
    const resumeGame = useResumeGame();

    const handleStart = () => {
        if (!isGameStarted) {
            startDaily();

            return;
        }

        Alert(t`Stop current run?`, t`All progress will be lost`, [
            { text: t`Cancel`, style: 'cancel' },
            { text: t`OK`, onPress: startDaily }
        ]);
    };

    const isCompleted = status === 'completed';
    const isInProgress = status === 'inProgress';
    const handleActionPress = isInProgress ? resumeGame : handleStart;
    const actionText = isInProgress ? t`Continue` : t`Play today`;
    const todayResult = dailyResults.find(dailyResult => dailyResult.dailyDayNumber === todayDayNumber);
    const recentDays = dailyGetCompletedDays(completedDayNumbers, todayDayNumber, dailyResults);
    const contentInsetBottom = DailyScreenBottomScrollPadding + tabBarInset;
    const topEdgeFadeProps = { height: safeAreaInsets.top + DailyScreenTopContentPadding, intensity: DailyScreenTopOverlayIntensity };
    const shareButton = isDefined(todayResult) ? <DailyShareButton encodedState={todayResult.encodedState} /> : null;
    const todayContent = isCompleted ? (
        <DailyTodayResult difficulty={difficulty} result={todayResult} />
    ) : (
        <DailyTodaySummary difficulty={difficulty} todayDateString={todayDateString} />
    );
    const action = isCompleted ? (
        <DailyNextPuzzleBar nowMs={nowMs} todayDayNumber={todayDayNumber}>
            {shareButton}
        </DailyNextPuzzleBar>
    ) : (
        <AppButton
            isLoading={isCreatingGame}
            onPress={handleActionPress}
            size="large"
            style={styles.actionButton}
            testID={DailyScreenSelectors.ActionButton}
            text={actionText}
            variant="primary"
        />
    );
    const bestStreakLine = isPositiveNumber(bestStreak) ? <DailyBestStreak bestStreak={bestStreak} /> : null;

    return (
        <ChromePage testID={DailyScreenSelectors.Root} topEdgeFadeProps={topEdgeFadeProps}>
            <ScreenChromeScrollView
                contentContainerStyle={resolveUnistyleForAnimated(styles.scrollContent)}
                contentInsetBottom={contentInsetBottom}
                contentInsetMode="additive"
                contentInsetTop={DailyScreenTopContentPadding}
                showsVerticalScrollIndicator={false}
                style={resolveUnistyleForAnimated(styles.scrollView)}
            >
                <View style={styles.titleRow}>
                    <Header maxFontSizeMultiplier={1.2} numberOfLines={2} style={styles.title} text={t`Daily challenge`} />

                    <DailyStreakPill isTodaySolved={isCompleted} streak={streak} />
                </View>

                <DailyTodayCard>
                    {todayContent}

                    <DailyTodayCardAction>{action}</DailyTodayCardAction>
                </DailyTodayCard>

                <DailyWeekCard completedDayNumbers={completedDayNumbers} todayDayNumber={todayDayNumber}>
                    {bestStreakLine}
                </DailyWeekCard>

                <DailyRecentSolves days={recentDays} />
            </ScreenChromeScrollView>
        </ChromePage>
    );
};
