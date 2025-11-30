import { useLingui } from '@lingui/react/macro';
import { LucideSwords } from 'lucide-react-native';
import { use } from 'react';
import { Text, View } from 'react-native';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { BlackText } from '../../../@generic/components/black-text/black-text';
import { Header } from '../../../@generic/components/header/header';
import { getTimerText } from '../../../@generic/utils/get-timer-text.util';
import { ThemeContext } from '../../../theme/context/theme.context';

import { ChallengeAcceptScreenStyles as styles } from './challenge-accept-screen.styles';

interface ChallengeAcceptScreenProps {
    readonly opponentTotalTime: number;
    readonly onAccept: () => void;
}

export const ChallengeAcceptScreen = ({ opponentTotalTime, onAccept }: ChallengeAcceptScreenProps) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    return (
        <View style={styles.container}>
            <LucideSwords color={theme.colors.label.main} size={48} style={styles.icon} />
            <Header text={t`Accept challenge?`} />

            <View style={styles.challengeInfo}>
                <BlackText>
                    <Text>{t`Your opponent completed this puzzle in`}</Text>
                </BlackText>
                <BlackText style={styles.opponentTime}>{getTimerText(opponentTotalTime)}</BlackText>
                <BlackText>
                    <Text>{t`Can you beat them?`}</Text>
                </BlackText>
            </View>

            <View style={styles.buttonsWrapper}>
                <BlackButton onPress={onAccept} text={t`Accept Challenge`} />
                <BlackButton href="/" text={t`Cancel`} />
            </View>
        </View>
    );
};
