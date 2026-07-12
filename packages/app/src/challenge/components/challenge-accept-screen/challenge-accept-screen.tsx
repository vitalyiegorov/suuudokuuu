import { Trans, useLingui } from '@lingui/react/macro';
import { useAppLayout } from '@suuudokuuu/ui';
import { LucideSwords } from 'lucide-react-native';
import { use } from 'react';
import { Text, View } from 'react-native';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { BlackText } from '../../../@generic/components/black-text/black-text';
import { Header } from '../../../@generic/components/header/header';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { ThemeContext } from '../../../theme/context/theme.context';

import { ChallengeAcceptScreenSelectors } from './challenge-accept-screen.selectors';
import { ChallengeAcceptScreenStyles as styles } from './challenge-accept-screen.styles';

interface Props {
    readonly opponentTotalTime: number;
    readonly onAccept: () => void;
}

export const ChallengeAcceptScreen = ({ opponentTotalTime, onAccept }: Props) => {
    const { t } = useLingui();
    const { sizeClass } = useAppLayout();
    const { theme } = use(ThemeContext);
    const opponentTotalTimeText = useTimerText(opponentTotalTime);

    return (
        <View style={styles.container(sizeClass)}>
            <View style={styles.summaryColumn(sizeClass)}>
                <LucideSwords color={theme.colors.label.main} size={48} style={styles.icon} />
                <Header text={t`Accept challenge?`} />

                <View style={styles.challengeInfo}>
                    <BlackText>
                        <Text>
                            <Trans>Your opponent completed this puzzle in</Trans>
                        </Text>
                    </BlackText>
                    <BlackText style={styles.opponentTime}>{opponentTotalTimeText}</BlackText>
                    <BlackText>
                        <Text>
                            <Trans>Can you beat them?</Trans>
                        </Text>
                    </BlackText>
                </View>
            </View>

            <View style={styles.buttonsWrapper(sizeClass)}>
                <BlackButton onPress={onAccept} testID={ChallengeAcceptScreenSelectors.AcceptButton} text={t`Accept Challenge`} />
                <BlackButton href="/" text={t`Cancel`} />
            </View>
        </View>
    );
};
