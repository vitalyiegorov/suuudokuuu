import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';

import { XChainTechnique } from './x-chain.technique';

import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { CandidateCellSpecType } from '../../@generic/types/candidate-cell-spec.spec.type';

interface TargetChainFixtureInterface {
    readonly name: string;
    readonly candidateMap: CandidateCellSpecType[];
    readonly target: [number, number, number];
    readonly reasonCells: [number, number][];
}

const shortChainCells: CandidateCellSpecType[] = [
    [0, 0, [5, 1]],
    [0, 4, [5, 2]],
    [1, 4, [5, 3]],
    [1, 1, [5, 4]]
];

const longChainCells: CandidateCellSpecType[] = [
    [2, 3, [5, 7]],
    [5, 3, [5, 8]],
    [5, 7, [5, 9]],
    [8, 7, [5, 1]],
    [8, 8, [5, 2]],
    [2, 8, [5, 3]]
];

const eliminationTargetCell: CandidateCellSpecType = [2, 2, [5, 6]];

const shortChainBreakerCell: CandidateCellSpecType = [0, 2, [5, 9]];

const chainScanBudgetMilliseconds = 2000;

const hellCorpusBoard = '........1.......2...3..4........53...4......612...........7.......8..4.9..712....';

const findTargetChain = (results: TechniqueResultInterface[]): TechniqueResultInterface | undefined =>
    results.find(result => result.cell.y === 2 && result.cell.x === 2 && result.value === 5);

describe('XChainTechnique', () => {
    const targetFixtures: TargetChainFixtureInterface[] = [
        {
            name: 'basic chain',
            candidateMap: [
                [0, 0, [5, 6]],
                [0, 3, [5, 7]],
                [1, 3, [5, 8]],
                [1, 1, [5, 9]],
                [2, 2, [5, 4]]
            ],
            target: [2, 2, 4],
            reasonCells: [
                [0, 0],
                [0, 3],
                [1, 1],
                [1, 3]
            ]
        },
        {
            name: 'weak-link chain',
            candidateMap: [
                [0, 0, [5, 6]],
                [0, 4, [5, 7]],
                [1, 4, [5, 8]],
                [1, 1, [5, 9]],
                [2, 4, [5, 1]],
                [2, 2, [5, 4]]
            ],
            target: [2, 2, 4],
            reasonCells: [
                [0, 0],
                [0, 4],
                [1, 1],
                [1, 4]
            ]
        },
        {
            name: 'long chain',
            candidateMap: [
                [0, 0, [5, 1]],
                [0, 3, [5, 2]],
                [3, 3, [5, 3]],
                [3, 6, [5, 4]],
                [6, 6, [5, 6]],
                [6, 8, [5, 7]],
                [8, 8, [5, 8]],
                [8, 0, [5, 9]],
                [5, 3, [5, 1]],
                [5, 6, [5, 2]],
                [5, 8, [5, 3]],
                [4, 0, [5, 4]]
            ],
            target: [4, 0, 4],
            reasonCells: [
                [0, 0],
                [0, 3],
                [3, 3],
                [3, 6],
                [6, 6],
                [6, 8],
                [8, 0],
                [8, 8]
            ]
        }
    ];

    it('canonicalizes reverse paths while preserving distinct weak-link deductions', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap(
            [0, 0, [5, 6]],
            [0, 4, [5, 7]],
            [1, 4, [5, 8]],
            [1, 1, [5, 9]],
            [2, 4, [5, 1]],
            [2, 2, [5, 4]]
        );

        expectTechniqueResults(context, new XChainTechnique().find(context), [
            {
                technique: SolutionTechniqueEnum.XChain,
                kind: 'elimination',
                result: [0, 0, 5],
                eliminations: [[0, 0, 5]],
                reasonCells: [
                    [1, 1],
                    [1, 4],
                    [2, 2],
                    [2, 4]
                ]
            },
            {
                technique: SolutionTechniqueEnum.XChain,
                kind: 'elimination',
                result: [0, 4, 5],
                eliminations: [[0, 4, 5]],
                reasonCells: [
                    [1, 1],
                    [1, 4],
                    [2, 2],
                    [2, 4]
                ]
            },
            {
                technique: SolutionTechniqueEnum.XChain,
                kind: 'elimination',
                result: [1, 1, 5],
                eliminations: [[1, 1, 5]],
                reasonCells: [
                    [0, 0],
                    [0, 4],
                    [2, 2],
                    [2, 4]
                ]
            },
            {
                technique: SolutionTechniqueEnum.XChain,
                kind: 'elimination',
                result: [1, 4, 5],
                eliminations: [[1, 4, 5]],
                reasonCells: [
                    [0, 0],
                    [0, 4],
                    [2, 2],
                    [2, 4]
                ]
            },
            {
                technique: SolutionTechniqueEnum.XChain,
                kind: 'elimination',
                result: [2, 2, 5],
                eliminations: [[2, 2, 5]],
                reasonCells: [
                    [0, 0],
                    [0, 4],
                    [1, 1],
                    [1, 4]
                ]
            },
            {
                technique: SolutionTechniqueEnum.XChain,
                kind: 'elimination',
                result: [2, 4, 5],
                eliminations: [[2, 4, 5]],
                reasonCells: [
                    [0, 0],
                    [0, 4],
                    [1, 1],
                    [1, 4]
                ]
            }
        ]);
    });

    it.each(targetFixtures)('finds only the target elimination for the $name', ({ candidateMap, target, reasonCells }) => {
        expect.assertions(1);

        const context = createCandidateContextFromMap(...candidateMap);
        const targetCell = context.getRowCells(target[0])[target[1]];

        expectTechniqueResults(context, new XChainTechnique().find(context, { cell: targetCell, value: target[2], intent: 'direct' }), [
            {
                technique: SolutionTechniqueEnum.XChain,
                kind: 'elimination',
                result: [target[0], target[1], 5],
                eliminations: [[target[0], target[1], 5]],
                reasonCells
            }
        ]);
    });

    it('finds the basic deduction in broad mode', () => {
        expect.assertions(1);

        const [fixture] = targetFixtures;
        const context = createCandidateContextFromMap(...fixture.candidateMap);

        expectTechniqueResults(context, new XChainTechnique().find(context), [
            {
                technique: SolutionTechniqueEnum.XChain,
                kind: 'elimination',
                result: [2, 2, 5],
                eliminations: [[2, 2, 5]],
                reasonCells: fixture.reasonCells
            }
        ]);
    });

    it('finds the long deduction in broad mode', () => {
        expect.assertions(1);

        const [, , fixture] = targetFixtures;
        const context = createCandidateContextFromMap(...fixture.candidateMap);
        const targetResults = new XChainTechnique()
            .find(context)
            .filter(result => result.cell.y === fixture.target[0] && result.cell.x === fixture.target[1] && result.value === 5);

        expectTechniqueResults(context, targetResults, [
            {
                technique: SolutionTechniqueEnum.XChain,
                kind: 'elimination',
                result: [4, 0, 5],
                eliminations: [[4, 0, 5]],
                reasonCells: fixture.reasonCells
            }
        ]);
    });

    it('does not eliminate a target cell contained in the chain path', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [5, 6]], [0, 1, [5, 7]], [1, 1, [5, 4]], [1, 4, [5, 8]]);
        const [, targetCell] = context.getRowCells(1);

        expectTechniqueResults(context, new XChainTechnique().find(context, { cell: targetCell, value: 4, intent: 'direct' }), []);
    });

    it('stops after the first deterministic target deduction', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap(
            [4, 4, [1, 5, 9]],
            [4, 0, [1, 2]],
            [0, 0, [1, 3]],
            [0, 3, [1, 4]],
            [3, 3, [1, 6]],
            [4, 8, [5, 2]],
            [0, 8, [5, 3]],
            [0, 5, [5, 4]],
            [3, 5, [5, 6]]
        );
        const [, , , , targetCell] = context.getRowCells(4);

        expectTechniqueResults(context, new XChainTechnique().find(context, { cell: targetCell, value: 9, intent: 'direct' }), [
            {
                technique: SolutionTechniqueEnum.XChain,
                kind: 'elimination',
                result: [4, 4, 1],
                eliminations: [[4, 4, 1]],
                reasonCells: [
                    [0, 0],
                    [0, 3],
                    [3, 3],
                    [4, 0]
                ]
            }
        ]);
    });

    it('reports the shortest chain when a short and a long chain share the same deduction', () => {
        expect.assertions(3);

        const context = createCandidateContextFromMap(eliminationTargetCell, ...shortChainCells, ...longChainCells);
        const result = findTargetChain(new XChainTechnique().find(context));

        expect(result?.chainLength).toBe(4);
        expect(result?.chainLength).toBe(result?.reasonCells.length);
        expect(result?.reasonCells.map(cell => [cell.y, cell.x])).toEqual([
            [0, 0],
            [0, 4],
            [1, 4],
            [1, 1]
        ]);
    });

    it('falls back to the long chain when the short chain loses its strong link', () => {
        expect.assertions(2);

        const context = createCandidateContextFromMap(eliminationTargetCell, shortChainBreakerCell, ...shortChainCells, ...longChainCells);
        const result = findTargetChain(new XChainTechnique().find(context));

        expect(result?.chainLength).toBe(6);
        expect(result?.chainLength).toBe(result?.reasonCells.length);
    });

    it('applies the shortest chain first when different eliminations have different chain lengths', () => {
        expect.assertions(3);

        const context = createCandidateContextFromMap(
            [2, 2, [3, 8]],
            [0, 0, [8]],
            [0, 4, [8]],
            [1, 4, [8]],
            [1, 1, [8]],
            [2, 3, [3]],
            [5, 3, [3]],
            [5, 7, [3]],
            [8, 7, [3]],
            [8, 8, [3]],
            [2, 8, [3]]
        );
        const getResultKey = (result: TechniqueResultInterface): string =>
            `${result.technique}:${result.cell.y}:${result.cell.x}:${result.value}`;

        const results = new XChainTechnique().find(context);
        const [firstResult] = results;
        const [lexicallyFirstKey] = [...results].map(getResultKey).sort();

        expect(lexicallyFirstKey).not.toBe(getResultKey(firstResult));
        expect(firstResult.value).toBe(8);
        expect(firstResult.chainLength).toBe(4);
    });

    it('returns identical results for repeated scans of the same context', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap(eliminationTargetCell, ...shortChainCells, ...longChainCells);

        expect(JSON.stringify(new XChainTechnique().find(context))).toBe(JSON.stringify(new XChainTechnique().find(context)));
    });

    it('scans a stuck hell corpus board within the chain scan budget', () => {
        expect.assertions(2);

        const context = CandidateContext.fromSudoku(Sudoku.fromString(hellCorpusBoard, defaultSudokuConfig));
        const startedAt = Date.now();
        const results = new XChainTechnique().find(context);
        const elapsedMilliseconds = Date.now() - startedAt;

        expect(elapsedMilliseconds).toBeLessThan(chainScanBudgetMilliseconds);
        expect(results.every(result => result.chainLength === result.reasonCells.length)).toBe(true);
    });

    it('ignores a chain when a strong link gains a third occurrence', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap(
            [0, 0, [5, 6]],
            [0, 3, [5, 7]],
            [0, 6, [5, 1]],
            [1, 3, [5, 8]],
            [1, 1, [5, 9]],
            [2, 2, [5, 4]]
        );
        const results = new XChainTechnique().find(context);

        expect(results.some(result => result.technique === SolutionTechniqueEnum.XChain)).toBe(false);
    });
});
