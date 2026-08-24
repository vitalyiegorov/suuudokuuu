import { describe, expect, it, jest } from '@jest/globals';
import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum, TechniqueManager, createTechniqueStrategies } from '@suuudokuuu/techniques';

import { findStepScript } from '../../step-script/utils/find-step-script.util';
import { techniqueResultToStepScript } from '../../step-script/utils/technique-result-to-step-script.util';

import { FieldEngine } from './field-engine';

import type { StepScriptInterface } from '../../step-script/interfaces/step-script.interface';
import type { FieldEngineOptionsInterface } from '../interfaces/field-engine-options.interface';
import type { CellInterface } from '@suuudokuuu/generator';
import type { TechniqueResultInterface } from '@suuudokuuu/techniques';

const board = ['.3.678912', '672195348', '198342567', '.59761423', '426853791', '713924856', '961537284', '287419635', '345286179'];

const nakedPairBoard = [
    '.34.7.91.',
    '672195348',
    '.9.34.567',
    '859761423',
    '426.5379.',
    '713924856',
    '961537284',
    '287419635',
    '345286179'
];

const boardString = board.join('');

const createEngine = (options: Partial<FieldEngineOptionsInterface> = {}): FieldEngine =>
    new FieldEngine({ sudokuString: boardString, difficulty: DifficultyEnum.Newbie, ...options });

const getCell = (engine: FieldEngine, x: number, y: number): CellInterface => engine.Sudoku.Field[y][x];

const requireStepScript = (script: StepScriptInterface | null): StepScriptInterface => {
    if (script === null) {
        throw new Error('Expected the engine to build a step script');
    }

    return script;
};

const requireTechniqueResult = (result: TechniqueResultInterface | null): TechniqueResultInterface => {
    if (result === null) {
        throw new Error('Expected the narrowed registry to find a technique result');
    }

    return result;
};

const fillBoard = (engine: FieldEngine): void => {
    engine.placeValue(getCell(engine, 0, 0), 5);
    engine.placeValue(getCell(engine, 2, 0), 4);
    engine.placeValue(getCell(engine, 0, 3), 8);
};

describe('FieldEngine', () => {
    describe('move application', () => {
        it('applies a correct value to the grid of record', () => {
            expect.assertions(3);

            const engine = createEngine();
            const result = engine.placeValue(getCell(engine, 0, 0), 5);

            expect(result?.isCorrect).toBe(true);
            expect(engine.getSnapshot().field[0][0].value).toBe(5);
            expect(engine.getSnapshot().sudokuString.startsWith('53')).toBe(true);
        });

        it('emits the scored cells of a correct move', () => {
            expect.assertions(1);

            const engine = createEngine();
            const handler = jest.fn();

            engine.on('moveApplied', handler);
            engine.placeValue(getCell(engine, 0, 0), 5);

            expect(handler).toHaveBeenCalledWith(expect.objectContaining({ isCorrect: true }));
        });

        it('counts and emits a mistake for a wrong value', () => {
            expect.assertions(3);

            const engine = createEngine();
            const handler = jest.fn();

            engine.on('mistake', handler);

            const result = engine.placeValue(getCell(engine, 0, 0), 4);

            expect(result?.isCorrect).toBe(false);
            expect(engine.getSnapshot().mistakes).toBe(1);
            expect(handler).toHaveBeenCalledWith({ cell: expect.objectContaining({ value: 4 }), mistakes: 1 });
        });

        it('emits a completion when the last blank cell is filled', () => {
            expect.assertions(3);

            const engine = createEngine();
            const handler = jest.fn();

            engine.on('completed', handler);
            fillBoard(engine);

            expect(handler).toHaveBeenCalledWith(expect.objectContaining({ isWon: true }));
            expect(engine.getSnapshot().isWon).toBe(true);
            expect(engine.getSnapshot().sudokuString).toBe(
                '534678912672195348198342567859761423426853791713924856961537284287419635345286179'
            );
        });

        it('keeps given cells immutable', () => {
            expect.assertions(2);

            const engine = createEngine();

            expect(engine.placeValue(getCell(engine, 1, 0), 9)).toBeNull();
            expect(engine.getSnapshot().field[0][1].value).toBe(3);
        });

        it('ignores value input without a blank selected cell', () => {
            expect.assertions(2);

            const engine = createEngine();

            expect(engine.inputValue(5)).toBeNull();

            engine.selectCell(getCell(engine, 1, 0));

            expect(engine.inputValue(5)).toBeNull();
        });

        it('routes value input through the selected cell', () => {
            expect.assertions(2);

            const engine = createEngine();

            engine.selectCell(getCell(engine, 0, 0));

            expect(engine.inputValue(5)?.isCorrect).toBe(true);
            expect(engine.getSnapshot().selectedCell?.value).toBe(5);
        });
    });

    describe('selection', () => {
        it('moves the selection with the grid navigation predicates', () => {
            expect.assertions(4);

            const engine = createEngine();

            engine.selectCell(getCell(engine, 0, 0));
            engine.moveSelection('right');

            expect(engine.getSnapshot().selectedCell?.x).toBe(1);

            engine.moveSelection('down');

            expect(engine.getSnapshot().selectedCell?.y).toBe(1);

            engine.moveSelection('left');

            expect(engine.getSnapshot().selectedCell?.x).toBe(0);

            engine.moveSelection('up');

            expect(engine.getSnapshot().selectedCell?.y).toBe(0);
        });

        it('clears the selection', () => {
            expect.assertions(1);

            const engine = createEngine();

            engine.selectCell(getCell(engine, 0, 0));
            engine.selectCell();

            expect(engine.getSnapshot().selectedCell).toBeUndefined();
        });
    });

    describe('candidates', () => {
        it('toggles a note on and off under the app cell key format', () => {
            expect.assertions(2);

            const engine = createEngine();

            engine.toggleInputMode();
            engine.selectCell(getCell(engine, 0, 0));
            engine.inputValue(5);

            expect(engine.getSnapshot().candidates['0-0']).toEqual([5]);

            engine.inputValue(5);

            expect(engine.getSnapshot().candidates['0-0']).toEqual([]);
        });

        it('appends notes in input order', () => {
            expect.assertions(1);

            const engine = createEngine();
            const cell = getCell(engine, 0, 0);

            engine.toggleCandidate(cell, 5);
            engine.toggleCandidate(cell, 3);

            expect(engine.getSnapshot().candidates['0-0']).toEqual([5, 3]);
        });

        it('removes a single note without touching the others', () => {
            expect.assertions(2);

            const engine = createEngine();
            const cell = getCell(engine, 0, 0);

            engine.toggleCandidate(cell, 5);
            engine.toggleCandidate(cell, 3);
            engine.removeCandidate(cell, 5);
            engine.removeCandidate(cell, 9);

            expect(engine.getSnapshot().candidates['0-0']).toEqual([3]);
            expect(engine.getSnapshot().canRedo).toBe(false);
        });

        it('prunes peer notes that a placement invalidates', () => {
            expect.assertions(2);

            const engine = createEngine();

            engine.toggleCandidate(getCell(engine, 2, 0), 4);
            engine.toggleCandidate(getCell(engine, 2, 0), 5);
            engine.placeValue(getCell(engine, 0, 0), 5);

            expect(engine.getSnapshot().candidates['0-2']).toEqual([4]);
            expect(engine.getSnapshot().candidates['0-0']).toEqual([]);
        });

        it('serves auto candidates instead of notes when enabled', () => {
            expect.assertions(3);

            const engine = createEngine();
            const cell = getCell(engine, 0, 0);

            engine.toggleCandidate(cell, 9);

            expect(engine.getCellCandidates(cell)).toEqual([9]);

            engine.toggleShowAutoCandidates();

            expect(engine.getCellCandidates(cell)).toEqual([5]);
            expect(engine.getSnapshot().showAutoCandidates).toBe(true);
        });

        it('forces normal input when auto candidates are switched on', () => {
            expect.assertions(1);

            const engine = createEngine({ inputMode: 'candidate' });

            engine.toggleShowAutoCandidates();

            expect(engine.getSnapshot().inputMode).toBe('normal');
        });

        it('switches auto candidates off when note input is switched on', () => {
            expect.assertions(2);

            const engine = createEngine({ showAutoCandidates: true });

            engine.toggleInputMode();

            expect(engine.getSnapshot().inputMode).toBe('candidate');
            expect(engine.getSnapshot().showAutoCandidates).toBe(false);
        });

        it('removes an auto candidate from the computed set and records the elimination', () => {
            expect.assertions(2);

            const engine = createEngine({ showAutoCandidates: true });
            const cell = getCell(engine, 0, 0);

            engine.removeCandidate(cell, 5);

            expect(engine.getCellCandidates(cell)).not.toContain(5);
            expect(engine.getSnapshot().eliminatedCandidates['0-0']).toEqual([5]);
        });

        it('does not duplicate an already eliminated auto candidate', () => {
            expect.assertions(2);

            const engine = createEngine({ showAutoCandidates: true });
            const cell = getCell(engine, 0, 0);

            engine.removeCandidate(cell, 5);
            engine.removeCandidate(cell, 5);

            expect(engine.getSnapshot().eliminatedCandidates['0-0']).toEqual([5]);
            expect(engine.getSnapshot().canRedo).toBe(false);
        });

        it('ignores manual note removal while auto candidates are enabled', () => {
            expect.assertions(1);

            const engine = createEngine({ showAutoCandidates: true, candidates: { '0-0': [5] } });
            const cell = getCell(engine, 0, 0);

            engine.removeCandidate(cell, 5);

            expect(engine.getSnapshot().candidates['0-0']).toEqual([5]);
        });

        it('undoes and redoes an auto candidate elimination', () => {
            expect.assertions(3);

            const engine = createEngine({ showAutoCandidates: true });
            const cell = getCell(engine, 0, 0);

            engine.removeCandidate(cell, 5);

            expect(engine.undo()).toBe(true);
            expect(engine.getCellCandidates(cell)).toContain(5);
            expect(engine.redo()).toBe(true);
        });
    });

    describe('undo and redo', () => {
        it('undoes and redoes a placement', () => {
            expect.assertions(5);

            const engine = createEngine();

            engine.placeValue(getCell(engine, 0, 0), 5);

            expect(engine.getSnapshot().canUndo).toBe(true);
            expect(engine.undo()).toBe(true);
            expect(engine.getSnapshot().field[0][0].value).toBe(0);
            expect(engine.redo()).toBe(true);
            expect(engine.getSnapshot().field[0][0].value).toBe(5);
        });

        it('undoes the candidate pruning that a placement caused', () => {
            expect.assertions(1);

            const engine = createEngine();

            engine.toggleCandidate(getCell(engine, 2, 0), 4);
            engine.toggleCandidate(getCell(engine, 2, 0), 5);
            engine.placeValue(getCell(engine, 0, 0), 5);
            engine.undo();

            expect(engine.getSnapshot().candidates['0-2']).toEqual([4, 5]);
        });

        it('undoes and redoes a note edit', () => {
            expect.assertions(3);

            const engine = createEngine();

            engine.toggleCandidate(getCell(engine, 0, 0), 5);

            expect(engine.undo()).toBe(true);
            expect(engine.getSnapshot().candidates['0-0']).toBeUndefined();
            expect(engine.redo()).toBe(true);
        });

        it('refuses to undo or redo past the ends of the history', () => {
            expect.assertions(3);

            const engine = createEngine();

            expect(engine.undo()).toBe(false);

            engine.toggleCandidate(getCell(engine, 0, 0), 5);

            expect(engine.redo()).toBe(false);
            expect(engine.getSnapshot().canRedo).toBe(false);
        });

        it('drops the redo branch when a new action is applied', () => {
            expect.assertions(2);

            const engine = createEngine();

            engine.placeValue(getCell(engine, 0, 0), 5);
            engine.undo();
            engine.toggleCandidate(getCell(engine, 0, 0), 9);

            expect(engine.redo()).toBe(false);
            expect(engine.getSnapshot().field[0][0].value).toBe(0);
        });
    });

    describe('serialization', () => {
        it('round-trips a grid string produced by the app format', () => {
            expect.assertions(2);

            const appSudokuString = Sudoku.fromStrings({ ...defaultSudokuConfig }, ...board).toString();
            const engine = createEngine({ sudokuString: appSudokuString });

            expect(appSudokuString).toBe(boardString);
            expect(engine.serialize().sudokuString).toBe(appSudokuString);
        });

        it('round-trips the full engine state', () => {
            expect.assertions(3);

            const engine = createEngine();

            engine.toggleCandidate(getCell(engine, 2, 0), 4);
            engine.placeValue(getCell(engine, 0, 0), 5);
            engine.placeValue(getCell(engine, 0, 3), 1);
            engine.toggleInputMode();

            const state = engine.serialize();
            const restored = new FieldEngine(state);

            expect(restored.serialize()).toEqual(state);
            expect(restored.getSnapshot().sudokuString).toBe(engine.getSnapshot().sudokuString);
            expect(restored.getSnapshot().mistakes).toBe(1);
        });

        it('round-trips auto candidate eliminations', () => {
            expect.assertions(2);

            const engine = createEngine({ showAutoCandidates: true });

            engine.removeCandidate(getCell(engine, 0, 0), 5);

            const state = engine.serialize();
            const restored = new FieldEngine(state);

            expect(restored.serialize().eliminatedCandidates).toEqual({ '0-0': [5] });
            expect(restored.getCellCandidates(getCell(restored, 0, 0))).not.toContain(5);
        });

        it('starts a round-tripped engine without undo history', () => {
            expect.assertions(2);

            const engine = createEngine();

            engine.placeValue(getCell(engine, 0, 0), 5);

            const restored = new FieldEngine(engine.serialize());

            expect(restored.getSnapshot().canUndo).toBe(false);
            expect(restored.undo()).toBe(false);
        });
    });

    describe('store contract', () => {
        it('notifies subscribers and hands out a stable snapshot between changes', () => {
            expect.assertions(4);

            const engine = createEngine();
            const listener = jest.fn();
            const unsubscribe = engine.subscribe(listener);
            const snapshot = engine.getSnapshot();

            expect(engine.getSnapshot()).toBe(snapshot);

            engine.selectCell(getCell(engine, 0, 0));

            expect(listener).toHaveBeenCalledTimes(1);
            expect(engine.getSnapshot()).not.toBe(snapshot);

            unsubscribe();
            engine.selectCell();

            expect(listener).toHaveBeenCalledTimes(1);
        });

        it('stops calling an unsubscribed event handler', () => {
            expect.assertions(1);

            const engine = createEngine();
            const handler = jest.fn();
            const unsubscribe = engine.on('mistake', handler);

            unsubscribe();
            engine.placeValue(getCell(engine, 0, 0), 4);

            expect(handler).not.toHaveBeenCalled();
        });
    });

    describe('step script', () => {
        it('builds a step script from the simplest available technique', () => {
            expect.assertions(2);

            const script = findStepScript(createEngine().Sudoku);

            expect(script?.technique).toBe(SolutionTechniqueEnum.FullHouse);
            expect(script?.placement).toEqual({ cell: expect.objectContaining({ x: 2, y: 0 }), value: 4 });
        });

        it('returns no script for a solved grid', () => {
            expect.assertions(1);

            const engine = createEngine();

            fillBoard(engine);

            expect(findStepScript(engine.Sudoku)).toBeNull();
        });

        it('exposes the player position through the snapshot', () => {
            expect.assertions(5);

            const engine = createEngine();
            const script = findStepScript(engine.Sudoku);

            engine.startStepScript(requireStepScript(script));

            expect(engine.getSnapshot().stepIndex).toBe(0);
            expect(engine.stepScriptNext()).toBe(true);
            expect(engine.getSnapshot().stepIndex).toBe(1);
            expect(engine.stepScriptBack()).toBe(true);
            expect(engine.getSnapshot().stepIndex).toBe(0);
        });

        it('resets the player position', () => {
            expect.assertions(2);

            const engine = createEngine();

            engine.startStepScript(requireStepScript(findStepScript(engine.Sudoku)));
            engine.stepScriptNext();

            expect(engine.stepScriptReset()).toBe(true);
            expect(engine.getSnapshot().stepIndex).toBe(0);
        });

        it('ignores player commands while no script is running', () => {
            expect.assertions(4);

            const engine = createEngine();

            expect(engine.stepScriptNext()).toBe(false);
            expect(engine.stepScriptBack()).toBe(false);
            expect(engine.stepScriptReset()).toBe(false);
            expect(engine.getSnapshot().stepScript).toBeNull();
        });

        it('commits the placement of a script and finishes it', () => {
            expect.assertions(2);

            const engine = createEngine();

            engine.startStepScript(requireStepScript(findStepScript(engine.Sudoku)));
            engine.applyStepScript();

            expect(engine.getSnapshot().field[0][2].value).toBe(4);
            expect(engine.getSnapshot().stepScript).toBeNull();
        });

        it('refuses to walk past the last step or before the first one', () => {
            expect.assertions(4);

            const engine = createEngine();
            const script = requireStepScript(findStepScript(engine.Sudoku));

            engine.startStepScript(script);

            const lastStepIndex = script.steps.length - 1;

            while (engine.getSnapshot().stepIndex < lastStepIndex) {
                engine.stepScriptNext();
            }

            expect(engine.getSnapshot().stepIndex).toBe(lastStepIndex);
            expect(engine.stepScriptNext()).toBe(false);

            while (engine.getSnapshot().stepIndex > 0) {
                engine.stepScriptBack();
            }

            expect(engine.getSnapshot().stepIndex).toBe(0);
            expect(engine.stepScriptBack()).toBe(false);
        });

        it('commits the eliminations of a script to the notes', () => {
            expect.assertions(1);

            const engine = createEngine({ sudokuString: nakedPairBoard.join('') });
            const strategies = createTechniqueStrategies().filter(strategy => strategy.technique === SolutionTechniqueEnum.NakedPair);
            const result = new TechniqueManager(engine.Sudoku, strategies).findNextStep();

            engine.toggleCandidate(getCell(engine, 3, 0), 8);
            engine.toggleCandidate(getCell(engine, 3, 0), 5);
            engine.startStepScript(techniqueResultToStepScript(requireTechniqueResult(result)));
            engine.applyStepScript();

            expect(engine.getSnapshot().candidates['0-3']).toEqual([5]);
        });

        it('commits the eliminations of a script to auto candidates when enabled', () => {
            expect.assertions(2);

            const engine = createEngine({ sudokuString: nakedPairBoard.join(''), showAutoCandidates: true });
            const strategies = createTechniqueStrategies().filter(strategy => strategy.technique === SolutionTechniqueEnum.NakedPair);
            const result = new TechniqueManager(engine.Sudoku, strategies).findNextStep();
            const cell = getCell(engine, 3, 0);

            expect(engine.getCellCandidates(cell)).toContain(8);

            engine.startStepScript(techniqueResultToStepScript(requireTechniqueResult(result)));
            engine.applyStepScript();

            expect(engine.getCellCandidates(cell)).not.toContain(8);
        });

        it('does nothing when applying or stopping without a running script', () => {
            expect.assertions(1);

            const engine = createEngine();

            engine.applyStepScript();
            engine.stopStepScript();

            expect(engine.getSnapshot().stepScript).toBeNull();
        });
    });
});
