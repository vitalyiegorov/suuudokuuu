import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { FORCING_CHAIN_MIN_CELLS } from '../../@generic/constants/forcing-chain-scan.constant';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import { NishioForcingChainTechnique } from './nishio-forcing-chain.technique';

const forcingChainBoard = '000000051000000023004005000000000600000130000007680000429006500370400000810000000';
const forcingChainSolution = '263748951758961423194325876931257684682134795547689312429816537375492168816573249';
const seventeenClueBoard = '000000000000001002003040050000000600000070001054200000000800300100000040700006000';
const solvedBoard = '123456789456789123789123456214365897365897214897214365531642978642978531978531642';

const forcingChainScanBudgetMilliseconds = 2000;

const createContext = (board: string): CandidateContext => CandidateContext.fromSudoku(Sudoku.fromString(board, defaultSudokuConfig));

describe('NishioForcingChainTechnique', () => {
    it('eliminates a candidate whose hypothesis propagates to a contradiction', () => {
        expect.assertions(4);

        const context = createContext(forcingChainBoard);
        const results = new NishioForcingChainTechnique().find(context);
        const [firstResult] = results;

        expect(results.length).toBeGreaterThan(0);
        expect(firstResult.technique).toBe(SolutionTechniqueEnum.NishioForcingChain);
        expect(firstResult.kind).toBe('elimination');
        expect(firstResult.eliminations).toHaveLength(1);
    });

    it('reports the propagation cell count as the chain length', () => {
        expect.assertions(2);

        const results = new NishioForcingChainTechnique().find(createContext(forcingChainBoard));

        expect(results.every(result => result.chainLength === result.reasonCells.length)).toBe(true);
        expect(results.every(result => (result.chainLength ?? 0) >= FORCING_CHAIN_MIN_CELLS)).toBe(true);
    });

    it('orders the results shortest chain first', () => {
        expect.assertions(1);

        const chainLengths = new NishioForcingChainTechnique()
            .find(createContext(forcingChainBoard))
            .map(result => result.chainLength ?? 0);
        const sortedChainLengths = [...chainLengths].sort((first, second) => first - second);

        expect(chainLengths).toEqual(sortedChainLengths);
    });

    it('never eliminates a value from the known solution', () => {
        expect.assertions(1);

        const results = new NishioForcingChainTechnique().find(createContext(forcingChainBoard));
        const unsafeEliminations = results.flatMap(result =>
            result.eliminations.filter(
                elimination =>
                    elimination.value ===
                    Number(forcingChainSolution[elimination.cell.y * defaultSudokuConfig.fieldSize + elimination.cell.x])
            )
        );

        expect(unsafeEliminations).toEqual([]);
    });

    it('restricts a direct scan to the played cell', () => {
        expect.assertions(2);

        const context = createContext(forcingChainBoard);
        const [targetCell] = context.getRowCells(1).filter(cell => cell.y === 1 && cell.x === 5);
        const [targetValue] = context.getCandidates(targetCell).filter(candidate => candidate !== 8);
        const results = new NishioForcingChainTechnique().find(context, { cell: targetCell, value: targetValue, intent: 'direct' });

        expect(results.length).toBeGreaterThan(0);
        expect(
            results.every(result => result.eliminations.every(elimination => elimination.cell.y === 1 && elimination.cell.x === 5))
        ).toBe(true);
    });

    it('restricts an enabling scan to the played value', () => {
        expect.assertions(1);

        const context = createContext(forcingChainBoard);
        const [targetCell] = context.getRowCells(1).filter(cell => cell.y === 1 && cell.x === 5);
        const results = new NishioForcingChainTechnique().find(context, { cell: targetCell, value: 8, intent: 'enabling' });

        expect(results.every(result => result.eliminations.every(elimination => elimination.value === 8))).toBe(true);
    });

    it('finds nothing on a board without blank cells', () => {
        expect.assertions(1);

        expect(new NishioForcingChainTechnique().find(createContext(solvedBoard))).toEqual([]);
    });

    it('returns identical results for repeated scans of the same context', () => {
        expect.assertions(1);

        const context = createContext(forcingChainBoard);

        expect(JSON.stringify(new NishioForcingChainTechnique().find(context))).toBe(
            JSON.stringify(new NishioForcingChainTechnique().find(context))
        );
    });

    it('scans a capped 17-clue board within the forcing chain scan budget', () => {
        expect.assertions(2);

        const context = createContext(seventeenClueBoard);
        const startedAt = Date.now();
        const results = new NishioForcingChainTechnique().find(context);
        const elapsedMilliseconds = Date.now() - startedAt;

        expect(elapsedMilliseconds).toBeLessThan(forcingChainScanBudgetMilliseconds);
        expect(results.every(result => result.chainLength === result.reasonCells.length)).toBe(true);
    });
});
