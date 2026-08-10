import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { FORCING_CHAIN_MIN_CELLS } from '../../@generic/constants/forcing-chain-scan.constant';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import { RegionForcingChainTechnique } from './region-forcing-chain.technique';

const forcingChainBoard = '000000051000000023004005000000000600000130000007680000429006500370400000810000000';
const forcingChainSolution = '263748951758961423194325876931257684682134795547689312429816537375492168816573249';
const regionPlacementBoard = '000000006000006001060502034000604305305000640406035100638257419570460823240000567';
const regionPlacementSolution = '954173286823946751167582934782614395315729648496835172638257419579461823241398567';
const seventeenClueBoard = '000000000000001002003040050000000600000070001054200000000800300100000040700006000';
const solvedBoard = '123456789456789123789123456214365897365897214897214365531642978642978531978531642';

const forcingChainScanBudgetMilliseconds = 2000;

const createContext = (board: string): CandidateContext => CandidateContext.fromSudoku(Sudoku.fromString(board, defaultSudokuConfig));

describe('RegionForcingChainTechnique', () => {
    it('places the value every position of one region forces', () => {
        expect.assertions(5);

        const results = new RegionForcingChainTechnique().find(createContext(regionPlacementBoard));
        const [firstResult] = results;

        expect(firstResult.technique).toBe(SolutionTechniqueEnum.RegionForcingChain);
        expect(firstResult.kind).toBe('placement');
        expect([firstResult.cell.y, firstResult.cell.x]).toEqual([3, 7]);
        expect(firstResult.value).toBe(Number(regionPlacementSolution[3 * defaultSudokuConfig.fieldSize + 7]));
        expect(firstResult.chainLength).toBe(firstResult.reasonCells.length);
    });

    it('eliminates the candidates every position of one region rules out', () => {
        expect.assertions(3);

        const results = new RegionForcingChainTechnique().find(createContext(forcingChainBoard));

        expect(results.length).toBeGreaterThan(0);
        expect(results.every(result => result.kind === 'elimination')).toBe(true);
        expect(results.every(result => result.eliminations.length > 0)).toBe(true);
    });

    it('reports the union of the branch placements as the chain length', () => {
        expect.assertions(2);

        const results = new RegionForcingChainTechnique().find(createContext(forcingChainBoard));

        expect(results.every(result => result.chainLength === result.reasonCells.length)).toBe(true);
        expect(results.every(result => (result.chainLength ?? 0) >= FORCING_CHAIN_MIN_CELLS)).toBe(true);
    });

    it('never eliminates or places against the known solution', () => {
        expect.assertions(2);

        const results = new RegionForcingChainTechnique().find(createContext(forcingChainBoard));
        const getSolutionValue = (rowIndex: number, columnIndex: number): number =>
            Number(forcingChainSolution[rowIndex * defaultSudokuConfig.fieldSize + columnIndex]);
        const unsafeEliminations = results.flatMap(result =>
            result.eliminations.filter(elimination => elimination.value === getSolutionValue(elimination.cell.y, elimination.cell.x))
        );
        const unsafePlacements = results.filter(
            result => result.kind === 'placement' && result.value !== getSolutionValue(result.cell.y, result.cell.x)
        );

        expect(unsafeEliminations).toEqual([]);
        expect(unsafePlacements).toEqual([]);
    });

    it('restricts a direct scan to the played cell', () => {
        expect.assertions(2);

        const context = createContext(forcingChainBoard);
        const [targetCell] = context.getRowCells(0).filter(cell => cell.x === 2);
        const [targetValue] = context.getCandidates(targetCell).filter(candidate => candidate !== 6);
        const results = new RegionForcingChainTechnique().find(context, { cell: targetCell, value: targetValue, intent: 'direct' });

        expect(results.length).toBeGreaterThan(0);
        expect(
            results.every(result => result.eliminations.every(elimination => elimination.cell.y === 0 && elimination.cell.x === 2))
        ).toBe(true);
    });

    it('finds nothing on a board without blank cells', () => {
        expect.assertions(1);

        expect(new RegionForcingChainTechnique().find(createContext(solvedBoard))).toEqual([]);
    });

    it('returns identical results for repeated scans of the same context', () => {
        expect.assertions(1);

        const context = createContext(forcingChainBoard);

        expect(JSON.stringify(new RegionForcingChainTechnique().find(context))).toBe(
            JSON.stringify(new RegionForcingChainTechnique().find(context))
        );
    });

    it('scans a capped 17-clue board within the forcing chain scan budget', () => {
        expect.assertions(2);

        const context = createContext(seventeenClueBoard);
        const startedAt = Date.now();
        const results = new RegionForcingChainTechnique().find(context);
        const elapsedMilliseconds = Date.now() - startedAt;

        expect(elapsedMilliseconds).toBeLessThan(forcingChainScanBudgetMilliseconds);
        expect(results.every(result => result.chainLength === result.reasonCells.length)).toBe(true);
    });
});
