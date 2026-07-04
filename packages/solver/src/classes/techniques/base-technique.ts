import { Sudoku } from '@suuudokuuu/generator';

import type { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';
import type { CellInterface, SudokuConfigInterface } from '@suuudokuuu/generator';

export abstract class BaseTechnique {
    protected readonly config: SudokuConfigInterface;

    protected constructor(
        readonly type: SolutionTechniqueEnum,
        readonly difficulty: number,
        protected readonly sudoku: Sudoku
    ) {
        this.config = sudoku.Config;
    }

    protected getRowCells(rowIndex: number): CellInterface[] {
        return this.sudoku.Field[rowIndex];
    }

    protected getColumnCells(columnIndex: number): CellInterface[] {
        return this.sudoku.Field.map(row => row[columnIndex]);
    }

    protected getGroupCells(cell: CellInterface): CellInterface[] {
        const cells: CellInterface[] = [];

        for (const row of this.sudoku.Field) {
            for (const currentCell of row) {
                if (currentCell.group === cell.group) {
                    cells.push(currentCell);
                }
            }
        }

        return cells;
    }

    abstract getSolution(cell: CellInterface): number | null;
}
