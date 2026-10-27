import { Trans, useLingui } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import * as Schema from 'effect/Schema';
import { useLocalSearchParams } from 'expo-router';
import { use } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenChromeScrollView } from '@rnw-community/react-native-screen-chrome';
import { isNotEmptyString } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ChromePage } from '../../../@generic/components/chrome-page/chrome-page';
import { Header } from '../../../@generic/components/header/header';
import { TabBarInsetContext } from '../../../@generic/components/main-tab-layout/context/tab-bar-inset.context';
import { SupportUkrainePill } from '../../../@generic/components/support-ukraine-pill/support-ukraine-pill';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { getBrand } from '../../../@generic/utils/get-brand.util';
import { getDifficultyMessage } from '../../../@generic/utils/get-difficulty-message.util';
import { getSudokuProgress } from '../../../@generic/utils/get-sudoku-progress.util';
import { ChallengeModeSwitch } from '../../../challenge/components/challenge-mode-switch/challenge-mode-switch';
import {
    DifficultyComplexitySliderDifficulties,
    DifficultyComplexitySliderInitialIndex
} from '../../../game/components/difficulty-complexity-slider/constant/difficulty-complexity-slider.constant';
import { DifficultyComplexityPreviewMistakes } from '../../../game/components/difficulty-complexity-slider/difficulty-complexity-preview-mistakes/difficulty-complexity-preview-mistakes';
import { DifficultyComplexityPreview } from '../../../game/components/difficulty-complexity-slider/difficulty-complexity-preview/difficulty-complexity-preview';
import { DifficultyComplexitySlider } from '../../../game/components/difficulty-complexity-slider/difficulty-complexity-slider';
import { GameContext } from '../../../game/context/game.context';
import { useConfirmRunReplacement } from '../../../game/hooks/use-confirm-run-replacement.hook';
import { useCurrentRun } from '../../../game/query/use-current-run.query';
import { useElapsedTime } from '../../../game/query/use-elapsed-time.query';
import { useDifficultyStats } from '../../../history/query/use-difficulty-stats.query';
import { RelaxedMaxMistakesConstant } from '../../../settings/constant/max-mistakes.constant';
import { useSettings } from '../../../settings/query/use-settings.query';
import { updateSettings } from '../../../settings/utils/update-settings.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { StoreIntentSchema } from '../../schema/store-intent.schema';

import { HomeScreenBottomScrollPadding, HomeScreenTopOverlayIntensity } from './constant/home-screen.constant';
import { HomeScreenBestRun } from './home-screen-best-run/home-screen-best-run';
import { HomeScreenContinueRow } from './home-screen-continue-row/home-screen-continue-row';
import { HomeScreenIntentSpotlight } from './home-screen-intent-spotlight/home-screen-intent-spotlight';
import { HomeScreenOptionCard } from './home-screen-option-card/home-screen-option-card';
import { homeScreenOptionCardGetColors } from './home-screen-option-card/utils/home-screen-option-card-get-colors.util';
import { HomeScreenPlayActions } from './home-screen-play-actions/home-screen-play-actions';
import { HomeScreenSectionHeader } from './home-screen-section-header/home-screen-section-header';
import { HomeScreenSelectors } from './home-screen.selectors';
import { HomeScreenStyles as styles } from './home-screen.styles';
import { type HomeScreenOptionCardInterface } from './interface/home-screen-option-card.interface';
import { homeScreenGetContentInsetTop } from './utils/home-screen-get-content-inset-top.util';
import { homeScreenGetDifficultyDescription } from './utils/home-screen-get-difficulty-description.util';

// oxlint-disable-next-line max-lines-per-function
export const HomeScreen = () => {
    const { create, isCreatingGame } = use(GameContext);
    const { theme } = use(ThemeContext);
    const { t } = useLingui();
    const { intent, intentVisit } = useLocalSearchParams<{ intent?: string | string[]; intentVisit?: string | string[] }>();
    const hasStoreIntent = Schema.is(StoreIntentSchema)(intent);
    const scrollViewKey = isNotEmptyString(intentVisit) ? intentVisit : 'home';
    const safeAreaInsets = useSafeAreaInsets();
    const tabBarInset = use(TabBarInsetContext);
    const { bestScore, bestTime } = useDifficultyStats().reduce((best, stats) => (stats.bestScore > best.bestScore ? stats : best), {
        bestScore: 0,
        bestTime: 0
    });
    const currentElapsedTime = useElapsedTime();
    const confirmRunReplacement = useConfirmRunReplacement();
    const { sudokuString: currentSudokuString } = useCurrentRun();
    const { lastGameChallengeMode: isChallengeMode, lastGameDifficulty: difficulty, lastGameMaxMistakes: maxMistakes } = useSettings();
    const isGameStarted = isNotEmptyString(currentSudokuString);
    const handleDifficultyChange = (newDifficulty: DifficultyEnum) => void updateSettings({ lastGameDifficulty: newDifficulty });
    const handleMaxMistakes = (newMaxMistakes: number) => () => void updateSettings({ lastGameMaxMistakes: newMaxMistakes });
    const startNewPuzzle = () => void create({ difficulty, isChallengeRun: isChallengeMode, maxMistakes });

    const handleStart = () => void confirmRunReplacement(startNewPuzzle);

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
    const currentProgressPercent = getSudokuProgress(currentSudokuString).percent;
    const currentProgressText = `${currentProgressPercent}%`;
    const startButtonText = isGameStarted ? t`Start new puzzle` : t`Start puzzle`;
    const contentInsetBottom = HomeScreenBottomScrollPadding + tabBarInset;
    const contentInsetTop = homeScreenGetContentInsetTop(safeAreaInsets.top);
    const topEdgeFadeProps = { height: contentInsetTop, intensity: HomeScreenTopOverlayIntensity };
    const contentStackStyles = hasStoreIntent ? [styles.contentStack, styles.intentContentStack] : styles.contentStack;
    const playActions = (
        <HomeScreenPlayActions
            difficulty={difficulty}
            isLoading={isCreatingGame}
            onStart={handleStart}
            startButtonSubtitle={setupSummary}
            startButtonText={startButtonText}
        >
            {isGameStarted ? (
                <HomeScreenContinueRow
                    currentElapsedTimeText={currentElapsedTimeText}
                    currentProgressPercent={currentProgressPercent}
                    currentProgressText={currentProgressText}
                />
            ) : null}
        </HomeScreenPlayActions>
    );
    const intentIntroduction = hasStoreIntent ? (
        <>
            <HomeScreenIntentSpotlight
                difficultyLabel={selectedDifficultyLabel}
                intent={intent}
                mistakesTitle={selectedMistakesOption.title}
            />
            {playActions}
        </>
    ) : null;
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
                key={scrollViewKey}
                showsVerticalScrollIndicator={false}
                style={resolveUnistyleForAnimated(styles.scrollView)}
                testID={HomeScreenSelectors.Root}
            >
                <View style={contentStackStyles}>
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

                        {bestScore > 0 ? <HomeScreenBestRun bestScore={bestScore} bestTime={bestTime} /> : null}
                    </View>

                    <View style={styles.setupSection}>
                        {intentIntroduction}

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

                        {hasStoreIntent ? null : (
                            <>
                                <DifficultyComplexityPreview
                                    isChallengeMode={isChallengeMode}
                                    maxMistakes={maxMistakes}
                                    selectedDifficultyDescription={selectedDifficultyDescription}
                                    selectedDifficultyLabel={selectedDifficultyLabel}
                                    selectedIndex={selectedDifficultyIndex}
                                >
                                    <DifficultyComplexityPreviewMistakes
                                        description={selectedMistakesOption.description}
                                        label={selectedMistakesOption.title}
                                    />
                                </DifficultyComplexityPreview>
                                {playActions}
                            </>
                        )}
                    </View>
                </View>
            </ScreenChromeScrollView>
        </ChromePage>
    );
};
