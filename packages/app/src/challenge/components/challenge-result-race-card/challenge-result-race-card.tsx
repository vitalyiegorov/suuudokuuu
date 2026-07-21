import { Trans } from '@lingui/react/macro';
import { LucideSwords, LucideUser } from 'lucide-react-native';
import { use } from 'react';
import { Text, View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';
import { ChallengeResultScreenSelectors } from '../challenge-result-screen/challenge-result-screen.selectors';

import { ChallengeResultRaceCardStyles as styles } from './challenge-result-race-card.styles';

import type { ViewStyle } from 'react-native';

const AVATAR_ICON_SIZE = 18;
const MIN_SHARE = 0.12;
const MAX_SHARE = 0.88;
const FULL_SHARE = 1;
const FILL_OPACITY = 0.22;

interface Props {
    readonly playerTimeText: string;
    readonly opponentTimeText: string;
    readonly playerSeconds: number;
    readonly opponentSeconds: number;
    readonly playerFinished: boolean;
    readonly playerProgress: number;
    readonly lostByMistakes: boolean;
}

export const ChallengeResultRaceCard = (props: Props) => {
    const { playerTimeText, opponentTimeText, playerSeconds, opponentSeconds, playerFinished, playerProgress, lostByMistakes } = props;

    const { theme } = use(ThemeContext);

    const total = playerSeconds + opponentSeconds;
    const rawPlayerShare = total === 0 ? 0.5 : opponentSeconds / total;
    const speedPlayerShare = Math.min(Math.max(rawPlayerShare, MIN_SHARE), MAX_SHARE);
    const playerShare = playerFinished ? speedPlayerShare : Math.min(Math.max(playerProgress, 0), FULL_SHARE);

    const cardStyle = [styles.card, { backgroundColor: theme.colors.black }];
    const fillStyle: ViewStyle = { backgroundColor: theme.colors.label.inverted, opacity: FILL_OPACITY, width: `${playerShare * 100}%` };
    const fillStyles = [styles.fill, fillStyle];
    const playerAvatarStyle = [styles.avatar, { backgroundColor: theme.colors.label.inverted }];
    const opponentAvatarStyle = [styles.avatar, { backgroundColor: theme.colors.white05 }];
    const labelStyle = [styles.label, { color: theme.colors.white05 }];
    const playerTimeStyle = [styles.time, { color: theme.colors.label.inverted }];
    const opponentTimeStyle = [styles.time, { color: theme.colors.white05 }];
    const versusBadgeStyle = [styles.versusBadge, { backgroundColor: theme.colors.label.inverted }];
    const versusTextStyle = [styles.versusText, { color: theme.colors.black }];
    const captionStyle = [styles.caption, { color: theme.colors.white05 }];

    return (
        <View style={cardStyle}>
            <View style={fillStyles} />

            <View style={styles.row}>
                <View style={styles.side}>
                    <View style={playerAvatarStyle}>
                        <LucideUser color={theme.colors.black} size={AVATAR_ICON_SIZE} />
                    </View>
                    <Text style={labelStyle}>
                        <Trans>You</Trans>
                    </Text>
                    <Text style={playerTimeStyle} testID={ChallengeResultScreenSelectors.YourTimeValue}>
                        {playerTimeText}
                    </Text>
                </View>

                <View style={versusBadgeStyle}>
                    <Text style={versusTextStyle}>
                        <Trans>VS</Trans>
                    </Text>
                </View>

                <View style={styles.side}>
                    <View style={opponentAvatarStyle}>
                        <LucideSwords color={theme.colors.label.inverted} size={AVATAR_ICON_SIZE} />
                    </View>
                    <Text style={labelStyle}>
                        <Trans>Rival</Trans>
                    </Text>
                    <Text style={opponentTimeStyle} testID={ChallengeResultScreenSelectors.OpponentTimeValue}>
                        {opponentTimeText}
                    </Text>
                </View>
            </View>

            {lostByMistakes ? (
                <Text style={captionStyle}>
                    <Trans>Did not finish the board</Trans>
                </Text>
            ) : null}
        </View>
    );
};
