import { DifficultyEnum } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import type { DifficultyBandInterface } from '../interfaces/difficulty-band.interface';

export const DIFFICULTY_BANDS: Record<DifficultyEnum, DifficultyBandInterface> = {
    [DifficultyEnum.Newbie]: {
        blankCells: 44,
        corpus: null,
        simplerLadderMaxTechnique: null,
        bandLadderMaxTechnique: SolutionTechniqueEnum.NakedSingle
    },
    [DifficultyEnum.Easy]: {
        blankCells: 50,
        corpus: null,
        simplerLadderMaxTechnique: SolutionTechniqueEnum.NakedSingle,
        bandLadderMaxTechnique: SolutionTechniqueEnum.HiddenSingle
    },
    [DifficultyEnum.Medium]: {
        blankCells: 54,
        corpus: null,
        simplerLadderMaxTechnique: SolutionTechniqueEnum.HiddenSingle,
        bandLadderMaxTechnique: SolutionTechniqueEnum.HiddenQuad
    },
    [DifficultyEnum.Hard]: {
        blankCells: 55,
        corpus: null,
        simplerLadderMaxTechnique: SolutionTechniqueEnum.HiddenQuad,
        bandLadderMaxTechnique: SolutionTechniqueEnum.WWing
    },
    [DifficultyEnum.Nightmare]: {
        blankCells: 56,
        corpus: null,
        simplerLadderMaxTechnique: SolutionTechniqueEnum.WWing,
        bandLadderMaxTechnique: SolutionTechniqueEnum.AIC
    },
    [DifficultyEnum.Hell]: {
        blankCells: 64,
        corpus: 'hell',
        simplerLadderMaxTechnique: SolutionTechniqueEnum.HiddenSingle,
        bandLadderMaxTechnique: null
    },
    [DifficultyEnum.Infinity]: {
        blankCells: 81,
        corpus: 'infinity',
        simplerLadderMaxTechnique: SolutionTechniqueEnum.HiddenSingle,
        bandLadderMaxTechnique: null
    }
};

export const PUZZLE_FORGE_MAX_ATTEMPTS = 64;

export const PUZZLE_FORGE_SEED_RANGE = 0x1_0000_0000;
