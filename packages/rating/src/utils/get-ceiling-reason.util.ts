import type { CeilingReasonType } from '../types/ceiling-reason.type';
import type { LogicalSolveResultInterface } from '@suuudokuuu/techniques';

export const getCeilingReason = (solveResult: Pick<LogicalSolveResultInterface, 'outcome' | 'wasSearchCapped'>): CeilingReasonType => {
    if (solveResult.outcome === 'contradiction') {
        return 'contradiction';
    }

    return solveResult.wasSearchCapped ? 'search-capped' : 'beyond-ladder';
};
