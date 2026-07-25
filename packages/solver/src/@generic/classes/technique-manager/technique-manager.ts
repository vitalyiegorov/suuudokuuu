import { isDefined } from '@rnw-community/shared';

import { GuessTechnique } from '../../../guess-technique/classes/guess.technique';
import { createTechniqueStrategies } from '../../utils/create-technique-strategies.util';
import { isSameCell } from '../../utils/is-same-cell.util';
import { CandidateContext } from '../candidate-context/candidate-context';

import type { MoveClassificationInterface } from '../../interfaces/move-classification.interface';
import type { TechniqueResultInterface } from '../../interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../interfaces/technique-strategy.interface';
import type { CellInterface, Sudoku } from '@suuudokuuu/generator';

export class TechniqueManager {
    private readonly strategies: TechniqueStrategyInterface[];
    private readonly guessTechnique: GuessTechnique;

    constructor(
        private readonly sudoku: Sudoku,
        strategies: TechniqueStrategyInterface[] = createTechniqueStrategies()
    ) {
        this.strategies = strategies;
        this.guessTechnique = new GuessTechnique(sudoku);
    }

    findNextStep(): TechniqueResultInterface | null {
        const context = CandidateContext.fromSudoku(this.sudoku);

        for (const strategy of this.strategies) {
            const [result] = strategy.find(context);

            if (isDefined(result)) {
                return result;
            }
        }

        const [blankCell] = context.getBlankCells();

        return isDefined(blankCell) ? this.guessTechnique.findForCell(blankCell) : null;
    }

    identifyMove(cell: CellInterface): MoveClassificationInterface {
        const context = CandidateContext.fromSudoku(this.sudoku);
        const targetValue = this.getTargetValue(cell);

        for (const strategy of this.strategies) {
            const results = strategy.find(context, { cell, value: targetValue });
            const result = results.find(candidate => this.isResultForMove(context, candidate, cell, targetValue));

            if (isDefined(result)) {
                return { technique: result.technique, value: targetValue };
            }
        }

        return { technique: this.guessTechnique.technique, value: targetValue };
    }

    private getTargetValue(cell: CellInterface): number {
        return cell.value === this.sudoku.Config.blankCellValue ? this.sudoku.getCorrectValue(cell) : cell.value;
    }

    private isResultForMove(context: CandidateContext, result: TechniqueResultInterface, cell: CellInterface, value: number): boolean {
        if (result.kind === 'placement') {
            return isSameCell(result.cell, cell) && result.value === value;
        }

        const targetsCell = result.eliminations.some(elimination => isSameCell(elimination.cell, cell));

        if (!targetsCell) {
            return false;
        }

        const remainingCandidates = context
            .getCandidates(cell)
            .filter(
                candidate => !result.eliminations.some(elimination => isSameCell(elimination.cell, cell) && elimination.value === candidate)
            );
        const [remainingValue] = remainingCandidates;

        return remainingCandidates.length === 1 && remainingValue === value;
    }
}
