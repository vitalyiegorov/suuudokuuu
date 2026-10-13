import { DifficultyEnum } from '@suuudokuuu/generator';
import { describe, expect, it } from 'vitest';

import { FieldEngine } from '../../../src/field-engine/classes/field-engine';
import { findStepScript } from '../../../src/step-script/utils/find-step-script.util';

const sudokuString = '.3.678912672195348198342567.59761423426853791713924856961537284287419635345286179';

describe('FieldEngine history invariants', () => {
    it('ignores missing notes and preserves other notes when toggling with undo', () => {
        const engine = new FieldEngine({ sudokuString, difficulty: DifficultyEnum.Newbie });
        const [[cell]] = engine.getSnapshot().field;

        engine.removeCandidate(cell, 5);
        expect(engine.getSnapshot().candidates).toEqual({});
        expect(engine.getSnapshot().canUndo).toBe(false);
        engine.toggleCandidate(cell, 5);
        engine.toggleCandidate(cell, 3);
        engine.toggleCandidate(cell, 5);
        expect(engine.getSnapshot().candidates['0-0']).toEqual([3]);
        expect(engine.undo()).toBe(true);
        expect(engine.getSnapshot().candidates['0-0']).toEqual([5, 3]);
    });

    it('keeps mistakes when undoing and redoing a correct placement', () => {
        const engine = new FieldEngine({ sudokuString, difficulty: DifficultyEnum.Newbie });

        engine.placeValue(engine.getSnapshot().field[0][0], 4);
        engine.placeValue(engine.getSnapshot().field[0][0], 5);
        expect(engine.undo()).toBe(true);
        expect(engine.getSnapshot().mistakes).toBe(1);
        expect(engine.getSnapshot().field[0][0].value).toBe(0);
        expect(engine.redo()).toBe(true);
        expect(engine.getSnapshot().mistakes).toBe(1);
        expect(engine.getSnapshot().field[0][0].value).toBe(5);
    });

    it('redoes the placement of an applied hint without restarting its player', () => {
        const engine = new FieldEngine({ sudokuString, difficulty: DifficultyEnum.Newbie });
        const script = findStepScript(engine.Sudoku);

        expect(script).not.toBeNull();
        if (script === null) {
            return;
        }

        engine.startStepScript(script);
        engine.applyStepScript();
        const appliedString = engine.getSnapshot().sudokuString;

        expect(engine.undo()).toBe(true);
        expect(engine.getSnapshot().sudokuString).toBe(sudokuString);
        expect(engine.redo()).toBe(true);
        expect(engine.getSnapshot().sudokuString).toBe(appliedString);
        expect(engine.getSnapshot().stepScript).toBeNull();
    });

    it('preserves previously published grid and notes across subsequent mutations', () => {
        const engine = new FieldEngine({ sudokuString, difficulty: DifficultyEnum.Newbie });

        engine.toggleCandidate(engine.getSnapshot().field[0][0], 5);
        const previousSnapshot = engine.getSnapshot();

        engine.placeValue(previousSnapshot.field[0][0], 5);
        engine.undo();
        engine.toggleCandidate(engine.getSnapshot().field[0][0], 4);
        expect(previousSnapshot.sudokuString).toBe(sudokuString);
        expect(previousSnapshot.field[0][0].value).toBe(0);
        expect(previousSnapshot.candidates['0-0']).toEqual([5]);
        expect(engine.getSnapshot().candidates['0-0']).toEqual([5, 4]);
    });
});
