/* eslint-disable react-native/no-raw-text */
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Alert } from '../../components/alert/alert';
import { AvailableValues } from '../../components/available-values/available-values';
import { BlackButton } from '../../components/black-button/black-button';
import { ElapsedTime } from '../../components/elapsed-time/elapsed-time';
import { Field } from '../../components/field/field';
import { PageHeader } from '../../components/page-header/page-header';
import { MaxMistakesConstant } from '../../constants/max-mistakes.constant';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hook';
import { type CellInterface } from '../../interfaces/cell.interface';
import { appRootFinishAction, appRootSelectCellAction } from '../../store/app-root/app-root.actions';
import {
    appRootFieldSelector,
    appRootGameStartedAtSelector,
    appRootMistakesSelector,
    appRootScoreSelector,
    appRootSelectedCellSelector
} from '../../store/app-root/app-root.selectors';
import { hasBlankCells } from '../../utils/field/has-blank-cells.util';
import { hapticImpact } from '../../utils/haptic.utils';

import { GameStyles as styles } from './game.styles';

export default function Game() {
    const router = useRouter();

    const dispatch = useAppDispatch();
    const field = useAppSelector(appRootFieldSelector);
    const selectedCell = useAppSelector(appRootSelectedCellSelector);
    const mistakes = useAppSelector(appRootMistakesSelector);
    const currentScore = useAppSelector(appRootScoreSelector);
    const startedAt = useAppSelector(appRootGameStartedAtSelector);

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
                    dispatch(appRootFinishAction());
                    router.push('/');
                }
            }
        ]);
    };

    useEffect(() => void handleWin(), [field]);
    useEffect(() => void handleLose(), [mistakes]);

    const handleSelectCell = useCallback((cell: CellInterface | undefined) => void dispatch(appRootSelectCellAction(cell)), []);

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
            <ElapsedTime startedAt={startedAt} />
            <AvailableValues />
        </SafeAreaView>
    );
}
