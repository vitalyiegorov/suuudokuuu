import { useLingui } from '@lingui/react/macro';
import { AppButton, resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { use } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenChromeScrollView } from '@rnw-community/react-native-screen-chrome';

import { Alert } from '../../../@generic/components/alert/alert';
import { ChromePage } from '../../../@generic/components/chrome-page/chrome-page';
import { Header } from '../../../@generic/components/header/header';
import { TabBarInsetContext } from '../../../@generic/components/main-tab-layout/context/tab-bar-inset.context';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { DailyHistoryList } from '../../../daily/components/daily-history-list/daily-history-list';
import { DailyStreakHero } from '../../../daily/components/daily-streak-hero/daily-streak-hero';
import { useDailyChallenge } from '../../../daily/hooks/use-daily-challenge.hook';
import { useResumeGame } from '../../../game/hooks/use-resume-game.hook';
import { gameDailyCompletedDayNumbersSelector } from '../../../game/store/game.selectors';

import { DailyScreenSelectors } from './daily-screen.selectors';
import { DailyScreenStyles as styles } from './daily-screen.styles';

import type { DailyStatusType } from '../../../daily/types/daily-status.type';

const DailyScreenBottomScrollPadding = 12;
const DailyScreenActionBarBottomGap = 8;
const DailyScreenTopOverlayHeight = 80;
const DailyScreenTopOverlayIntensity = 0.12;
const topEdgeFadeProps = { height: DailyScreenTopOverlayHeight, intensity: DailyScreenTopOverlayIntensity };

export const DailyScreen = () => {
    const { t } = useLingui();
    const safeAreaInsets = useSafeAreaInsets();
    const tabBarInset = use(TabBarInsetContext);
    const { bestStreak, difficulty, isCreatingGame, isGameStarted, startDaily, status, streak, todayDateString } = useDailyChallenge();
    const completedDayNumbers = useAppSelector(gameDailyCompletedDayNumbersSelector);
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

    const handlePress = status === 'inProgress' ? resumeGame : handleStart;
    const isCompleted = status === 'completed';
    const actionTextByStatus: Record<DailyStatusType, string> = {
        available: t`Play today`,
        completed: t`Solved today`,
        inProgress: t`Continue`
    };
    const actionText = actionTextByStatus[status];
    const contentInsetBottom = DailyScreenBottomScrollPadding + tabBarInset;
    const actionBarStyles = [resolveUnistyleForAnimated(styles.actionBar), { paddingBottom: tabBarInset + DailyScreenActionBarBottomGap }];
    const actionBar = (
        <View style={actionBarStyles}>
            <AppButton
                disabled={isCompleted}
                isLoading={isCreatingGame}
                onPress={handlePress}
                size="large"
                style={styles.actionButton}
                testID={DailyScreenSelectors.ActionButton}
                text={actionText}
                variant="primary"
            />
        </View>
    );

    return (
        <ChromePage footer={actionBar} testID={DailyScreenSelectors.Root} topEdgeFadeProps={topEdgeFadeProps}>
            <ScreenChromeScrollView
                contentInsetMode="additive"
                contentContainerStyle={styles.scrollContent}
                contentInsetBottom={contentInsetBottom}
                contentInsetTop={safeAreaInsets.top}
                showsVerticalScrollIndicator={false}
                style={resolveUnistyleForAnimated(styles.scrollView)}
            >
                <Header maxFontSizeMultiplier={1.2} numberOfLines={1} style={styles.title} text={t`Daily challenge`} />

                <DailyStreakHero
                    bestStreak={bestStreak}
                    difficulty={difficulty}
                    status={status}
                    streak={streak}
                    todayDateString={todayDateString}
                />

                <DailyHistoryList completedDayNumbers={completedDayNumbers} />
            </ScreenChromeScrollView>
        </ChromePage>
    );
};
