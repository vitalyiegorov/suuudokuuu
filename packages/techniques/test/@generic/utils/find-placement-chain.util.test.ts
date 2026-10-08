import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { describe, expect, it } from 'vitest';

import { TechniqueManager } from '../../../src/@generic/classes/technique-manager/technique-manager';
import {
    PLACEMENT_CHAIN_DEFAULT_SCAN_COST,
    PLACEMENT_CHAIN_MAX_STEPS,
    PLACEMENT_CHAIN_SCAN_COSTS,
    PLACEMENT_CHAIN_WORK_BUDGET
} from '../../../src/@generic/constants/placement-chain.constant';
import { SolutionTechniqueEnum } from '../../../src/@generic/enums/solution-technique.enum';
import { createTechniqueStrategies } from '../../../src/@generic/utils/create-technique-strategies.util';
import { findPlacementChain } from '../../../src/@generic/utils/find-placement-chain.util';

import type { TechniqueResultInterface } from '../../../src/@generic/interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../../src/@generic/interfaces/technique-strategy.interface';

const pointingPairBoard = '.3.1.......17..63.5..623..1...2...13..38.1..61..3.48..357986142894512367.1.437.8.';
const guessBoard = '800000000003600000070090200050007000000045700000100030001000068008500010090000400';
const solvedBoard = '123456789456789123789123456214365897365897214897214365531642978642978531978531642';
const fullHouseBoard = '12345678.........................................................................';
const columnQuadBoard = '.....3...9....6......4...371..2..8..........5.8453.......3..67..27...........891.';
const shippedGreedyStepCap = 4;
const budgetPrunedBoard = '000009080800300002067500000002700600030045010000010005001000090005007100490000000';
const budgetExhaustedBoard = '006003000097005130020091080000000070600000000041000009000500800000304700004016005';
const maxScanCost = Math.max(PLACEMENT_CHAIN_DEFAULT_SCAN_COST, ...Object.values(PLACEMENT_CHAIN_SCAN_COSTS));
const pointingPairChain = ['PointingPair elimination 0-6=4', 'HiddenSingle placement 2-1=4'];

const singlesOrder = [SolutionTechniqueEnum.FullHouse, SolutionTechniqueEnum.NakedSingle, SolutionTechniqueEnum.HiddenSingle];

const createSudoku = (board: string): Sudoku => Sudoku.fromString(board.replaceAll('0', '.'), defaultSudokuConfig);

const describeChain = (chain: TechniqueResultInterface[]): string[] =>
    chain.map(step => `${SolutionTechniqueEnum[step.technique]} ${step.kind} ${step.cell.y}-${step.cell.x}=${step.value}`);

const createNarrowedStrategies = (technique: SolutionTechniqueEnum): TechniqueStrategyInterface[] =>
    createTechniqueStrategies().filter(strategy => [...singlesOrder, technique].includes(strategy.technique));

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

const createCountingStrategies = (calls: SolutionTechniqueEnum[]): TechniqueStrategyInterface[] =>
    createTechniqueStrategies().map(strategy => ({
        technique: strategy.technique,
        find: (context, target) => {
            calls.push(strategy.technique);

            return strategy.find(context, target);
        }
    }));

describe('findPlacementChain', () => {
    it('preserves Nishio and AIC witnesses in the third hint from the original column quad board', () => {
        const sudoku = createSudoku(columnQuadBoard);

        for (let hintNumber = 1; hintNumber <= 2; hintNumber += 1) {
            const chain = findPlacementChain(sudoku);
            const placement = chain.find(step => step.kind === 'placement');

            expect(placement).toBeDefined();

            if (placement !== undefined) {
                sudoku.setCellValue({ ...placement.cell, value: placement.value });
            }
        }

        const thirdChain = findPlacementChain(sudoku);
        const nishio = thirdChain.find(step => step.technique === SolutionTechniqueEnum.NishioForcingChain);
        const aic = thirdChain.find(step => step.technique === SolutionTechniqueEnum.AIC);
        const placement = thirdChain.find(step => step.kind === 'placement');

        expect(nishio?.branches?.[0].outcome).toMatchObject({ kind: 'EMPTY_CELL', cell: { y: 5, x: 6 } });
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

    it('should give up at the step cap when no placement follows the cap of eliminations', () => {
        expect.assertions(2);

        const sudoku = createSudoku(columnQuadBoard);
        const calls: SolutionTechniqueEnum[] = [];
        const strategies = [createIrrelevantStrategy(sudoku, PLACEMENT_CHAIN_MAX_STEPS), ...createCountingStrategies(calls)];

        expect(findPlacementChain(sudoku, strategies)).toEqual([]);
        expect(calls).toEqual([]);
    });

    it('should bound the scans of a pruned chain by the work budget', () => {
        expect.assertions(2);

        const calls: SolutionTechniqueEnum[] = [];
        const strategies = createCountingStrategies(calls);
        const chain = findPlacementChain(createSudoku(pointingPairBoard), strategies);

        expect(chain.length).toBeLessThanOrEqual(PLACEMENT_CHAIN_MAX_STEPS);
        expect(calls.length).toBeLessThanOrEqual(PLACEMENT_CHAIN_WORK_BUDGET);
    });

    it('should search past irrelevant eliminations to the placement and keep only the steps it needs', () => {
        expect.assertions(2);

        const sudoku = createSudoku(columnQuadBoard);
        const placementIndex = new TechniqueManager(sudoku).solveLogically().steps.findIndex(step => step.kind === 'placement');

        expect(placementIndex).toBeGreaterThanOrEqual(shippedGreedyStepCap);
        expect(describeChain(findPlacementChain(sudoku))).toEqual([
            'PointingPair elimination 7-0=5',
            'NakedQuad elimination 2-5=1',
            'HiddenSingle placement 2-4=9'
        ]);
    });

    it('should keep the unpruned prefix when the work budget runs out while pruning', () => {
        expect.assertions(4);

        const sudoku = createSudoku(budgetPrunedBoard);
        const calls: SolutionTechniqueEnum[] = [];
        const [firstGreedyStep] = new TechniqueManager(sudoku).solveLogically().steps;
        const chain = findPlacementChain(sudoku, createCountingStrategies(calls));
        const placement = chain.at(-1);

        expect(getSpentWork(calls)).toBeGreaterThanOrEqual(PLACEMENT_CHAIN_WORK_BUDGET);
        expect(describeChain(chain.slice(0, 1))).toEqual(describeChain([firstGreedyStep]));
        expect(placement?.kind).toBe('placement');
        expect(placement?.value).toBe(sudoku.getCorrectValue(placement?.cell));
    });

    it('should give up with an empty chain when the work budget runs out before a placement', () => {
        expect.assertions(4);

        const sudoku = createSudoku(budgetExhaustedBoard);
        const calls: SolutionTechniqueEnum[] = [];
        const placementIndex = new TechniqueManager(sudoku).solveLogically().steps.findIndex(step => step.kind === 'placement');

        expect(placementIndex).toBeLessThan(PLACEMENT_CHAIN_MAX_STEPS);
        expect(findPlacementChain(sudoku, createCountingStrategies(calls))).toEqual([]);
        expect(getSpentWork(calls)).toBeGreaterThanOrEqual(PLACEMENT_CHAIN_WORK_BUDGET);
        expect(getSpentWork(calls)).toBeLessThan(PLACEMENT_CHAIN_WORK_BUDGET + maxScanCost);
    });
});
