import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BlackButton, Donation, Header, PageHeader, useAppDispatch } from '../../src/@generic';
import { gameResumeAction } from '../../src/game/store/game.actions';

import { PauseScreenStyles as styles } from './pause-screen.styles';
export default function PauseScreen() {
    const dispatch = useAppDispatch();

    const handleResume = () => void dispatch(gameResumeAction());

    return (
        <SafeAreaView style={styles.container}>
            <PageHeader title="Game paused" />
            <Header text="Game paused" />
            <Text style={styles.text} />
            <Donation type="paused" />
            <BlackButton href="game" onPress={handleResume} text="Resume" />
        </SafeAreaView>
    );
}
