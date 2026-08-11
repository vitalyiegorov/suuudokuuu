import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { isDefined } from '@rnw-community/shared';

import { DIFFICULTY_LADDER } from '../../difficulty/constants/difficulty-name.constant';
import { getDifficultyClueCount } from '../../difficulty/utils/get-difficulty-clue-count.util';
import { RATING_SAMPLE_PUZZLES } from '../constants/rating-sample.constant';
import { TECHNIQUE_LADDER } from '../constants/technique-ladder.constant';

import { solvePuzzleLogically } from './solve-puzzle-logically.util';

import type { LogicalSolveResultInterface } from '../interfaces/logical-solve-result.interface';
import type { TierTechniqueReportInterface } from '../interfaces/tier-technique-report.interface';
import type { DifficultyEnum } from '@suuudokuuu/generator';

const SINGLES_CEILING = SolutionTechniqueEnum.HiddenSingle;

const isSinglesOnly = (result: LogicalSolveResultInterface): boolean =>
    !result.isBeyondTechniqueLadder && result.hardestTechnique <= SINGLES_CEILING;

const findTypicalHardestTechnique = (results: LogicalSolveResultInterface[]): SolutionTechniqueEnum => {
    const ranked = TECHNIQUE_LADDER.map(technique => ({
        technique,
        puzzleCount: results.filter(result => result.hardestTechnique === technique).length
    })).sort((first, second) => second.puzzleCount - first.puzzleCount);
    const [top] = ranked;

    return top.technique;
};

const buildTierTechniqueReport = (difficulty: DifficultyEnum): TierTechniqueReportInterface => {
    const results = RATING_SAMPLE_PUZZLES[difficulty].map(solvePuzzleLogically);
    const reached = TECHNIQUE_LADDER.filter(technique => results.some(result => result.hardestTechnique === technique));

    return {
        difficulty,
        clueCount: getDifficultyClueCount(difficulty),
        sampleSize: results.length,
        singlesOnlyPuzzleCount: results.filter(isSinglesOnly).length,
        beyondLadderPuzzleCount: results.filter(result => result.isBeyondTechniqueLadder).length,
        typicalHardestTechnique: findTypicalHardestTechnique(results),
        hardestTechniqueReached: reached.at(-1) ?? SolutionTechniqueEnum.Guess,
        techniqueUsages: TECHNIQUE_LADDER.map(technique => ({
            technique,
            puzzleCount: results.filter(result => result.requiredTechniques.includes(technique)).length
        }))
    };
};

let cachedReports: TierTechniqueReportInterface[] | null = null;

export const getTierTechniqueReports = (): TierTechniqueReportInterface[] => {
    cachedReports ??= DIFFICULTY_LADDER.map(buildTierTechniqueReport);

    return cachedReports;
};

export const getTierTechniqueReport = (difficulty: DifficultyEnum): TierTechniqueReportInterface => {
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
