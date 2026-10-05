import { useLingui } from '@lingui/react/macro';
import { AppButton, resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { use } from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenChromeScrollView } from '@rnw-community/react-native-screen-chrome';
import { isDefined } from '@rnw-community/shared';

import { Alert } from '../../../@generic/components/alert/alert';
import { ChromePage } from '../../../@generic/components/chrome-page/chrome-page';
import { Header } from '../../../@generic/components/header/header';
import { TabBarInsetContext } from '../../../@generic/components/main-tab-layout/context/tab-bar-inset.context';
import { StickyFooterBand } from '../../../@generic/components/sticky-footer-band/sticky-footer-band';
import { DailyNextPuzzleBar } from '../../../daily/components/daily-next-puzzle-bar/daily-next-puzzle-bar';
import { DailyRecentSolves } from '../../../daily/components/daily-recent-solves/daily-recent-solves';
import { DailyShareButton } from '../../../daily/components/daily-share-button/daily-share-button';
import { DailyStreakHero } from '../../../daily/components/daily-streak-hero/daily-streak-hero';
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
const DailyScreenActionBarBottomGap = 8;
const DailyScreenTopContentPadding = 12;
const DailyScreenTopOverlayIntensity = 0.12;
const topEdgeFadeProps = { height: DailyScreenTopContentPadding, intensity: DailyScreenTopOverlayIntensity };

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
    const contentInsetTop = DailyScreenTopContentPadding - (Platform.OS === 'ios' ? safeAreaInsets.top : 0);
    const actionBarStyles = [resolveUnistyleForAnimated(styles.actionBar), { paddingBottom: tabBarInset + DailyScreenActionBarBottomGap }];
    const shareButton = isDefined(todayResult) ? <DailyShareButton encodedState={todayResult.encodedState} /> : null;
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
    const actionBar = (
        <StickyFooterBand>
            <View style={actionBarStyles}>{action}</View>
        </StickyFooterBand>
    );

    return (
        <ChromePage footer={actionBar} testID={DailyScreenSelectors.Root} topEdgeFadeProps={topEdgeFadeProps}>
            <ScreenChromeScrollView
                contentContainerStyle={resolveUnistyleForAnimated(styles.scrollContent)}
                contentInsetBottom={contentInsetBottom}
                contentInsetMode="additive"
                contentInsetTop={contentInsetTop}
                showsVerticalScrollIndicator={false}
                style={resolveUnistyleForAnimated(styles.scrollView)}
            >
                <Header maxFontSizeMultiplier={1.2} numberOfLines={1} style={styles.title} text={t`Daily challenge`} />

                <DailyStreakHero bestStreak={bestStreak} isTodaySolved={isCompleted} streak={streak} />

                <DailyWeekCard completedDayNumbers={completedDayNumbers} todayDayNumber={todayDayNumber}>
                    {isCompleted ? (
                        <DailyTodayResult difficulty={difficulty} result={todayResult} />
                    ) : (
                        <DailyTodaySummary difficulty={difficulty} todayDateString={todayDateString} />
                    )}
                </DailyWeekCard>

                <DailyRecentSolves days={recentDays} />
            </ScreenChromeScrollView>
        </ChromePage>
    );
};
