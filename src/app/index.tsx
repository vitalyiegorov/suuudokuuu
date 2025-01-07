import Constants from 'expo-constants';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { isNotEmptyString } from '@rnw-community/shared';

import { BlackButton } from '../@generic/components/black-button/black-button';
import { DifficultySelect } from '../@generic/components/difficulty-select/difficulty-select';
import { Header } from '../@generic/components/header/header';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { SupportUkraineBanner } from '../@generic/components/support-ukraine-banner/support-ukraine-banner';
import type { DifficultyEnum } from '../@generic/enums/difficulty.enum';
import { useAppSelector } from '../@generic/hooks/use-app-selector.hook';
import { Colors } from '../@generic/styles/theme';
import { getTimerText } from '../@generic/utils/get-timer-text.util';
import { useResumeGame } from '../game/hooks/use-resume-game.hook';
import { gameSudokuStringSelector } from '../game/store/game.selectors';
import { historyBestTimeSelector } from '../history';

export const styles = StyleSheet.create({
    bottomContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 20
    },
    bottomLink: {
        color: Colors.black
    },
    buttonWrapper: {
        gap: 10
    },
    centerContainer: {
        alignItems: 'center',
        flex: 3,
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    historyContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
        gap: 20,
        justifyContent: 'center'
    },
    historyGroup: {
        alignItems: 'center'
    },
    historyLabel: {
        color: Colors.black
    },
    historyValue: {
        color: Colors.black,
        fontWeight: 'bold'
    }
});

export default function HomePage() {
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
