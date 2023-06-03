import Constants from 'expo-constants';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { isNotEmptyString } from '@rnw-community/shared';

import { DifficultySelect } from '../src/@app-root';
import { BlackButton, type DifficultyEnum, Header, PageHeader, SupportUkraineBanner, getTimerText, useAppSelector } from '../src/@generic';
import { gameSudokuStringSelector, useResumeGame } from '../src/game';
import { historyBestTimeSelector } from '../src/history';

import { StartScreenStyles as styles } from './start-screen.styles';

export default function StartScreen() {
    const router = useRouter();

    const oldGameString = useAppSelector(gameSudokuStringSelector);
    const [bestScore, bestTime] = useAppSelector(historyBestTimeSelector);

    const handleContinue = useResumeGame();

    const [showDifficultySelect, setShowDifficultySelect] = useState(false);

    const isGameStarted = isNotEmptyString(oldGameString);

    const handleDifficultySelect = () => {
        setShowDifficultySelect(true);
    };
    const handleBack = () => {
        setShowDifficultySelect(false);
    };
    const handleStart = (difficulty: DifficultyEnum) => {
        router.push(`game?difficulty=${difficulty}`);
        setShowDifficultySelect(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <PageHeader />
            <SupportUkraineBanner />
            <View style={styles.historyContainer} />

            <View style={styles.centerContainer}>
                <Header text="SuuudokuuU" />

                {!showDifficultySelect && (
                    <View style={styles.buttonWrapper}>
                        {isGameStarted ? <BlackButton onPress={handleContinue} text="Continue" /> : null}
                        <BlackButton onPress={handleDifficultySelect} text="Start new" />
                    </View>
                )}

                {showDifficultySelect ? (
                    <>
                        <DifficultySelect onSelect={handleStart} />
                        <BlackButton onPress={handleBack} text="Back" />
                    </>
                ) : null}
            </View>

            <View style={styles.historyContainer}>
                {bestScore > 0 && (
                    <>
                        <View style={styles.historyGroup}>
                            <Text style={styles.historyLabel}>Best score</Text>
                            <Text style={styles.historyValue}>{bestScore}</Text>
                        </View>

                        <View style={styles.historyGroup}>
                            <Text style={styles.historyLabel}>Best time</Text>
                            <Text style={styles.historyValue}>{getTimerText(bestTime)}</Text>
                        </View>
                    </>
                )}
            </View>

            <View style={styles.bottomContainer}>
                <Text style={styles.bottomLink}>V.{Constants.expoConfig?.version}</Text>
                <Link href="/privacy-policy" style={styles.bottomLink}>
                    <Text>Privacy policy</Text>
                </Link>
            </View>
        </SafeAreaView>
    );
}
