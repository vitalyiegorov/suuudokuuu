import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { describe, expect, it } from 'vitest';

import { isDefined } from '@rnw-community/shared';

import { CandidateContext } from '../../../src/@generic/classes/candidate-context/candidate-context';
import { TechniqueManager } from '../../../src/@generic/classes/technique-manager/technique-manager';
import {
    PLACEMENT_CHAIN_DEFAULT_SCAN_COST,
    PLACEMENT_CHAIN_DIFFICULTIES,
    PLACEMENT_CHAIN_MAX_STEPS,
    PLACEMENT_CHAIN_SCAN_COSTS,
    PLACEMENT_CHAIN_WORK_BUDGET
} from '../../../src/@generic/constants/placement-chain.constant';
import { ForcingOutcomeKindEnum } from '../../../src/@generic/enums/forcing-outcome-kind.enum';
import { SolutionTechniqueEnum } from '../../../src/@generic/enums/solution-technique.enum';
import { createTechniqueStrategies } from '../../../src/@generic/utils/create-technique-strategies.util';
import { findPlacementChain } from '../../../src/@generic/utils/find-placement-chain.util';

import type { CandidateEliminationInterface } from '../../../src/@generic/interfaces/candidate-elimination.interface';
import type { TechniqueResultInterface } from '../../../src/@generic/interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../../src/@generic/interfaces/technique-strategy.interface';

const pointingPairBoard = '.3.1.......17..63.5..623..1...2...13..38.1..61..3.48..357986142894512367.1.437.8.';
const guessBoard = '800000000003600000070090200050007000000045700000100030001000068008500010090000400';
const solvedBoard = '123456789456789123789123456214365897365897214897214365531642978642978531978531642';
const fullHouseBoard = '12345678.........................................................................';
const columnQuadBoard = '.....3...9....6......4...371..2..8..........5.8453.......3..67..27...........891.';
const shippedGreedyStepCap = 4;
const budgetPrunedBoard = '000009080800300002067500000002700600030045010000010005001000090005007100490000000';
const pointingPairDetourBoard = '..6....9...45....8.27....4..4..7..6.......8.......2...4156...8.2.9...41.3.8.4...5';
const aicDetourBoard = '..31...5..4...5...75.2....13..5..71..8..6............9.....4..6.2..5.9..9..7...8.';
const reportedBoard = '001004800302000045540003090800040300000905410400006002030008600050370000100460000';
const nakedQuadOverHiddenPairBoard = '53..2.9...24.3..5...9..........1.827...7...9.....981.............64....91.2.5.43.';
const nishioOverUniqueRectangleBoard = '...4.62.7..2.9...6...8..15......89255......7...7.5.4..63.1..7......89....19...5.2';
const nishioOverUniqueRectangleEliminations: [number, number, number][] = [
    [1, 0, 8],
    [1, 1, 5],
    [1, 3, 8],
    [2, 0, 8],
    [4, 1, 4],
    [4, 1, 6],
    [4, 1, 8],
    [4, 3, 3],
    [4, 3, 6],
    [4, 4, 2],
    [4, 5, 2],
    [5, 3, 3],
    [5, 3, 6],
    [5, 5, 2],
    [7, 3, 2]
];
const witnessHintLimit = 20;
const maxScanCost = Math.max(PLACEMENT_CHAIN_DEFAULT_SCAN_COST, ...Object.values(PLACEMENT_CHAIN_SCAN_COSTS));
const columnQuadChain = ['PointingPair elimination 7-0=5', 'HiddenPair elimination 2-5=1', 'HiddenSingle placement 2-4=9'];
const pointingPairChain = ['PointingPair elimination 0-6=4', 'HiddenSingle placement 2-1=4'];

const singlesOrder = [SolutionTechniqueEnum.FullHouse, SolutionTechniqueEnum.NakedSingle, SolutionTechniqueEnum.HiddenSingle];

const createSudoku = (board: string): Sudoku => Sudoku.fromString(board.replaceAll('0', '.'), defaultSudokuConfig);

const describeChain = (chain: TechniqueResultInterface[]): string[] =>
    chain.map(step => `${SolutionTechniqueEnum[step.technique]} ${step.kind} ${step.cell.y}-${step.cell.x}=${step.value}`);

const createNarrowedStrategies = (technique: SolutionTechniqueEnum): TechniqueStrategyInterface[] =>
    createTechniqueStrategies().filter(strategy => [...singlesOrder, technique].includes(strategy.technique));

const isChainBandTechnique = (technique: SolutionTechniqueEnum): boolean =>
    singlesOrder.includes(technique) ||
    PLACEMENT_CHAIN_DIFFICULTIES[technique] >= PLACEMENT_CHAIN_DIFFICULTIES[SolutionTechniqueEnum.XChain];

const createChainBandStrategies = (): TechniqueStrategyInterface[] =>
    createTechniqueStrategies().filter(strategy => isChainBandTechnique(strategy.technique));

const findHint = (sudoku: Sudoku, eliminations: CandidateEliminationInterface[] = []): TechniqueResultInterface[] =>
    findPlacementChain(sudoku, createTechniqueStrategies(), eliminations, true);

const createForcingPlacement = (sudoku: Sudoku, cellIndex: number, implicationCount: number): TechniqueResultInterface => {
    const cell = sudoku.Field.flat().filter(fieldCell => sudoku.isBlankCell(fieldCell))[cellIndex];
    const value = sudoku.getCorrectValue(cell);

    return {
        technique: SolutionTechniqueEnum.CellForcingChain,
        cell,
        value,
        kind: 'placement',
        eliminations: [],
        reasonCells: [cell],
        branches: [
            {
                assumption: { cell, value },
                implications: Array.from({ length: implicationCount }, () => ({ cell, value })),
                outcome: { kind: ForcingOutcomeKindEnum.COMMON_PLACEMENT, cell, value }
            }
        ]
    };
};

const createIrrelevantStrategy = (sudoku: Sudoku, eliminationCount = 1): TechniqueStrategyInterface => {
    const results = sudoku.Field.flat()
        .slice(sudoku.Field.length * 3)
        .filter(cell => sudoku.isBlankCell(cell))
        .flatMap(cell =>
            sudoku
                .getCellCandidates(cell)
                .filter(value => value !== sudoku.getCorrectValue(cell))
                .map((value): TechniqueResultInterface => ({
                    technique: SolutionTechniqueEnum.XWing,
                    cell,
                    value,
                    kind: 'elimination',
                    eliminations: [{ cell, value }],
                    reasonCells: []
                }))
        )
        .slice(0, eliminationCount);

    return { technique: SolutionTechniqueEnum.XWing, find: () => results };
};

const getSpentWork = (calls: SolutionTechniqueEnum[]): number =>
    calls.reduce((spentWork, technique) => spentWork + (PLACEMENT_CHAIN_SCAN_COSTS[technique] ?? PLACEMENT_CHAIN_DEFAULT_SCAN_COST), 0);

const createCountingStrategies = (calls: SolutionTechniqueEnum[], strategies = createTechniqueStrategies()): TechniqueStrategyInterface[] =>
    strategies.map(strategy => ({
        technique: strategy.technique,
        find: (context, target) => {
            calls.push(strategy.technique);

            return strategy.find(context, target);
        }
    }));

describe('findPlacementChain', () => {
    it('preserves Nishio and AIC witnesses in the first forcing-chain hint from the original column quad board', () => {
        const sudoku = createSudoku(columnQuadBoard);
        const eliminations: CandidateEliminationInterface[] = [];
        let chain = findHint(sudoku);

        for (
            let hintNumber = 1;
            hintNumber < witnessHintLimit && chain.every(step => step.technique !== SolutionTechniqueEnum.NishioForcingChain);
            hintNumber += 1
        ) {
            const lastStep = chain.at(-1);

            if (lastStep?.kind === 'placement') {
                sudoku.setCellValue({ ...lastStep.cell, value: lastStep.value });
            } else {
                eliminations.push(...chain[0].eliminations);
            }

            chain = findHint(sudoku, eliminations);
        }

        const nishio = chain.find(step => step.technique === SolutionTechniqueEnum.NishioForcingChain);
        const aic = chain.find(step => step.technique === SolutionTechniqueEnum.AIC);
        const placement = chain.find(step => step.kind === 'placement');

        expect(nishio?.branches?.[0].outcome).toMatchObject({ kind: 'ASSIGNMENT_CONFLICT', cell: { y: 4, x: 4 } });
        expect(aic?.chain?.length).toBeGreaterThan(3);
        expect(placement && [placement.cell.y, placement.cell.x, placement.value]).toEqual([5, 8, 1]);
    });

    it('should chain the pointing pair the hidden single depends on and stop at the placement', () => {
        expect.assertions(1);

        expect(describeChain(findPlacementChain(createSudoku(pointingPairBoard)))).toEqual(pointingPairChain);
    });

    it('should prune the first elimination step when the placement does not depend on it', () => {
        expect.assertions(1);

        const sudoku = createSudoku(pointingPairBoard);
        const firstSteps = new TechniqueManager(sudoku).solveLogically().steps.slice(0, 1);

        expect(describeChain([...firstSteps, ...findPlacementChain(sudoku)])).toEqual([
            'PointingPair elimination 0-0=2',
            ...pointingPairChain
        ]);
    });

    it('should drop an injected elimination the placement never needed', () => {
        expect.assertions(2);

        const sudoku = createSudoku(pointingPairBoard);
        const strategies = [createIrrelevantStrategy(sudoku), ...createTechniqueStrategies()];

        expect(new TechniqueManager(sudoku, strategies).findNextStep()?.technique).toBe(SolutionTechniqueEnum.XWing);
        expect(describeChain(findPlacementChain(sudoku, strategies))).toEqual(pointingPairChain);
    });

    it('should return a single placement step when a single is already available', () => {
        expect.assertions(1);

        expect(describeChain(findPlacementChain(createSudoku(fullHouseBoard)))).toEqual(['FullHouse placement 0-8=9']);
    });

    it('should return an empty chain when no placement is reachable without guessing', () => {
        expect.assertions(2);

        const sudoku = createSudoku(guessBoard);

        expect(new TechniqueManager(sudoku).findNextStep()?.technique).toBe(SolutionTechniqueEnum.Guess);
        expect(findPlacementChain(sudoku)).toEqual([]);
    });

    it('should return an empty chain for a solved board', () => {
        expect.assertions(1);

        expect(findPlacementChain(createSudoku(solvedBoard))).toEqual([]);
    });

    it.each([
        [SolutionTechniqueEnum.Jellyfish, '982615.....7....12.13724..9.....1...15...2..672....1.5...18..37..1..74.8.7.24..91'],
        [SolutionTechniqueEnum.UniqueRectangle, '....51.....5368.121.3.24..6...8.21.5...196347.1.4.52.8...287.....461..2..2.54..8.'],
        [SolutionTechniqueEnum.BivalueUniversalGrave, '3861794527..6549384..328176.6.947315934215867.7.836294643581729...762543..7493681'],
        [SolutionTechniqueEnum.CellForcingChain, '023006541000001023014325078002003160000010230137692485391268754056039812208150396'],
        [SolutionTechniqueEnum.RegionForcingChain, '000000006000006001060502034000604305305000640406035100638257419570460823240000567'],
        [SolutionTechniqueEnum.SimpleColoring, '..9.6...76372918454.837596..85619.24.64..2..99.2...6.8..1946.83.965..4..843127596']
    ])('should reach a solution placement through technique %i on a narrowed registry', (technique, board) => {
        expect.assertions(3);

        const sudoku = createSudoku(board);
        const chain = findPlacementChain(sudoku, createNarrowedStrategies(technique));
        const placement = chain.at(-1);

        expect(chain.map(step => step.technique)).toContain(technique);
        expect(placement?.kind).toBe('placement');
        expect(placement?.value).toBe(sudoku.getCorrectValue(placement?.cell));
    });

    it('should search in difficulty order whatever order the strategies are listed in', () => {
        expect.assertions(2);

        const sudoku = createSudoku(columnQuadBoard);
        const calls: SolutionTechniqueEnum[] = [];

        expect(describeChain(findPlacementChain(sudoku, createCountingStrategies(calls).reverse()))).toEqual(columnQuadChain);
        expect(getSpentWork(calls)).toBeLessThanOrEqual(PLACEMENT_CHAIN_WORK_BUDGET + maxScanCost);
    });

    it('should search the context after the final capped elimination for a placement route', () => {
        expect.assertions(2);

        const sudoku = createSudoku(columnQuadBoard);
        const allEliminations = createIrrelevantStrategy(sudoku, PLACEMENT_CHAIN_MAX_STEPS).find(CandidateContext.fromSudoku(sudoku));
        const eliminations = allEliminations.flatMap(result => result.eliminations);
        const irrelevantStrategy: TechniqueStrategyInterface = {
            technique: SolutionTechniqueEnum.XWing,
            find: context =>
                allEliminations
                    .filter(result =>
                        result.eliminations.some(elimination => context.getCandidates(elimination.cell).includes(elimination.value))
                    )
                    .slice(0, 1)
        };
        const placementCell = sudoku.Field.flat().find(cell => sudoku.isBlankCell(cell));
        const gatedStrategy: TechniqueStrategyInterface = {
            technique: SolutionTechniqueEnum.Swordfish,
            find: context =>
                placementCell === undefined ||
                eliminations.some(elimination => context.getCandidates(elimination.cell).includes(elimination.value))
                    ? []
                    : [
                          {
                              technique: SolutionTechniqueEnum.Swordfish,
                              cell: placementCell,
                              value: sudoku.getCorrectValue(placementCell),
                              kind: 'placement',
                              eliminations: [],
                              reasonCells: []
                          }
                      ]
        };
        const chain = findPlacementChain(sudoku, [irrelevantStrategy, gatedStrategy]);

        expect(chain).toHaveLength(PLACEMENT_CHAIN_MAX_STEPS + 1);
        expect(chain.at(-1)?.kind).toBe('placement');
    });

    it('should admit forcing chains to the band only when the cheapest progress step is itself a forcing chain', () => {
        expect.assertions(2);

        const sudoku = createSudoku(pointingPairDetourBoard);

        expect(findPlacementChain(sudoku, createChainBandStrategies(), [], true).map(step => step.technique)).toEqual([
            SolutionTechniqueEnum.AIC
        ]);
        expect(describeChain(findPlacementChain(sudoku, createNarrowedStrategies(SolutionTechniqueEnum.NishioForcingChain)))).toEqual([
            'NishioForcingChain elimination 0-3=4',
            'HiddenSingle placement 0-5=4'
        ]);
    });

    it.each([
        ['pointing pair detour', pointingPairDetourBoard, 'PointingPair elimination 4-1=3'],
        ['AIC detour', aicDetourBoard, 'PointingPair elimination 3-4=4'],
        ['reported', reportedBoard, 'PointingPair elimination 6-7=5']
    ])(
        'should teach the cheapest step alone on the %s board instead of a route through a much harder technique',
        (_, board, cheapestStep) => {
            expect.assertions(2);

            const sudoku = createSudoku(board);

            expect(describeChain(findHint(sudoku))).toEqual([cheapestStep]);
            expect(findPlacementChain(sudoku)).toEqual([]);
        }
    );

    it.each([
        [SolutionTechniqueEnum.NakedQuad, nakedQuadOverHiddenPairBoard, [], 'HiddenPair elimination 2-6=6'],
        [
            SolutionTechniqueEnum.NishioForcingChain,
            nishioOverUniqueRectangleBoard,
            nishioOverUniqueRectangleEliminations,
            'UniqueRectangle elimination 5-1=2'
        ]
    ])(
        'should teach the cheapest step instead of technique %i that comes first in registry order',
        (registryFirstTechnique, board, eliminationTuples, cheapestStep) => {
            expect.assertions(2);

            const sudoku = createSudoku(board);
            const eliminations = eliminationTuples.map(([y, x, value]) => ({ cell: sudoku.Field[y][x], value }));
            const context = CandidateContext.fromSudoku(sudoku).withEliminations(eliminations);
            const registryFirstStrategy = createTechniqueStrategies().find(strategy => strategy.technique === registryFirstTechnique);

            expect(
                registryFirstStrategy
                    ?.find(context)
                    .some(result =>
                        result.eliminations.some(elimination => context.getCandidates(elimination.cell).includes(elimination.value))
                    )
            ).toBe(true);
            expect(describeChain(findHint(sudoku, eliminations))).toEqual([cheapestStep]);
        }
    );

    it('should teach the AIC elimination alone once the pointing pair is applied instead of a Nishio route to a digit', () => {
        expect.assertions(2);

        const sudoku = createSudoku(reportedBoard);
        const [pointingPair] = findHint(sudoku);
        const chain = findHint(sudoku, pointingPair.eliminations);

        expect(describeChain(chain)).toEqual(['AIC elimination 8-6=2']);
        expect(chain[0].eliminations.every(({ cell, value }) => sudoku.getCorrectValue(cell) !== value)).toBe(true);
    });

    it('should prefer the forcing-chain result with the shortest trimmed branches', () => {
        expect.assertions(1);

        const sudoku = createSudoku(pointingPairBoard);
        const longPlacement = createForcingPlacement(sudoku, 0, 5);
        const shortPlacement = createForcingPlacement(sudoku, 1, 1);
        const forcingStrategy: TechniqueStrategyInterface = {
            technique: SolutionTechniqueEnum.CellForcingChain,
            find: () => [longPlacement, shortPlacement]
        };

        expect(findPlacementChain(sudoku, [forcingStrategy])).toEqual([shortPlacement]);
    });

    it('should bound the scans of a pruned chain by the work budget', () => {
        expect.assertions(2);

        const calls: SolutionTechniqueEnum[] = [];
        const strategies = createCountingStrategies(calls);
        const chain = findPlacementChain(createSudoku(pointingPairBoard), strategies);

        expect(chain.length).toBeLessThanOrEqual(PLACEMENT_CHAIN_MAX_STEPS);
        expect(calls.length).toBeLessThanOrEqual(PLACEMENT_CHAIN_WORK_BUDGET);
    });

    it('should scan each technique at most once per candidate context', () => {
        expect.assertions(1);

        const scannedContexts = new Map<SolutionTechniqueEnum, CandidateContext[]>();
        const strategies = createChainBandStrategies().map((strategy): TechniqueStrategyInterface => ({
            technique: strategy.technique,
            find: (context, target) => {
                if (!isDefined(target)) {
                    scannedContexts.set(strategy.technique, [...(scannedContexts.get(strategy.technique) ?? []), context]);
                }

                return strategy.find(context, target);
            }
        }));

        findPlacementChain(createSudoku(pointingPairDetourBoard), strategies);

        expect([...scannedContexts.values()].every(contexts => new Set(contexts).size === contexts.length)).toBe(true);
    });

    it('should search past irrelevant eliminations to the placement and keep only the steps it needs', () => {
        expect.assertions(2);

        const sudoku = createSudoku(columnQuadBoard);
        const placementIndex = new TechniqueManager(sudoku).solveLogically().steps.findIndex(step => step.kind === 'placement');

        expect(placementIndex).toBeGreaterThanOrEqual(shippedGreedyStepCap);
        expect(describeChain(findPlacementChain(sudoku))).toEqual(columnQuadChain);
    });

    it('should keep the unpruned prefix when the work budget runs out while pruning', () => {
        expect.assertions(4);

        const sudoku = createSudoku(budgetPrunedBoard);
        const calls: SolutionTechniqueEnum[] = [];
        const [firstGreedyStep] = new TechniqueManager(sudoku, createChainBandStrategies()).solveLogically().steps;
        const chain = findPlacementChain(sudoku, createCountingStrategies(calls, createChainBandStrategies()));
        const placement = chain.at(-1);

        expect(getSpentWork(calls)).toBeGreaterThanOrEqual(PLACEMENT_CHAIN_WORK_BUDGET);
        expect(describeChain(chain.slice(0, 1))).toEqual(describeChain([firstGreedyStep]));
        expect(placement?.kind).toBe('placement');
        expect(placement?.value).toBe(sudoku.getCorrectValue(placement?.cell));
    });

    it('should give up with an empty chain when the work budget runs out and no greedy step leads to a short placement route', () => {
        expect.assertions(4);

        const sudoku = createSudoku(pointingPairDetourBoard);
        const calls: SolutionTechniqueEnum[] = [];
        const placementIndex = new TechniqueManager(sudoku, createChainBandStrategies())
            .solveLogically()
            .steps.findIndex(step => step.kind === 'placement');

        expect(placementIndex).toBeLessThan(PLACEMENT_CHAIN_MAX_STEPS);
        expect(findPlacementChain(sudoku, createCountingStrategies(calls, createChainBandStrategies()))).toEqual([]);
        expect(getSpentWork(calls)).toBeGreaterThanOrEqual(PLACEMENT_CHAIN_WORK_BUDGET);
        expect(getSpentWork(calls.filter(technique => !singlesOrder.includes(technique)))).toBeLessThan(
            2 * PLACEMENT_CHAIN_WORK_BUDGET + 2 * maxScanCost
        );
    });
});
