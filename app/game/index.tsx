import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';

import { AvailableValues } from '../../components/available-values/available-values';
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

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Field field={field} selectedCell={selectedCell} />
            <AvailableValues />
        </View>
    );
}
