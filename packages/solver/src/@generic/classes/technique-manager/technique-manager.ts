import { isDefined } from '@rnw-community/shared';

import { GuessTechnique } from '../../../guess-technique/classes/guess.technique';
import { createTechniqueStrategies } from '../../utils/create-technique-strategies.util';
import { isSameCell } from '../../utils/is-same-cell.util';
import { CandidateContext } from '../candidate-context/candidate-context';

import type { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';
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

    identifyMove(cell: CellInterface): TechniqueResultInterface {
        const context = CandidateContext.fromSudoku(this.sudoku);
        const targetValue = this.getTargetValue(cell);

        for (const strategy of this.strategies) {
            const matchingResults = strategy.find(context).filter(result => isSameCell(result.cell, cell) && result.value === targetValue);
            const [result] = matchingResults;

            if (isDefined(result)) {
                return result;
            }
        }

        return this.guessTechnique.findForCell({ ...cell, value: targetValue });
    }

    identify(cell: CellInterface): SolutionTechniqueEnum {
        return this.identifyMove(cell).technique;
    }

    private getTargetValue(cell: CellInterface): number {
        return cell.value === this.sudoku.Config.blankCellValue ? this.sudoku.getCorrectValue(cell) : cell.value;
    }
}
