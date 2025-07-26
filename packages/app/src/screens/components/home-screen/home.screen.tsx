import { useLingui } from '@lingui/react/macro';
import Constants from 'expo-constants';
import { Link } from 'expo-router';
import { LucideMoon, LucideSunMedium } from 'lucide-react-native';
import { use, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { isNotEmptyString } from '@rnw-community/shared';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { BlackText } from '../../../@generic/components/black-text/black-text';
import { DifficultySelect } from '../../../@generic/components/difficulty-select/difficulty-select';
import { Header } from '../../../@generic/components/header/header';
import { SupportUkraineBanner } from '../../../@generic/components/support-ukraine-banner/support-ukraine-banner';
import { ThemeContext } from '../../../@generic/context/theme.context';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { getTimerText } from '../../../@generic/utils/get-timer-text.util';
import { GameContext } from '../../../game/context/game.context';
import { useResumeGame } from '../../../game/hooks/use-resume-game.hook';
import { gameSudokuStringSelector } from '../../../game/store/game.selectors';
import { historyBestTimeSelector } from '../../../history/store/history.selectors';

import { HomeScreenStyles as styles } from './home-screen.styles';

import type { DifficultyEnum } from '@suuudokuuu/generator';

export const HomeScreen = () => {
    const { createFromDifficulty } = use(GameContext);
    const { toggleTheme, colorScheme, theme } = use(ThemeContext);
    const { t } = useLingui();

    const oldGameString = useAppSelector(gameSudokuStringSelector);
    const [bestScore, bestTime] = useAppSelector(historyBestTimeSelector);

    const handleContinue = useResumeGame();

    const [showDifficultySelect, setShowDifficultySelect] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isGameStarted = isNotEmptyString(oldGameString);

    const handleDifficultySelect = () => {
        setShowDifficultySelect(true);
    };
    const handleBack = () => {
        setShowDifficultySelect(false);
    };
    const handleStart = (difficulty: DifficultyEnum) => {
        setIsLoading(true);

        requestAnimationFrame(() => {
            createFromDifficulty(difficulty);
            setShowDifficultySelect(false);
            setIsLoading(false);
        });
    };

    const ThemeIcon = colorScheme === 'dark' ? LucideSunMedium : LucideMoon;

    return (
        <View style={styles.container}>
            <BlackButton onPress={toggleTheme} style={styles.themeButton}>
                <ThemeIcon color={theme.colors.white} />
            </BlackButton>
            <SupportUkraineBanner />

            <View style={styles.centerContainer}>
                <Header text={t`SuuudokuuU`} />

                {!showDifficultySelect && (
                    <View style={styles.buttonWrapper}>
                        {isGameStarted ? <BlackButton onPress={handleContinue} text={t`Continue`} /> : null}

                        <BlackButton onPress={handleDifficultySelect} text={t`Start new`} />
                    </View>
                )}

                {isLoading ? <ActivityIndicator color={theme.colors.black} /> : null}

                {!isLoading && showDifficultySelect ? (
                    <>
                        <DifficultySelect onSelect={handleStart} />

                        <BlackButton onPress={handleBack} text={t`Back`} />
                    </>
                ) : null}
            </View>

            <View style={styles.historyContainer}>
                {bestScore > 0 && (
                    <>
                        <View style={styles.historyGroup}>
                            <BlackText>{t`Best score`}</BlackText>

                            <BlackText style={styles.historyValue}>{bestScore}</BlackText>
                        </View>

                        <View style={styles.historyGroup}>
                            <BlackText>{t`Best time`}</BlackText>

                            <BlackText style={styles.historyValue}>{getTimerText(bestTime)}</BlackText>
                        </View>
                    </>
                )}
            </View>

            <View style={styles.bottomContainer}>
                <BlackText>
                    <Text>{t`V.`}</Text>
                    {Constants.expoConfig?.version}
                </BlackText>

                <Link href="/privacy-policy">
                    <BlackText>{t`Privacy policy`}</BlackText>
                </Link>
            </View>
        </View>
    );
};
