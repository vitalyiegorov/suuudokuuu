import { i18n } from '@lingui/core';
import { t } from '@lingui/core/macro';
import { getI18n } from '@lingui/react/server';

import type { TierTechniqueReportInterface } from '../interfaces/tier-technique-report.interface';

const SE_RATING_DECIMALS = 1;

export const formatSeRatingRange = (
    report: Pick<TierTechniqueReportInterface, 'lowestRating' | 'highestRating' | 'ceilingRatedPuzzleCount'>
): string => {
    const lowestLabel = report.lowestRating.toFixed(SE_RATING_DECIMALS);
    const highestLabel = report.highestRating.toFixed(SE_RATING_DECIMALS);
    const ceilingSuffix = report.ceilingRatedPuzzleCount > 0 ? '+' : '';

    if (report.lowestRating === report.highestRating) {
        return `${lowestLabel}${ceilingSuffix}`;
    }

    return t(getI18n()?.i18n ?? i18n)`${lowestLabel} to ${highestLabel}${ceilingSuffix}`;
};
