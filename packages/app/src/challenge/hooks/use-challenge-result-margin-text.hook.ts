import { plural, t } from '@lingui/core/macro';

import { isDefined } from '@rnw-community/shared';

import { ChallengeDurationUnit } from '../interfaces/challenge-duration.interface';
import { ChallengeResult } from '../interfaces/challenge-result.interface';

import type { ChallengeDurationPartInterface, ChallengeDurationPartsInterface } from '../interfaces/challenge-duration.interface';
import type { ChallengeResult as ChallengeResultType } from '../interfaces/challenge-result.interface';

const getChallengeDurationPartText = (part: ChallengeDurationPartInterface): string => {
    const { unit, value } = part;

    if (unit === ChallengeDurationUnit.Day) {
        return plural(value, { one: '# day', other: '# days' });
    }

    if (unit === ChallengeDurationUnit.Hour) {
        return plural(value, { one: '# hour', other: '# hours' });
    }

    if (unit === ChallengeDurationUnit.Minute) {
        return plural(value, { one: '# minute', other: '# minutes' });
    }

    return plural(value, { one: '# second', other: '# seconds' });
};

export const useChallengeResultMarginText = (durationParts: ChallengeDurationPartsInterface, result: ChallengeResultType): string => {
    const { primary, secondary } = durationParts;
    const primaryText = getChallengeDurationPartText(primary);
    const secondaryText = isDefined(secondary) ? getChallengeDurationPartText(secondary) : '';
    const durationText = isDefined(secondary) ? `${primaryText} ${secondaryText}` : primaryText;

    if (result === ChallengeResult.Tied) {
        return t`It was a tie`;
    }

    if (result === ChallengeResult.Won) {
        return t`${durationText} faster`;
    }

    return t`${durationText} slower`;
};
