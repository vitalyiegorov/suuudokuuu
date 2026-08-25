import type { GameState } from '../store/game.state';
import type { FieldEngine } from '@suuudokuuu/field-core';

export const gameGetInputStatePayload = (engine: FieldEngine): Pick<GameState, 'inputMode' | 'showAutoCandidates'> => {
    const { inputMode, showAutoCandidates } = engine.serialize();

    return { inputMode, showAutoCandidates };
};
