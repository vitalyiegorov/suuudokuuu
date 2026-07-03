import { isDefined } from '@rnw-community/shared';

import { CandidateContext } from './candidate-context/candidate-context';
import { ChainTechniqueScanner } from './scanners/chain-technique.scanner';
import { FishTechniqueScanner } from './scanners/fish-technique.scanner';
import { GuessTechniqueScanner } from './scanners/guess-technique.scanner';
import { IntersectionTechniqueScanner } from './scanners/intersection-technique.scanner';
import { PlacementTechniqueScanner } from './scanners/placement-technique.scanner';
import { SubsetTechniqueScanner } from './scanners/subset-technique.scanner';
import { WingTechniqueScanner } from './scanners/wing-technique.scanner';

import type { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';
import type { CellInterface } from '../../interfaces/cell.interface';
import type { TechniqueResultInterface } from '../../interfaces/technique-result.interface';
import type { TechniqueScannerInterface } from '../../interfaces/technique-scanner.interface';
import type { Sudoku } from '../sudoku/sudoku';

export class TechniqueManager {
    private readonly scanners: TechniqueScannerInterface[];
    private readonly guessScanner: GuessTechniqueScanner;

    constructor(private readonly sudoku: Sudoku) {
        this.scanners = [
            new PlacementTechniqueScanner(),
            new IntersectionTechniqueScanner(),
            new SubsetTechniqueScanner(),
            new FishTechniqueScanner(),
            new WingTechniqueScanner(),
            new ChainTechniqueScanner()
        ];
        this.guessScanner = new GuessTechniqueScanner(sudoku);
    }

    findNextStep(): TechniqueResultInterface | null {
        const context = CandidateContext.fromSudoku(this.sudoku);
        const [logicalResult] = this.findLogicalResults(context);

        if (isDefined(logicalResult)) {
            return logicalResult;
        }

        const [blankCell] = context.getBlankCells();

        return isDefined(blankCell) ? this.guessScanner.findForCell(blankCell) : null;
    }

    identifyMove(cell: CellInterface): TechniqueResultInterface {
        const context = CandidateContext.fromSudoku(this.sudoku);
        const targetValue = this.getTargetValue(cell);

        for (const result of this.findLogicalResults(context)) {
            if (this.isSameCell(result.cell, cell) && result.value === targetValue) {
                return result;
            }
        }

        return this.guessScanner.findForCell({ ...cell, value: targetValue });
    }

    identify(cell: CellInterface): SolutionTechniqueEnum {
        return this.identifyMove(cell).technique;
    }

    getSolution(cell: CellInterface): number | null {
        return this.identifyMove(cell).value;
    }

    private findLogicalResults(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const scanner of this.scanners) {
            results.push(...scanner.find(context));
        }

        return results;
    }

    private getTargetValue(cell: CellInterface): number {
        return cell.value === this.sudoku.Config.blankCellValue ? this.sudoku.getCorrectValue(cell) : cell.value;
    }

    private isSameCell(cell: CellInterface, otherCell: CellInterface): boolean {
        return cell.x === otherCell.x && cell.y === otherCell.y;
    }
}
