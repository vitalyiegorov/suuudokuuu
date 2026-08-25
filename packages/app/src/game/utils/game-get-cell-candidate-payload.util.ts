import type { GameCellCandidatePayloadInterface } from '../interface/game-cell-candidate-payload.interface';
import type { FieldEngine } from '@suuudokuuu/field-core';
import type { CellInterface } from '@suuudokuuu/generator';

export const gameGetCellCandidatePayload = (engine: FieldEngine, cell: CellInterface): GameCellCandidatePayloadInterface => ({
    cell,
    candidates: engine.serialize().candidates
});
