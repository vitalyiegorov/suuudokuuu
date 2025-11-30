import { useLingui } from '@lingui/react/macro';
import { useLocalSearchParams } from 'expo-router';
import { LucideSwords } from 'lucide-react-native';
import { use } from 'react';
import { Text, View } from 'react-native';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { BlackText } from '../../../@generic/components/black-text/black-text';
import { Header } from '../../../@generic/components/header/header';
import { getTimerText } from '../../../@generic/utils/get-timer-text.util';
import { GameContext } from '../../../game/context/game.context';
import { urlToGameState } from '../../../game/store/game.state';
import { ThemeContext } from '../../../theme/context/theme.context';

import { SharedScreenStyles as styles } from './shared-screen.styles';

export const SharedScreen = () => {
    const stateObject = useLocalSearchParams<Record<string, string>>();

    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const { createFromState } = use(GameContext);

    const [stateString] = Object.keys(stateObject);
    const { isChallengeMode, opponentTotalTime } = urlToGameState(stateString);

    const handleOpenPuzzle = () => {
        createFromState(stateString);
    };

    const headerText = isChallengeMode ? t`Accept challenge?` : t`Open shared puzzle?`;
    const buttonText = isChallengeMode ? t`Accept Challenge` : t`Open puzzle`;

    return (
        <View style={styles.container}>
            {isChallengeMode && <LucideSwords color={theme.colors.label.main} size={48} style={styles.icon} />}

            <Header text={headerText} />

            {isChallengeMode && (
                <View style={styles.challengeInfo}>
                    <BlackText>
                        <Text>{t`Your opponent completed this puzzle in`}</Text>
                    </BlackText>
                    <BlackText style={styles.opponentTime}>{getTimerText(opponentTotalTime)}</BlackText>
                    <BlackText>
                        <Text>{t`Can you beat them?`}</Text>
                    </BlackText>
                </View>
            )}

            <View style={styles.buttonsWrapper}>
                <BlackButton onPress={handleOpenPuzzle} text={buttonText} />
                <BlackButton href="/" text={t`Cancel`} />
            </View>
        </View>
    );
};
