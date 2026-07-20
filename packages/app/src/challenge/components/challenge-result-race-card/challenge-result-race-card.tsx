import { Trans, useLingui } from '@lingui/react/macro';
import { AppSurfaceCard } from '@suuudokuuu/ui';
import { use } from 'react';
import { Text, View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';
import { ChallengeResult as ChallengeResultValue } from '../../interfaces/challenge-result.interface';
import { ChallengeResultMargin } from '../challenge-result-margin/challenge-result-margin';
import { ChallengeResultScreenSelectors } from '../challenge-result-screen/challenge-result-screen.selectors';

import { ChallengeResultRaceCardStyles as styles } from './challenge-result-race-card.styles';

import type { ChallengeDurationPartsInterface } from '../../interfaces/challenge-duration.interface';
import type { ChallengeResult } from '../../interfaces/challenge-result.interface';

interface Props {
    readonly durationParts: ChallengeDurationPartsInterface;
    readonly opponentTimeText: string;
    readonly playerTimeText: string;
    readonly result: ChallengeResult;
}

export const ChallengeResultRaceCard = ({ durationParts, opponentTimeText, playerTimeText, result }: Props) => {
    const { theme } = use(ThemeContext);
    const { t } = useLingui();
    const labelStyles = [styles.label, { color: theme.colors.label.inverted }];
    const timeStyles = [styles.time, { color: theme.colors.label.inverted }];
    const finishLineStyles = [styles.finishLine, { borderTopColor: theme.colors.white05 }];
    let marginLabel = t`Dead heat`;

    if (result === ChallengeResultValue.Won) {
        marginLabel = t`Winning margin`;
    }

    if (result === ChallengeResultValue.Lost) {
        marginLabel = t`Time behind`;
    }

    return (
        <AppSurfaceCard size="compact" style={styles.container} variant="inverted">
            <Text style={labelStyles}>{marginLabel}</Text>

            <ChallengeResultMargin durationParts={durationParts} result={result} />

            <View style={finishLineStyles} />

            <View style={styles.timesRow}>
                <View style={styles.timeColumn}>
                    <Text style={labelStyles}>
                        <Trans>Your time</Trans>
                    </Text>
                    <Text style={timeStyles} testID={ChallengeResultScreenSelectors.YourTimeValue}>
                        {playerTimeText}
                    </Text>
                </View>

                <View style={styles.timeColumn}>
                    <Text style={labelStyles}>
                        <Trans>Opponent time</Trans>
                    </Text>
                    <Text style={timeStyles} testID={ChallengeResultScreenSelectors.OpponentTimeValue}>
                        {opponentTimeText}
                    </Text>
                </View>
            </View>
        </AppSurfaceCard>
    );
};
