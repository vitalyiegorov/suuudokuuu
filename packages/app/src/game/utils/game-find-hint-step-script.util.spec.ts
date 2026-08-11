import { describe, expect, it, jest } from '@jest/globals';
import { findStepScript } from '@suuudokuuu/field-core';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { isDefined } from '@rnw-community/shared';

import { gameFindHintStepScript } from './game-find-hint-step-script.util';

jest.mock('@suuudokuuu/field-core', () => {
    const actual = jest.requireActual<typeof import('@suuudokuuu/field-core')>('@suuudokuuu/field-core');

    return { ...actual, findStepScript: jest.fn(actual.findStepScript) };
});

import type { StepScriptInterface } from '@suuudokuuu/field-core';

const unsolvedPuzzle = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';
const solvedPuzzle = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';

const findStepScriptMock = jest.mocked(findStepScript);

const buildSudoku = (sudokuString: string): Sudoku => Sudoku.fromString(sudokuString, { ...defaultSudokuConfig });

describe('gameFindHintStepScript', () => {
    it('should return the simplest technique available on a live board', () => {
        expect.assertions(2);

        const stepScript = gameFindHintStepScript(buildSudoku(unsolvedPuzzle));

        if (!isDefined(stepScript)) {
            throw new Error('Expected the fixture puzzle to expose a logical technique');
        }

        expect(stepScript.technique).not.toBe(SolutionTechniqueEnum.Guess);
        expect(stepScript.steps.length).toBeGreaterThan(0);
    });

    it('should return null when the board has no blank cells left', () => {
        expect.assertions(1);

        expect(gameFindHintStepScript(buildSudoku(solvedPuzzle))).toBeNull();
    });

    it('should refuse to reveal a guess when no logical technique fires', () => {
        expect.assertions(1);

        const guessScript: StepScriptInterface = {
            technique: SolutionTechniqueEnum.Guess,
            patternCells: [],
            eliminations: [],
            placement: { cell: { x: 0, y: 0, value: 0, group: 0 }, value: 4 },
            steps: []
        };

        findStepScriptMock.mockReturnValueOnce(guessScript);

        expect(gameFindHintStepScript(buildSudoku(unsolvedPuzzle))).toBeNull();
    });
});
