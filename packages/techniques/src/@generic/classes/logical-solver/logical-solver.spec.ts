import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';
import { createTechniqueStrategies } from '../../utils/create-technique-strategies.util';

import { LogicalSolver } from './logical-solver';

const nakedSinglesPuzzle = '349.6...1.1..37..9.57.8..435......96..61.8.5...2....749.36...1.12.8...6..6.2.943.';
const hiddenSinglePuzzle = '2.846.9.5.75.....2.9.32.4.896.1438.75......6.7....82..32..1.54......41....9532...';
const subsetsPuzzle = '.19.6.........72....2.5.1.459..2....2....97.......8..5...68..7...19..4.8..5......';
const beyondLadderPuzzle = '6....4.3.2.79...5....1......69.4.....8......1....2.5..3..6.72............1.29...6';
const solvedPuzzle = '123456789456789123789123456214365897365897214897214365531642978642978531978531642';

const createSolverUpTo = (technique: SolutionTechniqueEnum): LogicalSolver =>
    new LogicalSolver(createTechniqueStrategies().filter(strategy => strategy.technique <= technique));

describe('LogicalSolver', () => {
    it('should solve a naked-singles puzzle without leaving the naked-singles ladder', () => {
        expect.assertions(2);

        const result = createSolverUpTo(SolutionTechniqueEnum.NakedSingle).solve(nakedSinglesPuzzle);

        expect(result.isSolved).toBe(true);
        expect(result.requiredTechniques.every(technique => technique <= SolutionTechniqueEnum.NakedSingle)).toBe(true);
    });

    it('should need hidden singles for a puzzle the naked-singles ladder cannot finish', () => {
        expect.assertions(3);

        const nakedResult = createSolverUpTo(SolutionTechniqueEnum.NakedSingle).solve(hiddenSinglePuzzle);
        const singlesResult = createSolverUpTo(SolutionTechniqueEnum.HiddenSingle).solve(hiddenSinglePuzzle);

        expect(nakedResult.isSolved).toBe(false);
        expect(singlesResult.isSolved).toBe(true);
        expect(singlesResult.hardestTechnique).toBe(SolutionTechniqueEnum.HiddenSingle);
    });

    it('should cash in eliminations from a subset technique into a placement', () => {
        expect.assertions(3);

        const singlesResult = createSolverUpTo(SolutionTechniqueEnum.HiddenSingle).solve(subsetsPuzzle);
        const subsetsResult = createSolverUpTo(SolutionTechniqueEnum.HiddenQuad).solve(subsetsPuzzle);

        expect(singlesResult.isSolved).toBe(false);
        expect(subsetsResult.isSolved).toBe(true);
        expect(subsetsResult.hardestTechnique).toBeGreaterThan(SolutionTechniqueEnum.HiddenSingle);
    });

    it('should report an unsolved puzzle when the full ladder runs out of techniques', () => {
        expect.assertions(1);

        expect(new LogicalSolver().solve(beyondLadderPuzzle).isSolved).toBe(false);
    });

    it('should report a solved puzzle with no required techniques', () => {
        expect.assertions(3);

        const result = new LogicalSolver().solve(solvedPuzzle);

        expect(result.isSolved).toBe(true);
        expect(result.requiredTechniques).toStrictEqual([]);
        expect(result.hardestTechnique).toBe(SolutionTechniqueEnum.Guess);
    });

    it('should report required techniques in ladder order', () => {
        expect.assertions(1);

        const result = new LogicalSolver().solve(subsetsPuzzle);
        const sortedTechniques = [...result.requiredTechniques].sort((left, right) => left - right);

        expect(result.requiredTechniques).toStrictEqual(sortedTechniques);
    });
});
