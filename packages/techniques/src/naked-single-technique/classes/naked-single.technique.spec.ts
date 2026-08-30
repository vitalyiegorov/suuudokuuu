import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { isDefined } from '@rnw-community/shared';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';

import { NakedSingleTechnique } from './naked-single.technique';

import type { CellInterface } from '@suuudokuuu/generator';

const board = ['.3.678912', '672.95348', '1983425.7', '8597.142.', '.268537.1', '7.3924856', '961537284', '287419635', '34.286179'];

const buildContext = (): CandidateContext => CandidateContext.fromSudoku(Sudoku.fromStrings(defaultSudokuConfig, ...board));

const getFixtureCell = (context: CandidateContext, y: number, x: number): CellInterface => {
    const cell = context.getCells().find(candidate => candidate.y === y && candidate.x === x);

    if (!isDefined(cell)) {
        throw new Error(`Missing fixture cell ${y}-${x}`);
    }

    return cell;
};

const byPosition = (left: CellInterface, right: CellInterface): number => left.y - right.y || left.x - right.x;

const expectedReasonCells = (context: CandidateContext, y: number, x: number): [number, number][] => {
    const targetCell = getFixtureCell(context, y, x);
    const filledPeers = context
        .getPeers(targetCell)
        .filter(peer => !context.isBlankCell(peer))
        .sort(byPosition);

    return [[y, x], ...filledPeers.map(peer => [peer.y, peer.x] as [number, number])];
};

describe('NakedSingleTechnique', () => {
    it('finds a blank cell with one candidate and reports the filled peers as its reason', () => {
        expect.assertions(1);

        const context = buildContext();

        expectTechniqueResults(context, new NakedSingleTechnique().find(context), [
            {
                technique: SolutionTechniqueEnum.NakedSingle,
                kind: 'placement',
                result: [1, 3, 1],
                eliminations: [],
                reasonCells: expectedReasonCells(context, 1, 3)
            },
            {
                technique: SolutionTechniqueEnum.NakedSingle,
                kind: 'placement',
                result: [2, 7, 6],
                eliminations: [],
                reasonCells: expectedReasonCells(context, 2, 7)
            },
            {
                technique: SolutionTechniqueEnum.NakedSingle,
                kind: 'placement',
                result: [3, 4, 6],
                eliminations: [],
                reasonCells: expectedReasonCells(context, 3, 4)
            },
            {
                technique: SolutionTechniqueEnum.NakedSingle,
                kind: 'placement',
                result: [3, 8, 3],
                eliminations: [],
                reasonCells: expectedReasonCells(context, 3, 8)
            },
            {
                technique: SolutionTechniqueEnum.NakedSingle,
                kind: 'placement',
                result: [4, 0, 4],
                eliminations: [],
                reasonCells: expectedReasonCells(context, 4, 0)
            },
            {
                technique: SolutionTechniqueEnum.NakedSingle,
                kind: 'placement',
                result: [4, 7, 9],
                eliminations: [],
                reasonCells: expectedReasonCells(context, 4, 7)
            },
            {
                technique: SolutionTechniqueEnum.NakedSingle,
                kind: 'placement',
                result: [5, 1, 1],
                eliminations: [],
                reasonCells: expectedReasonCells(context, 5, 1)
            },
            {
                technique: SolutionTechniqueEnum.NakedSingle,
                kind: 'placement',
                result: [8, 2, 5],
                eliminations: [],
                reasonCells: expectedReasonCells(context, 8, 2)
            }
        ]);
    });

    it('reports reason cells whose placed values cover every digit except the placement value', () => {
        expect.assertions(2);

        const context = buildContext();
        const [result] = new NakedSingleTechnique().find(context);

        if (!isDefined(result)) {
            throw new Error('Expected the fixture board to expose a naked single');
        }

        const reasonValues = new Set(
            result.reasonCells
                .filter(cell => !context.isBlankCell(cell) && !(cell.y === result.cell.y && cell.x === result.cell.x))
                .map(cell => cell.value)
        );

        expect(reasonValues.size).toBe(8);
        expect(reasonValues).not.toContain(result.value);
    });
});
