import { GameStateSerializer, SharedPayloadKindEnum } from '@suuudokuuu/encoder';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { SITE_ORIGIN } from '../../seo/constants/site.constant';

import type { SerializedPuzzleInterface } from '@suuudokuuu/puzzle-forge';

const SHARED_PUZZLE_MAX_MISTAKES = 3;
const RATING_WIRE_SCALE = 10;

export const buildSharedPuzzleUrl = (
    { isRatingCeiling, rating, sudokuString }: Pick<SerializedPuzzleInterface, 'isRatingCeiling' | 'rating' | 'sudokuString'>,
    difficulty: DifficultyEnum
): string => {
    const payload = new GameStateSerializer().encodeState({
        field: sudokuString,
        timelineEvents: [],
        kind: SharedPayloadKindEnum.Puzzle,
        maxMistakes: SHARED_PUZZLE_MAX_MISTAKES,
        isChallengeRun: false,
        score: 0,
        candidates: {},
        anchorSeconds: 0,
        pencilCount: null,
        screenshotCount: null,
        rating: Math.round(rating * RATING_WIRE_SCALE),
        isRatingCeiling,
        difficulty: Object.values(DifficultyEnum).indexOf(difficulty)
    });

    return `${SITE_ORIGIN}/shared/${payload}`;
};
