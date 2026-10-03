import { Trans, useLingui } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { SettingsRepository } from '@suuudokuuu/progress';
import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import * as Effect from 'effect/Effect';
import { Link } from 'expo-router';
import { use } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenChromeScrollView } from '@rnw-community/react-native-screen-chrome';
import { isNotEmptyString } from '@rnw-community/shared';

import { Alert } from '../../../@generic/components/alert/alert';
import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ChromePage } from '../../../@generic/components/chrome-page/chrome-page';
import { Header } from '../../../@generic/components/header/header';
import { TabBarInsetContext } from '../../../@generic/components/main-tab-layout/context/tab-bar-inset.context';
import { SupportUkrainePill } from '../../../@generic/components/support-ukraine-pill/support-ukraine-pill';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { appRuntime } from '../../../@generic/runtime/app.runtime';
import { getBrand } from '../../../@generic/utils/get-brand.util';
import { getDifficultyMessage } from '../../../@generic/utils/get-difficulty-message.util';
import { ChallengeModeSwitch } from '../../../challenge/components/challenge-mode-switch/challenge-mode-switch';
import {
    DifficultyComplexitySliderDifficulties,
    DifficultyComplexitySliderInitialIndex
} from '../../../game/components/difficulty-complexity-slider/constant/difficulty-complexity-slider.constant';
import { DifficultyComplexityPreview } from '../../../game/components/difficulty-complexity-slider/difficulty-complexity-preview/difficulty-complexity-preview';
import { DifficultyComplexitySlider } from '../../../game/components/difficulty-complexity-slider/difficulty-complexity-slider';
import { GameContext } from '../../../game/context/game.context';
import { useCurrentRun } from '../../../game/query/use-current-run.query';
import { useElapsedTime } from '../../../game/query/use-elapsed-time.query';
import { getTimelineCellSteps } from '../../../game/utils/get-timeline-cell-steps.util';
import { useDifficultyStats } from '../../../history/query/use-difficulty-stats.query';
import { RelaxedMaxMistakesConstant } from '../../../settings/constant/max-mistakes.constant';
import { useSettings } from '../../../settings/query/use-settings.query';
import { ThemeContext } from '../../../theme/context/theme.context';

import { HomeScreenBottomScrollPadding, HomeScreenTopOverlayHeight, HomeScreenTopOverlayIntensity } from './constant/home-screen.constant';
import { HomeScreenOptionCard } from './home-screen-option-card/home-screen-option-card';
import { homeScreenOptionCardGetColors } from './home-screen-option-card/utils/home-screen-option-card-get-colors.util';
import { HomeScreenPlayActions } from './home-screen-play-actions/home-screen-play-actions';
import { HomeScreenSectionHeader } from './home-screen-section-header/home-screen-section-header';
import { HomeScreenSelectors } from './home-screen.selectors';
import { HomeScreenStyles as styles } from './home-screen.styles';
import { type HomeScreenOptionCardInterface } from './interface/home-screen-option-card.interface';
import { homeScreenGetContentInsetTop } from './utils/home-screen-get-content-inset-top.util';
import { homeScreenGetCurrentGameProgress } from './utils/home-screen-get-current-game-progress.util';
import { homeScreenGetDifficultyDescription } from './utils/home-screen-get-difficulty-description.util';

import type { SettingsType } from '@suuudokuuu/progress';

const topEdgeFadeProps = { height: HomeScreenTopOverlayHeight, intensity: HomeScreenTopOverlayIntensity };

// eslint-disable-next-line max-lines-per-function
export const HomeScreen = () => {
    const { create, isCreatingGame } = use(GameContext);
    const { theme } = use(ThemeContext);
    const { t } = useLingui();
    const safeAreaInsets = useSafeAreaInsets();
    const tabBarInset = use(TabBarInsetContext);
    const { bestScore, bestTime } = useDifficultyStats().reduce((best, stats) => (stats.bestScore > best.bestScore ? stats : best), {
        bestScore: 0,
        bestTime: 0
    });
    const currentElapsedTime = useElapsedTime();
    const { sudokuString: currentSudokuString, timelineEvents } = useCurrentRun();
    const { lastGameChallengeMode: isChallengeMode, lastGameDifficulty: difficulty, lastGameMaxMistakes: maxMistakes } = useSettings();
    const currentSolutionSteps = getTimelineCellSteps(timelineEvents);
    const isGameStarted = isNotEmptyString(currentSudokuString);
    const updateSettings = (patch: Partial<SettingsType>) =>
        void appRuntime.runPromise(Effect.flatMap(SettingsRepository, settingsRepository => settingsRepository.update(patch)));
    const handleDifficultyChange = (newDifficulty: DifficultyEnum) => void updateSettings({ lastGameDifficulty: newDifficulty });
    const handleMaxMistakes = (newMaxMistakes: number) => () => void updateSettings({ lastGameMaxMistakes: newMaxMistakes });
    const startNewPuzzle = () => void create({ difficulty, isChallengeRun: isChallengeMode, maxMistakes });

    const handleStart = () => {
        if (!isGameStarted) {
            startNewPuzzle();

            return;
        }

        Alert(t`Stop current run?`, t`All progress will be lost`, [
            { text: t`Cancel`, style: 'cancel' },
            { text: t`OK`, onPress: startNewPuzzle }
        ]);
    };

    const hintTextStyles = [styles.hintText, { color: theme.colors.text.hint }];
    const bestRunCardStyles = styles.bestRun;
    const bestRunValueStyles = [styles.historyValue, { color: theme.colors.text.primary }];
    const standardMistakesOption = {
        description: t`Three mistakes`,
        maxMistakes: 3,
        title: t`Standard`
    };
    const mistakeOptions = [
        {
            description: t`No limit`,
            maxMistakes: RelaxedMaxMistakesConstant,
            title: t`Relaxed`
        },
        standardMistakesOption,
        {
            description: t`Zero mistakes`,
            maxMistakes: 0,
            title: t`Hardcore`
        }
    ];
    const selectedMistakesOption = mistakeOptions.find(option => option.maxMistakes === maxMistakes) ?? standardMistakesOption;
    const selectedDifficultyIndexFromSettings = DifficultyComplexitySliderDifficulties.indexOf(difficulty);
    const selectedDifficultyIndex =
        selectedDifficultyIndexFromSettings < 0 ? DifficultyComplexitySliderInitialIndex : selectedDifficultyIndexFromSettings;
    const selectedDifficulty = DifficultyComplexitySliderDifficulties[selectedDifficultyIndex] ?? difficulty;
    const selectedDifficultyLabel = t(getDifficultyMessage(difficulty));
    const selectedDifficultyDescription = t(homeScreenGetDifficultyDescription(selectedDifficulty));
    const challengeSummarySuffix = isChallengeMode ? ` • ${t`Challenge`}` : '';
    const setupSummary = `${selectedDifficultyLabel} • ${selectedMistakesOption.title}${challengeSummarySuffix}`;
    const currentElapsedTimeText = useTimerText(currentElapsedTime);
    const currentProgressPercent = homeScreenGetCurrentGameProgress(currentSudokuString, currentSolutionSteps.length);
    const currentProgressText = `${currentProgressPercent}%`;
    const bestTimeText = useTimerText(bestTime);
    const bestRunMetrics = [
        { label: t`Score`, testID: HomeScreenSelectors.BestScore, value: String(bestScore) },
        { label: t`Time`, value: bestTimeText }
    ];
    const startButtonText = isGameStarted ? t`Start new puzzle` : t`Start puzzle`;
    const isHellSelected = difficulty === DifficultyEnum.Hell;
    const isInfinitySelected = difficulty === DifficultyEnum.Infinity;
    const contentInsetBottom = HomeScreenBottomScrollPadding + tabBarInset;
    const platformInsetTop = Platform.OS === 'ios' ? safeAreaInsets.top : 0;
    const contentInsetTop = homeScreenGetContentInsetTop(safeAreaInsets.top, platformInsetTop);
    const mistakeCards: HomeScreenOptionCardInterface[] = mistakeOptions.map(option => {
        const isSelected = option.maxMistakes === maxMistakes;
        const optionColors = homeScreenOptionCardGetColors(theme, isSelected);
        const optionColorStyles = { backgroundColor: optionColors.backgroundColor, borderColor: optionColors.borderColor };
        const titleStyles = [styles.optionTitle, { color: optionColors.titleColor }];
        const descriptionStyles = [styles.optionDescription, { color: optionColors.descriptionColor }];

        return {
            cardStyles: [styles.optionCard, optionColorStyles, styles.mistakeOptionCard],
            description: option.description,
            descriptionStyles,
            key: option.maxMistakes,
            onPress: handleMaxMistakes(option.maxMistakes),
            testID: `${HomeScreenSelectors.MistakeOption}.${option.maxMistakes}`,
            title: option.title,
            titleStyles
        };
    });

    return (
        <ChromePage contentStyle={styles.content} topEdgeFadeProps={topEdgeFadeProps}>
            <ScreenChromeScrollView
                contentContainerStyle={resolveUnistyleForAnimated(styles.scrollContent)}
                contentInsetBottom={contentInsetBottom}
                contentInsetMode="additive"
                contentInsetTop={contentInsetTop}
                showsVerticalScrollIndicator={false}
                style={resolveUnistyleForAnimated(styles.scrollView)}
                testID={HomeScreenSelectors.Root}
            >
                <View style={styles.contentStack}>
                    <View style={styles.masthead}>
                        <View style={styles.hero}>
                            <Header
                                maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant}
                                numberOfLines={1}
                                style={styles.title}
                                text={getBrand().appName}
                            />
                            <SupportUkrainePill />
                        </View>

                        {bestScore > 0 ? (
                            <Link asChild href="/scoring">
                                <Pressable accessibilityRole="button" style={styles.bestRunLink}>
                                    <View style={bestRunCardStyles}>
                                        <View style={styles.bestRunCopy}>
                                            <BlackText style={styles.bestRunLabel}>
                                                <Trans>Your best run</Trans>
                                            </BlackText>
                                            <BlackText numberOfLines={1} style={styles.bestRunTitle}>
                                                <Trans>Keep the streak</Trans>
                                            </BlackText>
                                        </View>

                                        <View style={styles.bestRunMetrics}>
                                            {bestRunMetrics.map(metric => (
                                                <View key={metric.label} style={styles.bestRunMetric}>
                                                    <BlackText style={hintTextStyles}>{metric.label}</BlackText>
                                                    <BlackText
                                                        adjustsFontSizeToFit
                                                        minimumFontScale={0.68}
                                                        numberOfLines={1}
                                                        style={bestRunValueStyles}
                                                        testID={metric.testID}
                                                    >
                                                        {metric.value}
                                                    </BlackText>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                </Pressable>
                            </Link>
                        ) : null}
                    </View>

                    <View style={styles.setupSection}>
                        <HomeScreenSectionHeader>
                            <ChallengeModeSwitch />
                        </HomeScreenSectionHeader>

                        <DifficultyComplexitySlider difficulty={difficulty} onChange={handleDifficultyChange} />

                        <View style={styles.fieldGroup}>
                            <BlackText style={styles.fieldLabel}>
                                <Trans>Mistakes</Trans>
                            </BlackText>

                            <View style={styles.mistakeGrid}>
                                {mistakeCards.map(option => (
                                    <HomeScreenOptionCard key={option.key} option={option} />
                                ))}
                            </View>
                        </View>

                        <DifficultyComplexityPreview
                            isChallengeMode={isChallengeMode}
                            maxMistakes={maxMistakes}
                            selectedDifficultyDescription={selectedDifficultyDescription}
                            selectedDifficultyLabel={selectedDifficultyLabel}
                            selectedIndex={selectedDifficultyIndex}
                            selectedMistakesDescription={selectedMistakesOption.description}
                            selectedMistakesLabel={selectedMistakesOption.title}
                        />

                        <HomeScreenPlayActions
                            currentElapsedTimeText={currentElapsedTimeText}
                            currentProgressPercent={currentProgressPercent}
                            currentProgressText={currentProgressText}
                            isGameStarted={isGameStarted}
                            isHellSelected={isHellSelected}
                            isInfinitySelected={isInfinitySelected}
                            isLoading={isCreatingGame}
                            onStart={handleStart}
                            startButtonSubtitle={setupSummary}
                            startButtonText={startButtonText}
                        />
                    </View>
                </View>
            </ScreenChromeScrollView>
        </ChromePage>
    );
};
