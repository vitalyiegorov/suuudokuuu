import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BlackButton, Donation, Header, PageHeader } from '../../src/@generic';
import { useResumeGame } from '../../src/game';

import { PauseScreenStyles as styles } from './pause-screen.styles';

export default function PauseScreen() {
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
