import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

import { WinnerStyles as styles } from './winner.styles';

export default function Winner() {
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Text style={styles.header}>Winner-winner, chicken dinner!</Text>
            <Link href="/" style={styles.button}>
                <Text>Play again</Text>
            </Link>
        </View>
    );
}
