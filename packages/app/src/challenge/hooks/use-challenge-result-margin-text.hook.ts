import { msg, plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';

import { isDefined } from '@rnw-community/shared';

import { ChallengeDurationUnit } from '../enums/challenge-duration-unit.enum';
import { ChallengeResult } from '../interfaces/challenge-result.interface';

import type { ChallengeDurationPartInterface, ChallengeDurationPartsInterface } from '../interfaces/challenge-duration.interface';
import type { MessageDescriptor } from '@lingui/core';

const getChallengeDurationPartMessage = (part: ChallengeDurationPartInterface): MessageDescriptor => {
    const { unit, value } = part;

    if (unit === ChallengeDurationUnit.DAY) {
        return msg({ message: plural(value, { one: '# day', other: '# days' }) });
    }

    if (unit === ChallengeDurationUnit.HOUR) {
        return msg({ message: plural(value, { one: '# hour', other: '# hours' }) });
    }

    if (unit === ChallengeDurationUnit.MINUTE) {
        return msg({ message: plural(value, { one: '# minute', other: '# minutes' }) });
    }

    return msg({ message: plural(value, { one: '# second', other: '# seconds' }) });
};

export const useChallengeResultMarginText = (durationParts: ChallengeDurationPartsInterface, result: ChallengeResult): string => {
    const { t } = useLingui();
    const { primary, secondary } = durationParts;
    const primaryText = t(getChallengeDurationPartMessage(primary));
    const secondaryText = isDefined(secondary) ? t(getChallengeDurationPartMessage(secondary)) : '';
    const durationText = isDefined(secondary) ? `${primaryText} ${secondaryText}` : primaryText;

    if (result === ChallengeResult.Tied) {
        return t`It was a tie`;
    }

    if (result === ChallengeResult.Won) {
        return t`${durationText} faster`;
    }

    return t`${durationText} slower`;
};
