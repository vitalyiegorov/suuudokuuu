import { DifficultyEnum } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import type { DifficultyBandInterface } from '../interfaces/difficulty-band.interface';

export const DIFFICULTY_BANDS: Record<DifficultyEnum, DifficultyBandInterface> = {
    [DifficultyEnum.Newbie]: {
        blankCells: 44,
        isCorpusSourced: false,
        simplerLadderMaxTechnique: null,
        bandLadderMaxTechnique: SolutionTechniqueEnum.NakedSingle
    },
    [DifficultyEnum.Easy]: {
        blankCells: 50,
        isCorpusSourced: false,
        simplerLadderMaxTechnique: SolutionTechniqueEnum.NakedSingle,
        bandLadderMaxTechnique: SolutionTechniqueEnum.HiddenSingle
    },
    [DifficultyEnum.Medium]: {
        blankCells: 54,
        isCorpusSourced: false,
        simplerLadderMaxTechnique: SolutionTechniqueEnum.HiddenSingle,
        bandLadderMaxTechnique: SolutionTechniqueEnum.HiddenQuad
    },
    [DifficultyEnum.Hard]: {
        blankCells: 55,
        isCorpusSourced: false,
        simplerLadderMaxTechnique: SolutionTechniqueEnum.HiddenQuad,
        bandLadderMaxTechnique: SolutionTechniqueEnum.WWing
    },
    [DifficultyEnum.Nightmare]: {
        blankCells: 56,
        isCorpusSourced: false,
        simplerLadderMaxTechnique: SolutionTechniqueEnum.WWing,
        bandLadderMaxTechnique: SolutionTechniqueEnum.AIC
    },
    [DifficultyEnum.Hell]: {
        blankCells: 64,
        isCorpusSourced: true,
        simplerLadderMaxTechnique: SolutionTechniqueEnum.HiddenSingle,
        bandLadderMaxTechnique: null
    }
};

export const PUZZLE_FORGE_MAX_ATTEMPTS = 64;
