import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { BlackButton } from '../../components/black-button/black-button';
import { Header } from '../../components/header/header';

import { LoserStyles as styles } from './loser.styles';

export default function Loser() {
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Header text="Better next time! Loooooser =)" />
            <BlackButton text={'Play again'} href={'/'} />
        </View>
    );
}
