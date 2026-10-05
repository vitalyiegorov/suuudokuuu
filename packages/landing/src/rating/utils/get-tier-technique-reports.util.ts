import { isDefined } from '@rnw-community/shared';

import { TIER_TECHNIQUE_REPORTS } from '../constants/tier-technique-reports.constant';

import type { LandingDifficultyType } from '../../difficulty/types/landing-difficulty.type';
import type { TierTechniqueReportInterface } from '../interfaces/tier-technique-report.interface';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export const getTierTechniqueReports = (): TierTechniqueReportInterface[] => TIER_TECHNIQUE_REPORTS;

export const getTierTechniqueReport = (difficulty: LandingDifficultyType): TierTechniqueReportInterface => {
    const report = getTierTechniqueReports().find(tierReport => tierReport.difficulty === difficulty);

    if (!isDefined(report)) {
        throw new Error(`No generated technique report for the ${difficulty} tier`);
    }

    return report;
};

export const getTechniqueUsage = (report: TierTechniqueReportInterface, technique: SolutionTechniqueEnum): number => {
    const usage = report.techniqueUsages.find(techniqueUsage => techniqueUsage.technique === technique);

    return usage?.puzzleCount ?? 0;
};
