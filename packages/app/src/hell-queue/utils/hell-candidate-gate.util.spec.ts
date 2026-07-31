import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { SolutionTechniqueEnum, TechniqueManager } from '@suuudokuuu/techniques';

import { createHellCandidateGate } from './hell-candidate-gate.util';

import type { HellCandidateInterface } from '@suuudokuuu/generator';

const EasyPuzzleGivensCount = 68;
const Royle17GivensCount = 17;

const easyPuzzleSolvableBySinglesOnly = '930261807824509163601843095217608354450312970389457012592104736063925401148706529';
const easySolution = '935261847824579163671843295217698354456312978389457612592184736763925481148736529';

const royle17Puzzle = '000000010400000000020000000000050407008000300001090000300400200050100000000806000';
const royle17Solution = '693784512487512936125963874932651487568247391741398625319475268856129743274836159';

const guessRequiringPuzzle = '000001807000070000600000005010000004000300000089400010500000030703900000000006020';
const guessRequiringSolution = '935261847824579163671843295217698354456312978389457612592184736763925481148736529';

const buildCandidate = (puzzle: string, solution: string, givensCount: number): HellCandidateInterface => ({
    puzzle,
    solution,
    givensCount
});

describe('createHellCandidateGate', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('rejects a puzzle that singles-only placements solve completely', () => {
        expect.assertions(1);

        const gate = createHellCandidateGate();
        const candidate = buildCandidate(easyPuzzleSolvableBySinglesOnly, easySolution, EasyPuzzleGivensCount);

        expect(gate(candidate)).toBe(false);
    });

    it('accepts a puzzle whose real solution requires an unsupported technique or a guess', () => {
        expect.assertions(1);

        const gate = createHellCandidateGate();
        const candidate = buildCandidate(guessRequiringPuzzle, guessRequiringSolution, 20);

        expect(gate(candidate)).toBe(true);
    });

    it('resolves the Royle-17 minimal puzzle to its actual verdict under the technique registry', () => {
        expect.assertions(1);

        const gate = createHellCandidateGate();
        const candidate = buildCandidate(royle17Puzzle, royle17Solution, Royle17GivensCount);

        expect(gate(candidate)).toBe(false);
    });

    it('accepts once the defensive iteration cap is reached without the puzzle completing', () => {
        expect.assertions(1);

        const stalledPlacement = {
            technique: SolutionTechniqueEnum.NakedSingle,
            cell: { x: 0, y: 0, value: 0, group: 0 },
            value: 1,
            kind: 'placement' as const,
            eliminations: [],
            reasonCells: []
        };
        jest.spyOn(TechniqueManager.prototype, 'findNextStep').mockReturnValue(stalledPlacement);

        const gate = createHellCandidateGate();
        const candidate = buildCandidate(easyPuzzleSolvableBySinglesOnly, easySolution, EasyPuzzleGivensCount);

        expect(gate(candidate)).toBe(true);
    });
});
