/* eslint-disable react-native/no-raw-text */
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Alert, BlackButton, PageHeader, useAppDispatch, useAppSelector, hapticImpact } from '../../../@generic';
import { MaxMistakesConstant } from '../../constants/max-mistakes.constant';
import { type CellInterface } from '../../interfaces/cell.interface';
import { gameResetAction, gameSelectCellAction } from '../../store/game.actions';
import {
    gameFieldSelector,
    gameMistakesSelector,
    gameScoreSelector,
    gameSelectedCellSelector,
    gameStartedAtSelector
} from '../../store/game.selectors';
import { hasBlankCells } from '../../utils/field/has-blank-cells.util';
import { AvailableValues } from '../available-values/available-values';
import { Field } from '../field/field';
import { GameTimer } from '../game-timer/game-timer';

import { GameScreenStyles as styles } from './game-screen.styles';

export const GameScreen = () => {
    const router = useRouter();

    const dispatch = useAppDispatch();
    const field = useAppSelector(gameFieldSelector);
    const selectedCell = useAppSelector(gameSelectedCellSelector);
    const mistakes = useAppSelector(gameMistakesSelector);
    const currentScore = useAppSelector(gameScoreSelector);
    const startedAt = useAppSelector(gameStartedAtSelector);

    const handleWin = async () => {
        if (!hasBlankCells(field)[0]) {
            await hapticImpact(ImpactFeedbackStyle.Heavy);
            router.push('winner');
        }
    };
    const handleLose = async () => {
        if (mistakes >= MaxMistakesConstant) {
            await hapticImpact(ImpactFeedbackStyle.Heavy);
            router.push('loser');
        }
    };

    const handleExit = () => {
        Alert('Stop current run?', 'All progress will be lost', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'OK',
                onPress: () => {
                    dispatch(gameResetAction());
                    router.push('/');
                }
            }
        ]);
    };

    useEffect(() => void handleWin(), [field]);
    useEffect(() => void handleLose(), [mistakes]);

    const handleSelectCell = useCallback((cell: CellInterface | undefined) => void dispatch(gameSelectCellAction(cell)), []);

    return (
        <SafeAreaView style={styles.container}>
            <PageHeader title="Be wise, be smart, be quick..." />
            <View style={styles.controls}>
                <View style={styles.controlsWrapper}>
                    <Text style={styles.headerText}>Mistakes</Text>
                    <Text style={styles.headerText}>
                        <Text style={styles.mistakesCountText}>{mistakes}</Text> / {MaxMistakesConstant}
                    </Text>
                </View>
                <View style={styles.controlsWrapper}>
                    <Text style={styles.headerText}>Score</Text>
                    <Text style={styles.scoreText}>{currentScore}</Text>
                </View>
                <BlackButton text="Exit" onPress={handleExit} />
            </View>
            <Field field={field} selectedCell={selectedCell} onSelect={handleSelectCell} />
            <GameTimer startedAt={startedAt} />
            <AvailableValues />
        </SafeAreaView>
    );
};
