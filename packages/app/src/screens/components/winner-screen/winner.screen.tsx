import { Trans, useLingui } from '@lingui/react/macro';
import { useAppLayout } from '@suuudokuuu/ui';
import { Redirect } from 'expo-router';
import { Text, View } from 'react-native';

import { isNotEmptyString } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { Donation } from '../../../@generic/components/donation/donation';
import { Header } from '../../../@generic/components/header/header';
import { PlayAgainButton } from '../../../@generic/components/play-again-button/play-again-button';
import { useResetGame } from '../../../@generic/hooks/use-reset-game.hook';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { ChallengeShareButton } from '../../../challenge/components/challenge-share-button/challenge-share-button';

import { WinnerScreenStyles as styles } from './winner-screen.styles';

export const WinnerScreen = () => {
    const { t } = useLingui();
    const { sizeClass } = useAppLayout();

    const [isGameStarted, gameState] = useResetGame();
    const { score, elapsedTime, challengeState } = gameState;
    const elapsedTimeText = useTimerText(elapsedTime);

    if (!isGameStarted && elapsedTime === 0) {
        return <Redirect href="/" />;
    }

    return (
        <View style={styles.container(sizeClass)}>
            <View style={styles.summaryColumn(sizeClass)}>
                <Header text={t`Winners-winner, \n chicken dinner!`} />

                <View>
                    <BlackText adjustsFontSizeToFit minimumFontScale={0.68} numberOfLines={1}>
                        <Text>
                            <Trans>You have scored</Trans>{' '}
                        </Text>
                        <Text style={styles.boldText}>{score}</Text>{' '}
                    </BlackText>

                    <BlackText adjustsFontSizeToFit minimumFontScale={0.68} numberOfLines={1}>
                        <Text>
                            <Trans>It took you</Trans>
                        </Text>{' '}
                        <Text style={styles.boldText}>{elapsedTimeText}</Text>
                    </BlackText>
                </View>

                <Donation type="winner" />
            </View>

            <View style={styles.actionsColumn(sizeClass)}>
                {!isNotEmptyString(challengeState) && <ChallengeShareButton gameState={gameState} text={t`Challenge a Friend`} />}
                <PlayAgainButton />
            </View>
        </View>
    );
};
