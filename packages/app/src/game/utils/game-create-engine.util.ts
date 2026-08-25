import { FieldEngine } from '@suuudokuuu/field-core';

import type { GameState } from '../store/game.state';

export const gameCreateEngine = (
    state: Pick<GameState, 'candidates' | 'difficulty' | 'inputMode' | 'mistakes' | 'showAutoCandidates' | 'sudokuString'>
): FieldEngine => new FieldEngine({ ...state });
