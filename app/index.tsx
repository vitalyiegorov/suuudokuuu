import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { BlackButton } from '../components/black-button/black-button';
import { DifficultySelect } from '../components/difficulty-select/difficulty-select';
import { Header } from '../components/header/header';
import { PageHeader } from '../components/page-header/page-header';
import { InitialDateConstant } from '../constants/date.constant';
import { type DifficultyEnum } from '../enums/difficulty.enum';
import { useAppDispatch, useAppSelector } from '../hooks/redux.hook';
import { appRootLoadAction } from '../store/app-root/app-root.actions';
import { appRootGameStartedAtSelector } from '../store/app-root/app-root.selectors';

import { HomeStyles as styles } from './index.styles';

export default function Home() {
    const router = useRouter();

    const dispatch = useAppDispatch();
    const isGameStarted = useAppSelector(appRootGameStartedAtSelector) > InitialDateConstant;

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
        <View style={styles.container}>
            <PageHeader />
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
    );
}
