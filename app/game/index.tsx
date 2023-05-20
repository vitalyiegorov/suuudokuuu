import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Alert, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AvailableValues } from '../../components/available-values/available-values';
import { BlackButton } from '../../components/black-button/black-button';
import { Field } from '../../components/field/field';
import { MaxMistakesConstant } from '../../constants/max-mistakes.constant';
import { useAppSelector } from '../../hooks/redux.hook';
import { appRootFieldSelector, appRootMistakesSelector, appRootSelectedCellSelector } from '../../store/app-root/app-root.selectors';
import { hasBlankCells } from '../../utils/field/has-blank-cells.util';

import { GameStyles as styles } from './game.styles';

export default function Game() {
    const router = useRouter();

    const field = useAppSelector(appRootFieldSelector);
    const selectedCell = useAppSelector(appRootSelectedCellSelector);
    const mistakes = useAppSelector(appRootMistakesSelector);

    useEffect(() => {
        if (!hasBlankCells(field)[0]) {
            router.push('winner');
        }
    }, [field]);
    useEffect(() => {
        if (mistakes >= MaxMistakesConstant) {
            router.push('loser');
        }
    }, [mistakes]);

    const handleExit = () => {
        Alert.alert('Stop current run?', 'All progress will be lost', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'OK', onPress: () => void router.push('/') }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.controls}>
                <Text style={styles.mistakesText}>
                    Mistakes: <Text style={styles.mistakesCountText}>{mistakes}</Text>/{MaxMistakesConstant}
                </Text>
                <BlackButton text="Exit" onPress={handleExit} />
            </View>
            <Field field={field} selectedCell={selectedCell} />
            <AvailableValues />
        </SafeAreaView>
    );
}
