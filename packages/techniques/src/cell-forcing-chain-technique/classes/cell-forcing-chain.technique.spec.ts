import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { FORCING_CHAIN_MIN_CELLS } from '../../@generic/constants/forcing-chain-scan.constant';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import { CellForcingChainTechnique } from './cell-forcing-chain.technique';

const forcingChainBoard = '000000051000000023004005000000000600000130000007680000429006500370400000810000000';
const forcingChainSolution = '263748951758961423194325876931257684682134795547689312429816537375492168816573249';
const forcingPlacementBoard = '023006541000001023014325078002003160000010230137692485391268754056039812208150396';
const forcingPlacementSolution = '923786541875941623614325978482573169569814237137692485391268754756439812248157396';
const seventeenClueBoard = '000000000000001002003040050000000600000070001054200000000800300100000040700006000';
const solvedBoard = '123456789456789123789123456214365897365897214897214365531642978642978531978531642';

const forcingChainScanBudgetMilliseconds = 2000;

const createContext = (board: string): CandidateContext => CandidateContext.fromSudoku(Sudoku.fromString(board, defaultSudokuConfig));

describe('CellForcingChainTechnique', () => {
    it('places the value every candidate of one cell forces', () => {
        expect.assertions(5);

        const results = new CellForcingChainTechnique().find(createContext(forcingPlacementBoard));
        const [firstResult] = results;

        expect(firstResult.technique).toBe(SolutionTechniqueEnum.CellForcingChain);
        expect(firstResult.kind).toBe('placement');
        expect([firstResult.cell.y, firstResult.cell.x]).toEqual([1, 6]);
        expect(firstResult.value).toBe(Number(forcingPlacementSolution[defaultSudokuConfig.fieldSize + 6]));
        expect(firstResult.chainLength).toBe(firstResult.reasonCells.length);
    });

    it('eliminates the candidates every branch of one cell rules out', () => {
        expect.assertions(3);

        const results = new CellForcingChainTechnique().find(createContext(forcingChainBoard));

        expect(results.length).toBeGreaterThan(0);
        expect(results.every(result => result.kind === 'elimination')).toBe(true);
        expect(results.every(result => result.eliminations.length > 0)).toBe(true);
    });

    it('reports the union of the branch placements as the chain length', () => {
        expect.assertions(2);

        const results = new CellForcingChainTechnique().find(createContext(forcingChainBoard));

        expect(results.every(result => result.chainLength === result.reasonCells.length)).toBe(true);
        expect(results.every(result => (result.chainLength ?? 0) >= FORCING_CHAIN_MIN_CELLS)).toBe(true);
    });

    it('never eliminates or places against the known solution', () => {
        expect.assertions(2);

        const results = new CellForcingChainTechnique().find(createContext(forcingChainBoard));
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
        const results = new CellForcingChainTechnique().find(context, { cell: targetCell, value: targetValue, intent: 'direct' });

        expect(results.length).toBeGreaterThan(0);
        expect(
            results.every(result => result.eliminations.every(elimination => elimination.cell.y === 0 && elimination.cell.x === 2))
        ).toBe(true);
    });

    it('finds nothing on a board without blank cells', () => {
        expect.assertions(1);

        expect(new CellForcingChainTechnique().find(createContext(solvedBoard))).toEqual([]);
    });

    it('returns identical results for repeated scans of the same context', () => {
        expect.assertions(1);

        const context = createContext(forcingChainBoard);

        expect(JSON.stringify(new CellForcingChainTechnique().find(context))).toBe(
            JSON.stringify(new CellForcingChainTechnique().find(context))
        );
    });

    it('stops at the hypothesis cap and stays within the forcing chain scan budget', () => {
        expect.assertions(2);

        const context = createContext(seventeenClueBoard);
        const startedAt = Date.now();
        const results = new CellForcingChainTechnique().find(context);
        const elapsedMilliseconds = Date.now() - startedAt;

        expect(elapsedMilliseconds).toBeLessThan(forcingChainScanBudgetMilliseconds);
        expect(results).toEqual([]);
    });
});
