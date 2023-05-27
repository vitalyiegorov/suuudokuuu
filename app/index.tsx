import { isNotEmptyString } from '@rnw-community/shared';
import { formatDuration } from 'date-fns';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error,@typescript-eslint/ban-ts-comment
// @ts-ignore
import * as AppConfig from '../app.json';
import { BlackButton } from '../components/black-button/black-button';
import { DifficultySelect } from '../components/difficulty-select/difficulty-select';
import { Header } from '../components/header/header';
import { PageHeader } from '../components/page-header/page-header';
import { InitialDateConstant } from '../constants/date.constant';
import { type DifficultyEnum } from '../enums/difficulty.enum';
import { useAppDispatch, useAppSelector } from '../hooks/redux.hook';
import { appRootLoadAction } from '../store/app-root/app-root.actions';
import { appRootGameStartedAtSelector } from '../store/app-root/app-root.selectors';
import { historyBestScoreSelector, historyBestTimeSelector } from '../store/history/history.selectors';

import { HomeStyles as styles } from './index.styles';

export default function Home() {
    const router = useRouter();

    const dispatch = useAppDispatch();
    const isGameStarted = useAppSelector(appRootGameStartedAtSelector).getTime() > InitialDateConstant.getTime();
    const bestScore = useAppSelector(historyBestScoreSelector);
    const bestTime = useAppSelector(historyBestTimeSelector);
    const bestTimeFormat = formatDuration(bestTime);

    const [showDifficultySelect, setShowDifficultySelect] = useState(false);

    const handleDifficultySelect = () => {
        setShowDifficultySelect(true);
    };
    const handleBack = () => {
        setShowDifficultySelect(false);
    };
    const handleStart = (difficulty: DifficultyEnum) => {
        dispatch(appRootLoadAction(difficulty));
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
