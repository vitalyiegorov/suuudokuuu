import { isDefined } from '@rnw-community/shared';

import { isSolvableWithLadder } from './is-solvable-with-ladder.util';

import type { DifficultyBandInterface } from '../../@generic/interfaces/difficulty-band.interface';
import type { PuzzleBandMatchInterface } from '../../@generic/interfaces/puzzle-band-match.interface';

export const matchPuzzleBand = (puzzleString: string, band: DifficultyBandInterface): PuzzleBandMatchInterface => {
    const isAboveSimplerLadder =
        !isDefined(band.simplerLadderMaxTechnique) || !isSolvableWithLadder(puzzleString, band.simplerLadderMaxTechnique);

    if (!isAboveSimplerLadder) {
        return { isAboveSimplerLadder, isWithinBand: false };
    }

    const isWithinBand = !isDefined(band.bandLadderMaxTechnique) || isSolvableWithLadder(puzzleString, band.bandLadderMaxTechnique);

    return { isAboveSimplerLadder, isWithinBand };
};
