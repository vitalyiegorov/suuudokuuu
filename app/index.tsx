import { isNotEmptyString } from '@rnw-community/shared';
import { formatDuration } from 'date-fns';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error,@typescript-eslint/ban-ts-comment
// @ts-ignore No types
import AppConfig from '../app.json';
import { DifficultySelect } from '../src/@app-root';
import { BlackButton, type DifficultyEnum, Header, InitialDateConstant, PageHeader, useAppDispatch, useAppSelector } from '../src/@generic';
import { gameLoadAction, gameStartedAtSelector } from '../src/game';
import { historyBestTimeSelector } from '../src/history';

import { StartScreenStyles as styles } from './start-screen.styles';

export default function StartScreen() {
    const router = useRouter();

    const dispatch = useAppDispatch();
    const isGameStarted = useAppSelector(gameStartedAtSelector).getTime() > InitialDateConstant.getTime();
    const [bestScore, bestTime] = useAppSelector(historyBestTimeSelector);
    const bestTimeFormat = formatDuration(bestTime);

    const [showDifficultySelect, setShowDifficultySelect] = useState(false);

    const handleDifficultySelect = () => {
        setShowDifficultySelect(true);
    };
    const handleBack = () => {
        setShowDifficultySelect(false);
    };
    const handleStart = (difficulty: DifficultyEnum) => {
        dispatch(gameLoadAction(difficulty));
        router.push('game');
        setShowDifficultySelect(false);
    };
    const handleContinue = () => {
        router.push('game');
    };

    return (
        <SafeAreaView style={styles.container}>
            <PageHeader />
            <View style={styles.historyContainer}></View>
            <View style={styles.centerContainer}>
                <Header text="SuuudokuuU"></Header>
                {!showDifficultySelect && (
                    <View style={styles.buttonWrapper}>
                        {isGameStarted && <BlackButton text="Continue" onPress={handleContinue} />}
                        <BlackButton text="Start new" onPress={handleDifficultySelect} />
                    </View>
                )}
                {showDifficultySelect && (
                    <>
                        <DifficultySelect onSelect={handleStart} />
                        <BlackButton text="Back" onPress={handleBack} />
                    </>
                )}
            </View>

            <View style={styles.historyContainer}>
                {isNotEmptyString(bestTimeFormat) && (
                    <>
                        <View style={styles.historyGroup}>
                            <Text style={styles.historyLabel}>Best score</Text>
                            <Text style={styles.historyValue}>{bestScore}</Text>
                        </View>
                        <View style={styles.historyGroup}>
                            <Text style={styles.historyLabel}>Best time</Text>
                            <Text style={styles.historyValue}>{bestTimeFormat}</Text>
                        </View>
                    </>
                )}
            </View>

            <View style={styles.bottomContainer}>
                <Text style={styles.bottomLink}>V.{AppConfig.expo.version}</Text>
                <Link href="/privacy-policy" style={styles.bottomLink}>
                    <Text>Privacy policy</Text>
                </Link>
            </View>
        </SafeAreaView>
    );
}
