import { assert, describe, it } from '@effect/vitest';
import { DifficultyEnum } from '@suuudokuuu/generator';
import * as Effect from 'effect/Effect';

import { FieldEngine } from '../../../src/field-engine/classes/field-engine';

const solutionString = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';
const sudokuString = `.3.${solutionString.slice(3)}`;

describe('FieldEngine supplied solution', () => {
    it.effect('preserves initial snapshots and candidates', () =>
        Effect.sync(() => {
            const options = { sudokuString, difficulty: DifficultyEnum.Newbie, showAutoCandidates: true };
            const existing = new FieldEngine(options);
            const restored = new FieldEngine({ ...options, solutionString });

            assert.deepEqual(restored.getSnapshot(), existing.getSnapshot());
            assert.deepEqual(
                restored.getCellCandidates(restored.Sudoku.Field[0][0]),
                existing.getCellCandidates(existing.Sudoku.Field[0][0])
            );
        })
    );

    it.effect('preserves moves, mistakes and undo behavior', () =>
        Effect.sync(() => {
            const existing = new FieldEngine({ sudokuString, difficulty: DifficultyEnum.Newbie });
            const restored = new FieldEngine({ sudokuString, difficulty: DifficultyEnum.Newbie, solutionString });

            for (const engine of [existing, restored]) {
                engine.placeValue(engine.Sudoku.Field[0][0], 4);
                engine.placeValue(engine.Sudoku.Field[0][0], 5);
            }
            assert.deepEqual(restored.getSnapshot(), existing.getSnapshot());
            assert.isTrue(existing.undo());
            assert.isTrue(restored.undo());
            assert.deepEqual(restored.getSnapshot(), existing.getSnapshot());
            assert.isTrue(existing.redo());
            assert.isTrue(restored.redo());
            assert.deepEqual(restored.getSnapshot(), existing.getSnapshot());
        })
    );

    it.effect('rejects a supplied solution that contradicts the puzzle', () =>
        Effect.sync(() => {
            assert.throws(
                () =>
                    new FieldEngine({ sudokuString, difficulty: DifficultyEnum.Newbie, solutionString: '1'.repeat(solutionString.length) }),
                'Invalid solution string'
            );
        })
    );
});
