import { useLingui } from '@lingui/react/macro';
import Constants from 'expo-constants';
import { Link } from 'expo-router';
import { use, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { BlackText } from '../../../@generic/components/black-text/black-text';
import { Header } from '../../../@generic/components/header/header';
import { SupportUkraineBanner } from '../../../@generic/components/support-ukraine-banner/support-ukraine-banner';
import { ThemeButton } from '../../../@generic/components/theme-button/theme-button';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { getTimerText } from '../../../@generic/utils/get-timer-text.util';
import { DifficultySelect } from '../../../game/components/difficulty-select/difficulty-select';
import { MistakesSelect } from '../../../game/components/mistakes-select/mistakes-select';
import { GameContext } from '../../../game/context/game.context';
import { useResumeGame } from '../../../game/hooks/use-resume-game.hook';
import { gameHistoryBestTimeSelector, gameSudokuStringSelector } from '../../../game/store/game.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';

import { HomeScreenStyles as styles } from './home-screen.styles';

import type { DifficultyEnum } from '@suuudokuuu/generator';

// eslint-disable-next-line max-lines-per-function
export const HomeScreen = () => {
    const { create } = use(GameContext);
    const { theme } = use(ThemeContext);
    const { t } = useLingui();

    const oldGameString = useAppSelector(gameSudokuStringSelector);
    const [bestScore, bestTime] = useAppSelector(gameHistoryBestTimeSelector);

    const handleContinue = useResumeGame();

    const [state, setState] = useState<'initial' | 'difficulty' | 'mistakes'>('initial');
    const [isLoading, setIsLoading] = useState(false);
    const [difficulty, setDifficulty] = useState<DifficultyEnum>();

    const isGameStarted = isNotEmptyString(oldGameString);

    const handleState = (newState: typeof state) => () => {
        setState(newState);
    };
    const handleDifficulty = (newDifficulty: DifficultyEnum) => {
        setDifficulty(newDifficulty);
        setState('mistakes');
    };
    const handleStart = (maxMistakes: number) => {
        setIsLoading(true);

        if (isDefined(difficulty)) {
            requestAnimationFrame(() => {
                create(difficulty, maxMistakes);
                setState('initial');
                setIsLoading(false);
            });
        }
    };

    return (
        <View style={styles.container}>
            <ThemeButton style={styles.themeButton} />
            <SupportUkraineBanner />

            <View style={styles.centerContainer}>
                {state === 'initial' && (
                    <View style={styles.buttonWrapper}>
                        <Header text={t`SuuudokuuU`} />

                        {isGameStarted ? (
                            <>
                                <BlackButton onPress={handleContinue} text={t`Continue`} />
                                <View style={[styles.separator, { borderColor: theme.colors.black }]} />
                            </>
                        ) : null}

                        <BlackButton onPress={handleState('difficulty')} text={t`Start new`} />

                        <Link asChild href="/history">
                            <BlackButton text={t`Statistics`} />
                        </Link>
                        <Link asChild href="/settings">
                            <BlackButton text={t`Settings`} />
                        </Link>
                    </View>
                )}

                {isLoading ? <ActivityIndicator color={theme.colors.black} /> : null}

                {!isLoading && state === 'difficulty' ? (
                    <>
                        <DifficultySelect onSelect={handleDifficulty} />

                        <BlackButton onPress={handleState('initial')} text={t`Back`} />
                    </>
                ) : null}

                {!isLoading && state === 'mistakes' ? (
                    <>
                        <MistakesSelect onSelect={handleStart} />

                        <BlackButton onPress={handleState('difficulty')} text={t`Back`} />
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

                <Link asChild href="https://github.com/vitalyiegorov/suuudokuuu/issues/new">
                    <BlackText numberOfLines={2} style={styles.infoLink}>{t`Report a bug`}</BlackText>
                </Link>

                <Link asChild href="/privacy-policy">
                    <BlackText numberOfLines={2} style={styles.infoLink}>{t`Privacy policy`}</BlackText>
                </Link>
            </View>
        </View>
    );
};
