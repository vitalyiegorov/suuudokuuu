import { formatDuration } from 'date-fns';
import Constants from 'expo-constants';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { isNotEmptyString } from '@rnw-community/shared';

import { DifficultySelect } from '../src/@app-root';
import {
    BlackButton,
    type DifficultyEnum,
    Header,
    InitialDateConstant,
    PageHeader,
    SupportUkraineBanner,
    useAppDispatch,
    useAppSelector
} from '../src/@generic';
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
                <Text style={styles.bottomLink}>
                    V.
                    {Constants.expoConfig?.version}
                </Text>

                <Link href="/privacy-policy" style={styles.bottomLink}>
                    <Text>Privacy policy</Text>
                </Link>
            </View>
        </SafeAreaView>
    );
}
