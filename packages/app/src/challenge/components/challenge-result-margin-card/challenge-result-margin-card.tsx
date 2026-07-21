import { plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { AppSurfaceCard } from '@suuudokuuu/ui';
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
}

export const ChallengeResultMarginCard = ({ durationParts, result, lostByMistakes, mistakes }: Props) => {
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

    const labelStyle = [styles.label, { color: theme.colors.white05 }];
    const valueStyle = [styles.value, { color: theme.colors.label.inverted }];

    return (
        <AppSurfaceCard size="compact" style={styles.card} variant="inverted">
            <View style={styles.textColumn}>
                <Text allowFontScaling={false} style={labelStyle}>
                    {labelText}
                </Text>
                <Text allowFontScaling={false} style={valueStyle} testID={ChallengeResultScreenSelectors.MarginValue}>
                    {valueText}
                </Text>
            </View>
            <Icon color={theme.colors.label.inverted} size={ICON_SIZE} strokeWidth={2} />
        </AppSurfaceCard>
    );
};
