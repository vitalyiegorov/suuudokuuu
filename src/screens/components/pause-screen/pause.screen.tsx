import { Text, View } from 'react-native';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { Donation } from '../../../@generic/components/donation/donation';
import { Header } from '../../../@generic/components/header/header';
import { useResumeGame } from '../../../game/hooks/use-resume-game.hook';

import { PauseScreenStyles } from './pause-screen.styles';

export const PauseScreen = () => {
    const handleResume = useResumeGame();

    return (
        <View style={PauseScreenStyles.container}>
            <Header text="Game paused" />
            <Text style={PauseScreenStyles.text} />
            <Donation type="paused" />
            <BlackButton onPress={handleResume} text="Resume" />
        </View>
    );
};
