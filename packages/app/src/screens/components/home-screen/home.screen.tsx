import Constants from 'expo-constants';
import { Link } from 'expo-router';
import { use, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { isNotEmptyString } from '@rnw-community/shared';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { DifficultySelect } from '../../../@generic/components/difficulty-select/difficulty-select';
import { Header } from '../../../@generic/components/header/header';
import { SupportUkraineBanner } from '../../../@generic/components/support-ukraine-banner/support-ukraine-banner';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { Colors } from '../../../@generic/styles/theme';
import { getTimerText } from '../../../@generic/utils/get-timer-text.util';
import { GameContext } from '../../../game/context/game.context';
import { useResumeGame } from '../../../game/hooks/use-resume-game.hook';
import { gameSudokuStringSelector } from '../../../game/store/game.selectors';
import { historyBestTimeSelector } from '../../../history/store/history.selectors';

import { HomeScreenStyles } from './home-screen.styles';

import type { DifficultyEnum } from '@suuudokuuu/generator';

export const HomeScreen = () => {
    const { createFromDifficulty } = use(GameContext);

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

        // HINT: Sudoku creation hangs the UI thread, we need to render the loading first
        setTimeout(() => {
            createFromDifficulty(difficulty);
            setShowDifficultySelect(false);
            setIsLoading(false);
        }, 10);
    };

    return (
        <View style={HomeScreenStyles.container}>
            <SupportUkraineBanner />

            <View style={HomeScreenStyles.centerContainer}>
                <Header text="SuuudokuuU" />

                {!showDifficultySelect && (
                    <View style={HomeScreenStyles.buttonWrapper}>
                        {isGameStarted ? <BlackButton onPress={handleContinue} text="Continue" /> : null}

                        <BlackButton onPress={handleDifficultySelect} text="Start new" />
                    </View>
                )}

                {isLoading ? <ActivityIndicator color={Colors.black} /> : null}

                {!isLoading && showDifficultySelect ? (
                    <>
                        <DifficultySelect onSelect={handleStart} />

                        <BlackButton onPress={handleBack} text="Back" />
                    </>
                ) : null}
            </View>

            <View style={HomeScreenStyles.historyContainer}>
                {bestScore > 0 && (
                    <>
                        <View style={HomeScreenStyles.historyGroup}>
                            <Text style={HomeScreenStyles.historyLabel}>Best score</Text>

                            <Text style={HomeScreenStyles.historyValue}>{bestScore}</Text>
                        </View>

                        <View style={HomeScreenStyles.historyGroup}>
                            <Text style={HomeScreenStyles.historyLabel}>Best time</Text>

                            <Text style={HomeScreenStyles.historyValue}>{getTimerText(bestTime)}</Text>
                        </View>
                    </>
                )}
            </View>

            <View style={HomeScreenStyles.bottomContainer}>
                <Text style={HomeScreenStyles.bottomLink}>
                    V.
                    {Constants.expoConfig?.version}
                </Text>

                <Link href="/privacy-policy" style={HomeScreenStyles.bottomLink}>
                    <Text>Privacy policy</Text>
                </Link>
            </View>
        </View>
    );
};
