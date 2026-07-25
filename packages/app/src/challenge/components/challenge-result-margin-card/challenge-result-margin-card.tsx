import { plural } from '@lingui/core/macro';
import { Trans, useLingui } from '@lingui/react/macro';
import { LucideBan, LucideMinus, LucideTurtle, LucideZap } from 'lucide-react-native';
import { use } from 'react';
import { Text, View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';
import { useChallengeResultMarginText } from '../../hooks/use-challenge-result-margin-text.hook';
import { ChallengeResult } from '../../interfaces/challenge-result.interface';
import { ChallengeResultScreenSelectors } from '../challenge-result-screen/challenge-result-screen.selectors';

import { ChallengeResultMarginCardStyles as styles } from './challenge-result-margin-card.styles';

import type { ChallengeDurationPartsInterface } from '../../interfaces/challenge-duration.interface';
import type { LucideIcon } from 'lucide-react-native';

const ICON_SIZE = 28;

interface Props {
    readonly durationParts: ChallengeDurationPartsInterface;
    readonly result: ChallengeResult;
    readonly lostByMistakes: boolean;
    readonly mistakes: number;
    readonly playerTimeText: string;
    readonly opponentTimeText: string;
}

export const ChallengeResultMarginCard = (props: Props) => {
    const { durationParts, result, lostByMistakes, mistakes, playerTimeText, opponentTimeText } = props;

    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const marginText = useChallengeResultMarginText(durationParts, result);
    const mistakesText = plural(mistakes, { one: '# mistake', other: '# mistakes' });

    let labelText = t`Result`;
    let valueText = marginText;
    let Icon: LucideIcon = LucideMinus;
    if (lostByMistakes) {
        labelText = t`Out of mistakes`;
        valueText = mistakesText;
        Icon = LucideBan;
    } else if (result === ChallengeResult.Won) {
        labelText = t`Winning margin`;
        Icon = LucideZap;
    } else if (result === ChallengeResult.Lost) {
        labelText = t`Time behind`;
        Icon = LucideTurtle;
    }

    const labelStyle = [styles.label, { color: theme.colors.label.hint }];
    const valueStyle = [styles.value, { color: theme.colors.label.main }];
    const captionStyle = [styles.caption, { color: theme.colors.label.hint }];
    const dividerStyle = [styles.divider, { backgroundColor: theme.colors.label.hint }];
    const timeLabelStyle = [styles.timeLabel, { color: theme.colors.label.hint }];
    const timeValueStyle = [styles.timeValue, { color: theme.colors.label.main }];

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.textColumn}>
                    <Text allowFontScaling={false} style={labelStyle}>
                        {labelText}
                    </Text>
                    <Text allowFontScaling={false} style={valueStyle} testID={ChallengeResultScreenSelectors.MarginValue}>
                        {valueText}
                    </Text>
                    {lostByMistakes ? (
                        <Text allowFontScaling={false} style={captionStyle}>
                            <Trans>Did not finish the board</Trans>
                        </Text>
                    ) : null}
                </View>
                <Icon color={theme.colors.label.main} size={ICON_SIZE} strokeWidth={2} />
            </View>

            <View style={dividerStyle} />

            <View style={styles.timesRow}>
                <View style={styles.timeSide}>
                    <Text allowFontScaling={false} style={timeLabelStyle}>
                        <Trans>You</Trans>
                    </Text>
                    <Text allowFontScaling={false} style={timeValueStyle} testID={ChallengeResultScreenSelectors.YourTimeValue}>
                        {playerTimeText}
                    </Text>
                </View>
                <View style={styles.timeSideEnd}>
                    <Text allowFontScaling={false} style={timeLabelStyle}>
                        <Trans>Rival</Trans>
                    </Text>
                    <Text allowFontScaling={false} style={timeValueStyle} testID={ChallengeResultScreenSelectors.OpponentTimeValue}>
                        {opponentTimeText}
                    </Text>
                </View>
            </View>
        </View>
    );
};
