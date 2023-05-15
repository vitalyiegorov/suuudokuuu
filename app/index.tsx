import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { DifficultySelect } from '../components/difficulty-select/difficulty-select';
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

    const backButtonStyles = [styles.startButton, styles.backButton];

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Text style={styles.header}>SuuudokuuU</Text>
            {!showDifficultySelect && (
                <Pressable style={styles.startButton} onPress={handleDifficultySelect}>
                    <Text style={styles.startButtonText}>Start</Text>
                </Pressable>
            )}
            {showDifficultySelect && (
                <>
                    <DifficultySelect onSelect={handleStart} />
                    <Pressable style={backButtonStyles} onPress={handleBack}>
                        <Text style={styles.startButtonText}>Back</Text>
                    </Pressable>
                </>
            )}
        </View>
    );
}
