import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AvailableValues } from '../../components/available-values/available-values';
import { BlackButton } from '../../components/black-button/black-button';
import { Field } from '../../components/field/field';
import { MaxMistakesConstant } from '../../constants/max-mistakes.constant';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hook';
import { type CellInterface } from '../../interfaces/cell.interface';
import { appRootSelectCellAction } from '../../store/app-root/app-root.actions';
import { appRootFieldSelector, appRootMistakesSelector, appRootSelectedCellSelector } from '../../store/app-root/app-root.selectors';
import { hasBlankCells } from '../../utils/field/has-blank-cells.util';

import { GameStyles as styles } from './game.styles';

export default function Game() {
    const router = useRouter();

    const dispatch = useAppDispatch();
    const field = useAppSelector(appRootFieldSelector);
    const selectedCell = useAppSelector(appRootSelectedCellSelector);
    const mistakes = useAppSelector(appRootMistakesSelector);

    const handleWin = async () => {
        if (!hasBlankCells(field)[0]) {
            await Haptics.impactAsync(ImpactFeedbackStyle.Heavy);
            router.push('winner');
        }
    };
    const handleLose = async () => {
        if (mistakes >= MaxMistakesConstant) {
            await Haptics.impactAsync(ImpactFeedbackStyle.Heavy);
            router.push('loser');
        }
    };

    useEffect(() => void handleWin(), [field]);
    useEffect(() => void handleLose(), [mistakes]);

    const handleExit = () => {
        Alert.alert('Stop current run?', 'All progress will be lost', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'OK', onPress: () => void router.push('/') }
        ]);
    };
    const handleSelectCell = useCallback((cell: CellInterface | undefined) => void dispatch(appRootSelectCellAction(cell)), []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.controls}>
                <Text style={styles.mistakesText}>
                    Mistakes: <Text style={styles.mistakesCountText}>{mistakes}</Text>/{MaxMistakesConstant}
                </Text>
                <BlackButton text="Exit" onPress={handleExit} />
            </View>
            <Field field={field} selectedCell={selectedCell} onSelect={handleSelectCell} />
            <AvailableValues />
        </SafeAreaView>
    );
}
