import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BlackButton } from '../@generic/components/black-button/black-button';
import { Donation } from '../@generic/components/donation/donation';
import { Header } from '../@generic/components/header/header';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { Colors } from '../@generic/styles/theme';
import { useResumeGame } from '../game/hooks/use-resume-game.hook';

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
