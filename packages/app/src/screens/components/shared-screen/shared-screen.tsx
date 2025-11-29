import { useLingui } from '@lingui/react/macro';
import { useLocalSearchParams } from 'expo-router';
import { LucideSwords } from 'lucide-react-native';
import { use, useMemo } from 'react';
import { Text, View } from 'react-native';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { BlackText } from '../../../@generic/components/black-text/black-text';
import { Header } from '../../../@generic/components/header/header';
import { getTimerText } from '../../../@generic/utils/get-timer-text.util';
import { GameContext } from '../../../game/context/game.context';
import { ThemeContext } from '../../../theme/context/theme.context';

import { SharedScreenStyles as styles } from './shared-screen.styles';

import type { SerializedGameState } from '../../../game/store/game.state';

const parseSharedState = (stateString: string): { isChallenge: boolean; opponentTime: number } => {
    try {
        const input = JSON.parse(atob(stateString)) as SerializedGameState;
        const isChallenge = input.c === '1';
        let opponentTime = 0;

        if (isChallenge && input.h) {
            const stepLength = 6;
            for (let i = 0; i < input.h.length; i += stepLength) {
                const tsStr = input.h.substring(i + 3, i + stepLength);
                opponentTime += parseInt(tsStr, 10);
            }
        }

        return { isChallenge, opponentTime };
    } catch {
        return { isChallenge: false, opponentTime: 0 };
    }
};

export const SharedScreen = () => {
    const stateObject = useLocalSearchParams<Record<string, string>>();

    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const { createFromState } = use(GameContext);

    const [stateString] = Object.keys(stateObject);
    const { isChallenge, opponentTime } = useMemo(() => parseSharedState(stateString), [stateString]);

    const handleOpenPuzzle = () => {
        createFromState(stateString);
    };

    const headerText = isChallenge ? t`Accept challenge?` : t`Open shared puzzle?`;
    const buttonText = isChallenge ? t`Accept Challenge` : t`Open puzzle`;

    return (
        <View style={styles.container}>
            {isChallenge && <LucideSwords color={theme.colors.label.main} size={48} style={styles.icon} />}
            <Header text={headerText} />

            {isChallenge && (
                <View style={styles.challengeInfo}>
                    <BlackText>
                        <Text>{t`Your opponent completed this puzzle in`}</Text>
                    </BlackText>
                    <BlackText style={styles.opponentTime}>{getTimerText(opponentTime)}</BlackText>
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
