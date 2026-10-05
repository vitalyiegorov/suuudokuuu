import { DIFFICULTY_BANDS } from '@suuudokuuu/puzzle-forge';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { DIFFICULTY_LADDER } from '../../difficulty/constants/difficulty-name.constant';
import { getDifficultyClueCount } from '../../difficulty/utils/get-difficulty-clue-count.util';
import { TECHNIQUE_LADDER } from '../constants/technique-ladder.constant';

import { solvePuzzleLogically } from './solve-puzzle-logically.util';

import type { LandingDifficultyType } from '../../difficulty/types/landing-difficulty.type';
import type { LogicalSolveResultInterface } from '../interfaces/logical-solve-result.interface';
import type { RatedSamplePuzzleInterface } from '../interfaces/rated-sample-puzzle.interface';
import type { TierTechniqueReportInterface } from '../interfaces/tier-technique-report.interface';

const SINGLES_CEILING = SolutionTechniqueEnum.HiddenSingle;

const isSinglesOnly = (result: LogicalSolveResultInterface): boolean =>
    !result.isBeyondTechniqueLadder && result.hardestTechnique <= SINGLES_CEILING;

const countGivens = (puzzle: string): number => puzzle.length - puzzle.replaceAll(/[^.]/gu, '').length;

const findTypicalHardestTechnique = (results: LogicalSolveResultInterface[]): SolutionTechniqueEnum => {
    const ranked = TECHNIQUE_LADDER.map(technique => ({
        technique,
        puzzleCount: results.filter(result => result.hardestTechnique === technique).length
    })).sort((first, second) => second.puzzleCount - first.puzzleCount);
    const [top] = ranked;

    return top.technique;
};

const buildTierTechniqueReport = (
    difficulty: LandingDifficultyType,
    sample: RatedSamplePuzzleInterface[]
): TierTechniqueReportInterface => {
    const results = sample.map(entry => solvePuzzleLogically(entry.puzzle));
    const reached = TECHNIQUE_LADDER.filter(technique => results.some(result => result.hardestTechnique === technique));
    const ratings = sample.map(entry => entry.rating);
    const band = DIFFICULTY_BANDS[difficulty];

    return {
        difficulty,
        clueCount: getDifficultyClueCount(difficulty),
        highestClueCount: Math.max(...sample.map(entry => countGivens(entry.puzzle))),
        simplerLadderMaxTechnique: band.simplerLadderMaxTechnique,
        bandLadderMaxTechnique: band.bandLadderMaxTechnique,
        lowestRating: Math.min(...ratings),
        highestRating: Math.max(...ratings),
        ceilingRatedPuzzleCount: sample.filter(entry => entry.isRatingCeiling).length,
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

export const buildTierTechniqueReports = (samples: RatedSamplePuzzleInterface[][]): TierTechniqueReportInterface[] =>
    DIFFICULTY_LADDER.map((difficulty, index) => buildTierTechniqueReport(difficulty, samples[index]));
