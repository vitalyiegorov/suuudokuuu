import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';

import { XYChainTechnique } from './xy-chain.technique';

import type { CandidateCellSpecType } from '../../@generic/types/candidate-cell-spec.spec.type';

interface TargetChainFixtureInterface {
    readonly name: string;
    readonly candidateMap: CandidateCellSpecType[];
    readonly target: [number, number, number];
    readonly reasonCells: [number, number][];
}

describe('XYChainTechnique', () => {
    const targetFixtures: TargetChainFixtureInterface[] = [
        {
            name: 'basic chain',
            candidateMap: [
                [0, 0, [1, 2]],
                [0, 1, [2, 3]],
                [1, 1, [1, 3]],
                [2, 2, [1, 4]]
            ],
            target: [2, 2, 4],
            reasonCells: [
                [0, 0],
                [0, 1],
                [1, 1]
            ]
        },
        {
            name: 'long chain',
            candidateMap: [
                [0, 0, [1, 2]],
                [0, 3, [2, 3]],
                [3, 3, [3, 4]],
                [3, 6, [4, 5]],
                [6, 6, [5, 6]],
                [6, 8, [6, 7]],
                [8, 8, [1, 7]],
                [0, 8, [1, 8, 9]]
            ],
            target: [0, 8, 9],
            reasonCells: [
                [0, 0],
                [0, 3],
                [3, 3],
                [3, 6],
                [6, 6],
                [6, 8],
                [8, 8]
            ]
        }
    ];

    it.each(targetFixtures)('finds only the target elimination for the $name', ({ candidateMap, target, reasonCells }) => {
        expect.assertions(1);

        const context = createCandidateContextFromMap(...candidateMap);
        const targetCell = context.getRowCells(target[0])[target[1]];

        expectTechniqueResults(context, new XYChainTechnique().find(context, { cell: targetCell, value: target[2] }), [
            {
                technique: SolutionTechniqueEnum.XYChain,
                kind: 'elimination',
                result: [target[0], target[1], 1],
                eliminations: [[target[0], target[1], 1]],
                reasonCells
            }
        ]);
    });

    it.each(targetFixtures)('finds the $name deduction in broad mode', ({ candidateMap, target, reasonCells }) => {
        expect.assertions(1);

        const context = createCandidateContextFromMap(...candidateMap);
        const targetResults = new XYChainTechnique()
            .find(context)
            .filter(result => result.cell.y === target[0] && result.cell.x === target[1] && result.value === 1);

        expectTechniqueResults(context, targetResults, [
            {
                technique: SolutionTechniqueEnum.XYChain,
                kind: 'elimination',
                result: [target[0], target[1], 1],
                eliminations: [[target[0], target[1], 1]],
                reasonCells
            }
        ]);
    });

    it('does not eliminate a target cell contained in the chain path', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [1, 2]], [1, 1, [1, 2]], [1, 4, [1, 3]], [1, 7, [1, 3]]);
        const [, targetCell] = context.getRowCells(1);

        expectTechniqueResults(context, new XYChainTechnique().find(context, { cell: targetCell, value: 2 }), []);
    });

    it('stops after the first deterministic target deduction', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap(
            [4, 4, [1, 5, 9]],
            [3, 3, [1, 2]],
            [3, 0, [2, 3]],
            [4, 0, [1, 3]],
            [3, 5, [5, 6]],
            [3, 8, [6, 7]],
            [4, 8, [5, 7]]
        );
        const [, , , , targetCell] = context.getRowCells(4);

        expectTechniqueResults(context, new XYChainTechnique().find(context, { cell: targetCell, value: 9 }), [
            {
                technique: SolutionTechniqueEnum.XYChain,
                kind: 'elimination',
                result: [4, 4, 1],
                eliminations: [[4, 4, 1]],
                reasonCells: [
                    [3, 0],
                    [3, 3],
                    [4, 0]
                ]
            }
        ]);
    });
});
