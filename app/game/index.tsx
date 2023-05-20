import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AvailableValues } from '../../components/available-values/available-values';
import { BlackButton } from '../../components/black-button/black-button';
import { Field } from '../../components/field/field';
import { useAppSelector } from '../../hooks/redux.hook';
import { appRootFieldSelector, appRootSelectedCellSelector } from '../../store/app-root/app-root.selectors';
import { hasBlankCells } from '../../utils/field/has-blank-cells.util';

import { GameStyles as styles } from './game.styles';

export default function Game() {
    const router = useRouter();

    const field = useAppSelector(appRootFieldSelector);
    const selectedCell = useAppSelector(appRootSelectedCellSelector);

    useEffect(() => {
        if (!hasBlankCells(field)[0]) {
            router.push('winner');
        }
    }, [field]);

    const handleExit = () => {
        Alert.alert('Stop current run?', 'All progress will be lost', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'OK', onPress: () => void router.push('/') }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <BlackButton text="Exit" onPress={handleExit} />
            <Field field={field} selectedCell={selectedCell} />
            <AvailableValues />
        </SafeAreaView>
    );
}
