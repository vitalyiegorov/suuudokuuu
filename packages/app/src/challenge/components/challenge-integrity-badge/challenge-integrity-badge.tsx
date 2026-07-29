import { plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { LucideEye, LucideShieldCheck } from 'lucide-react-native';

import { isEmptyArray } from '@rnw-community/shared';

import { getChallengeAwaySeconds } from '../../utils/get-challenge-away-seconds.util';
import { ChallengeStatChip } from '../challenge-stat-chip/challenge-stat-chip';

import { ChallengeIntegrityBadgeSelectors } from './challenge-integrity-badge.selectors';

import type { ChallengeAwayRangeInterface } from '../../interfaces/challenge-away-range.interface';

interface Props {
    readonly ranges: ChallengeAwayRangeInterface[];
}

export const ChallengeIntegrityBadge = ({ ranges }: Props) => {
    const { t } = useLingui();

    const isClean = isEmptyArray(ranges);
    const awaySeconds = getChallengeAwaySeconds(ranges);
    const breaksText = plural(ranges.length, { one: '# break', other: '# breaks' });
    const awayText = t`${awaySeconds}s away`;
    const badgeText = isClean ? t`Uninterrupted run` : `${breaksText} · ${awayText}`;
    const badgeIcon = isClean ? LucideShieldCheck : LucideEye;

    return <ChallengeStatChip icon={badgeIcon} testID={ChallengeIntegrityBadgeSelectors.Root} text={badgeText} />;
};
