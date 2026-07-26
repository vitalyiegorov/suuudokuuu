import { Trans, useLingui } from '@lingui/react/macro';
import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { ScreenChromeScrollView } from '@suuudokuuu/screen-chrome';
import { useAppLayout } from '@suuudokuuu/ui';
import { Link } from 'expo-router';
import { use, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Alert } from '../../../@generic/components/alert/alert';
import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ChromePage } from '../../../@generic/components/chrome-page/chrome-page';
import { Header } from '../../../@generic/components/header/header';
import { SupportUkrainePill } from '../../../@generic/components/support-ukraine-pill/support-ukraine-pill';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { getDifficultyText } from '../../../@generic/utils/get-difficulty-text.util';
import { resolveUnistyleForAnimated } from '../../../@generic/utils/resolve-unistyle-for-animated.util';
import {
    DifficultyComplexitySliderDifficulties,
    DifficultyComplexitySliderInitialIndex
} from '../../../game/components/difficulty-complexity-slider/constant/difficulty-complexity-slider.constant';
import { DifficultyComplexityPreview } from '../../../game/components/difficulty-complexity-slider/difficulty-complexity-preview/difficulty-complexity-preview';
import { DifficultyComplexitySlider } from '../../../game/components/difficulty-complexity-slider/difficulty-complexity-slider';
import { GameContext } from '../../../game/context/game.context';
import {
    gameElapsedTimeSelector,
    gameHistoryBestTimeSelector,
    gameIsStartedSelector,
    gameSolutionsStepsSelector,
    gameSudokuStringSelector
} from '../../../game/store/game.selectors';
import { settingsSetAction } from '../../../settings/store/settings.actions';
import { settingsLastGameDifficultySelector, settingsLastGameMaxMistakesSelector } from '../../../settings/store/settings.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';

import {
    HomeScreenBottomScrollPadding,
    HomeScreenFloatingTabBarInset,
    HomeScreenTopContentPadding,
    HomeScreenTopOverlayHeight,
    HomeScreenTopOverlayIntensity
} from './constant/home-screen.constant';
import { HomeScreenOptionCard } from './home-screen-option-card/home-screen-option-card';
import { homeScreenOptionCardGetColors } from './home-screen-option-card/utils/home-screen-option-card-get-colors.util';
import { HomeScreenPlayActions } from './home-screen-play-actions/home-screen-play-actions';
import { HomeScreenSectionHeader } from './home-screen-section-header/home-screen-section-header';
import { HomeScreenSelectors } from './home-screen.selectors';
import { HomeScreenStyles as styles } from './home-screen.styles';
import { type HomeScreenOptionCardInterface } from './interface/home-screen-option-card.interface';
import { homeScreenGetCurrentGameProgress } from './utils/home-screen-get-current-game-progress.util';

const RelaxedMistakeLimit = 99;
const topEdgeFadeProps = { height: HomeScreenTopOverlayHeight, intensity: HomeScreenTopOverlayIntensity };

// eslint-disable-next-line max-lines-per-function
export const HomeScreen = () => {
    const { create } = use(GameContext);
    const { theme } = use(ThemeContext);
    const { t } = useLingui();
    const dispatch = useAppDispatch();
    const { sizeClass } = useAppLayout();
    const [bestScore, bestTime] = useAppSelector(gameHistoryBestTimeSelector);
    const currentElapsedTime = useAppSelector(gameElapsedTimeSelector);
    const currentSolutionSteps = useAppSelector(gameSolutionsStepsSelector);
    const currentSudokuString = useAppSelector(gameSudokuStringSelector);
    const difficulty = useAppSelector(settingsLastGameDifficultySelector);
    const isGameStarted = useAppSelector(gameIsStartedSelector);
    const maxMistakes = useAppSelector(settingsLastGameMaxMistakesSelector);
    const [isLoading, setIsLoading] = useState(false);
    const handleDifficultyChange = (newDifficulty: DifficultyEnum) => dispatch(settingsSetAction({ lastGameDifficulty: newDifficulty }));
    const handleMaxMistakes = (newMaxMistakes: number) => () => dispatch(settingsSetAction({ lastGameMaxMistakes: newMaxMistakes }));
    const startNewPuzzle = () => {
        setIsLoading(true);

        setTimeout(() => {
            try {
                create(difficulty, maxMistakes);
            } finally {
                setIsLoading(false);
            }
        });
    };

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

    const hintTextStyles = [styles.hintText, { color: theme.colors.label.hint }];
    const bestRunCardStyles = styles.bestRun;
    const bestRunValueStyles = [styles.historyValue, { color: theme.colors.label.main }];
    const standardMistakesOption = {
        description: t`Three mistakes`,
        maxMistakes: 3,
        title: t`Standard`
    };
    const mistakeOptions = [
        {
            description: t`No limit`,
            maxMistakes: RelaxedMistakeLimit,
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
    const difficultyDescriptionsByDifficulty = {
        [DifficultyEnum.Newbie]: t`Gentle start`,
        [DifficultyEnum.Easy]: t`Light warm-up`,
        [DifficultyEnum.Medium]: t`Balanced solve`,
        [DifficultyEnum.Hard]: t`Deep focus`,
        [DifficultyEnum.Nightmare]: t`Expert grid`
    };
    const selectedDifficultyLabel = getDifficultyText(difficulty);
    const selectedDifficultyDescription = difficultyDescriptionsByDifficulty[selectedDifficulty];
    const setupSummary = `${selectedDifficultyLabel} • ${selectedMistakesOption.title}`;
    const currentSudokuStringHasFieldLength = currentSudokuString.length === defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize;
    const currentGameDifficulty = currentSudokuStringHasFieldLength
        ? Sudoku.convertFieldFromString(currentSudokuString, defaultSudokuConfig)[1]
        : difficulty;
    const currentGameDifficultyLabel = getDifficultyText(currentGameDifficulty);
    const currentElapsedTimeText = useTimerText(currentElapsedTime);
    const currentProgressPercent = homeScreenGetCurrentGameProgress(currentSudokuString, currentSolutionSteps.length);
    const currentProgressText = `${currentProgressPercent}%`;
    const bestTimeText = useTimerText(bestTime);
    const bestRunMetrics = [
        { label: t`Score`, testID: HomeScreenSelectors.BestScore, value: String(bestScore) },
        { label: t`Time`, value: bestTimeText }
    ];
    const startButtonText = isGameStarted ? t`Start new puzzle` : t`Start puzzle`;
    const contentInsetBottom = HomeScreenBottomScrollPadding + HomeScreenFloatingTabBarInset;
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
            title: option.title,
            titleStyles
        };
    });

    return (
        <ChromePage contentStyle={styles.content} topEdgeFadeProps={topEdgeFadeProps}>
            <ScreenChromeScrollView
                contentContainerStyle={styles.scrollContent(sizeClass)}
                contentInsetBottom={contentInsetBottom}
                contentInsetTop={HomeScreenTopContentPadding}
                showsVerticalScrollIndicator={false}
                style={resolveUnistyleForAnimated(styles.scrollView)}
                testID={HomeScreenSelectors.Root}
            >
                <View style={styles.contentStack(sizeClass)}>
                    <View style={styles.masthead(sizeClass)}>
                        <View style={styles.hero}>
                            <Header numberOfLines={1} style={styles.title} text={t`suuudokuuu`} />
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

                    <View style={styles.setupSection(sizeClass)}>
                        <HomeScreenSectionHeader />

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
                            maxMistakes={maxMistakes}
                            selectedDifficultyDescription={selectedDifficultyDescription}
                            selectedDifficultyLabel={selectedDifficultyLabel}
                            selectedIndex={selectedDifficultyIndex}
                            selectedMistakesDescription={selectedMistakesOption.description}
                            selectedMistakesLabel={selectedMistakesOption.title}
                        />

                        <HomeScreenPlayActions
                            currentElapsedTimeText={currentElapsedTimeText}
                            currentGameDifficultyLabel={currentGameDifficultyLabel}
                            currentProgressPercent={currentProgressPercent}
                            currentProgressText={currentProgressText}
                            isGameStarted={isGameStarted}
                            isLoading={isLoading}
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
