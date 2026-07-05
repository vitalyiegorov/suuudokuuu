import { isDefined } from '@rnw-community/shared';

import { createTechniqueStrategies } from '../../utils/create-technique-strategies.util';

import { CandidateContext } from './candidate-context/candidate-context';
import { GuessTechnique } from './guess-technique/guess.technique';

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
            const [simplestResult] = this.sortByDifficulty(strategy.find(context));

            if (isDefined(simplestResult)) {
                return simplestResult;
            }
        }

        const [blankCell] = context.getBlankCells();

        return isDefined(blankCell) ? this.guessTechnique.findForCell(blankCell) : null;
    }

    identifyMove(cell: CellInterface): TechniqueResultInterface {
        const context = CandidateContext.fromSudoku(this.sudoku);
        const targetValue = this.getTargetValue(cell);

        for (const strategy of this.strategies) {
            const matchingResults = strategy
                .find(context)
                .filter(result => this.isSameCell(result.cell, cell) && result.value === targetValue);
            const [simplestResult] = this.sortByDifficulty(matchingResults);

            if (isDefined(simplestResult)) {
                return simplestResult;
            }
        }

        return this.guessTechnique.findForCell({ ...cell, value: targetValue });
    }

    identify(cell: CellInterface): SolutionTechniqueEnum {
        return this.identifyMove(cell).technique;
    }

    getSolution(cell: CellInterface): number | null {
        return this.identifyMove(cell).value;
    }

    private sortByDifficulty(results: TechniqueResultInterface[]): TechniqueResultInterface[] {
        return [...results].sort((firstResult, secondResult) => firstResult.technique - secondResult.technique);
    }

    private getTargetValue(cell: CellInterface): number {
        return cell.value === this.sudoku.Config.blankCellValue ? this.sudoku.getCorrectValue(cell) : cell.value;
    }

    private isSameCell(cell: CellInterface, otherCell: CellInterface): boolean {
        return cell.x === otherCell.x && cell.y === otherCell.y;
    }
}
