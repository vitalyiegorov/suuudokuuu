import type { TierTechniqueReportInterface } from '../../interfaces/tier-technique-report.interface';

const SE_RATING_DECIMALS = 1;

interface Props {
    report: TierTechniqueReportInterface;
}

export const SeRatingRange = ({ report }: Props) => {
    const lowestLabel = report.lowestRating.toFixed(SE_RATING_DECIMALS);
    const highestLabel = report.highestRating.toFixed(SE_RATING_DECIMALS);
    const ceilingSuffix = report.ceilingRatedPuzzleCount > 0 ? '+' : '';

    if (report.lowestRating === report.highestRating) {
        return `${lowestLabel}${ceilingSuffix}`;
    }

    return `${lowestLabel} to ${highestLabel}${ceilingSuffix}`;
};
