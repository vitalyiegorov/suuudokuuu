import { plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { LucideEye, LucideShieldCheck } from 'lucide-react-native';
import { use } from 'react';
import { Text, View } from 'react-native';

import { isEmptyArray } from '@rnw-community/shared';

import { ThemeContext } from '../../../theme/context/theme.context';
import { getChallengeAwaySeconds } from '../../utils/get-challenge-away-seconds.util';

import { ChallengeIntegrityBadgeSelectors } from './challenge-integrity-badge.selectors';
import { ChallengeIntegrityBadgeStyles as styles } from './challenge-integrity-badge.styles';

import type { ChallengeAwayRangeInterface } from '../../interfaces/challenge-away-range.interface';

const IconSize = 13;

interface Props {
    readonly ranges: ChallengeAwayRangeInterface[];
}

export const ChallengeIntegrityBadge = ({ ranges }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const isClean = isEmptyArray(ranges);
    const awaySeconds = getChallengeAwaySeconds(ranges);
    const breaksText = plural(ranges.length, { one: '# break', other: '# breaks' });
    const awayText = t`${awaySeconds}s away`;
    const badgeText = isClean ? t`Uninterrupted run` : `${breaksText} · ${awayText}`;

    const badgeStyle = [styles.badge, { borderColor: theme.colors.value.border }];
    const textStyle = [styles.text, { color: theme.colors.label.hint }];
    const icon = isClean ? (
        <LucideShieldCheck color={theme.colors.label.hint} size={IconSize} />
    ) : (
        <LucideEye color={theme.colors.label.hint} size={IconSize} />
    );

    return (
        <View style={badgeStyle} testID={ChallengeIntegrityBadgeSelectors.Root}>
            {icon}

            <Text allowFontScaling={false} style={textStyle}>
                {badgeText}
            </Text>
        </View>
    );
};
