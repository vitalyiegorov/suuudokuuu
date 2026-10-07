import { assert, describe, it } from '@effect/vitest';
import { FieldEngine, findHintStepScript } from '@suuudokuuu/field-core';
import { DifficultyEnum } from '@suuudokuuu/generator';
import * as Effect from 'effect/Effect';
import * as Option from 'effect/Option';
import * as Struct from 'effect/Struct';

import { initialCurrentRun } from '../../src/current-run/constant/initial-current-run.constant';
import { CurrentRunRepository } from '../../src/current-run/repository/current-run.repository';
import { CurrentRunService } from '../../src/current-run/service/current-run.service';
import { ProgressTestLayer } from '../progress-test.layer';

const board = '000070940070090005300005070087400100463080000000007080800700000700000028050268000';

describe('committed hint deductions', () => {
    it.effect.each(['no notes', 'pencil notes', 'auto candidates'])('survive resume and undo/redo with %s', noteMode =>
        Effect.gen(function* () {
            const repository = yield* CurrentRunRepository;
            const service = yield* CurrentRunService;
            const engine = new FieldEngine({
                sudokuString: board,
                difficulty: DifficultyEnum.Medium,
                showAutoCandidates: noteMode === 'auto candidates'
            });

            if (noteMode === 'pencil notes') {
                for (const cell of engine.Sudoku.Field.flat().filter(fieldCell => engine.Sudoku.isBlankCell(fieldCell))) {
                    for (const value of engine.Sudoku.getCellCandidates(cell)) {
                        engine.toggleCandidate(cell, value);
                    }
                }
            }

            yield* repository.save({ ...initialCurrentRun, ...engine.serialize() });

            const firstScript = findHintStepScript(engine.Sudoku);

            assert.isNotNull(firstScript);

            assert.isUndefined(firstScript.placement);

            engine.startStepScript(firstScript);
            yield* service.hint(firstScript.eliminations);
            engine.applyStepScript();

            const progressedState = engine.serialize();
            const nextScript = findHintStepScript(engine.Sudoku, progressedState.eliminatedCandidates);

            assert.isNotNull(nextScript);
            assert.notDeepEqual(nextScript.eliminations, firstScript.eliminations);
            assert.deepStrictEqual(Option.getOrThrow(yield* repository.get).eliminatedCandidates, progressedState.eliminatedCandidates);

            engine.undo();
            yield* service.undo(Struct.pick(engine.serialize(), ['sudokuString', 'candidates', 'eliminatedCandidates']));

            assert.deepStrictEqual(Option.getOrThrow(yield* repository.get).eliminatedCandidates, {});

            engine.redo();
            yield* service.redo(Struct.pick(engine.serialize(), ['sudokuString', 'candidates', 'eliminatedCandidates']));

            const persistedRun = Option.getOrThrow(yield* repository.get);
            const restored = new FieldEngine({
                ...persistedRun,
                candidates: Object.fromEntries(Object.entries(persistedRun.candidates).map(([key, values]) => [key, [...values]])),
                eliminatedCandidates: Object.fromEntries(
                    Object.entries(persistedRun.eliminatedCandidates).map(([key, values]) => [key, [...values]])
                )
            });

            assert.deepStrictEqual(restored.serialize(), progressedState);
            assert.isFalse(restored.getSnapshot().canUndo);
            assert.deepStrictEqual(findHintStepScript(restored.Sudoku, restored.getSnapshot().eliminatedCandidates), nextScript);
        }).pipe(Effect.provide(ProgressTestLayer))
    );
});
