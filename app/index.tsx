import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View } from 'react-native';

import { BlackButton } from '../components/black-button/black-button';
import { DifficultySelect } from '../components/difficulty-select/difficulty-select';
import { Header } from '../components/header/header';
import { type DifficultyEnum } from '../enums/difficulty.enum';
import { useAppDispatch } from '../hooks/redux.hook';
import { appRootLoadAction } from '../store/app-root/app-root.actions';

import { HomeStyles as styles } from './index.styles';

export default function Home() {
    const router = useRouter();
    const dispatch = useAppDispatch();

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

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Header text="SuuudokuuU"></Header>
            {!showDifficultySelect && <BlackButton text="Start" onPress={handleDifficultySelect} />}
            {showDifficultySelect && (
                <>
                    <DifficultySelect onSelect={handleStart} />
                    <BlackButton text="Back" onPress={handleBack} />
                </>
            )}
        </View>
    );
}
