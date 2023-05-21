import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { BlackButton } from '../../components/black-button/black-button';
import { Header } from '../../components/header/header';

import { WinnerStyles as styles } from './winner.styles';

export default function Winner() {
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Header text="Winner-winner, chicken dinner!" />
            <BlackButton text={'Play again'} href={'/'} />
        </View>
    );
}