import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BlackButton, Colors, Donation, Header, PageHeader } from '../@generic';
import { useResumeGame } from '../game';

export const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'space-evenly',
        padding: 20
    },
    text: {
        color: Colors.black
    }
});

export default function PausePage() {
    const handleResume = useResumeGame();

    return (
        <SafeAreaView style={styles.container}>
            <PageHeader title="Game paused" />
            <Header text="Game paused" />
            <Text style={styles.text} />
            <Donation type="paused" />
            <BlackButton onPress={handleResume} text="Resume" />
        </SafeAreaView>
    );
}
