import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { TechniqueManager, createTechniqueStrategies } from '@suuudokuuu/techniques';

import { isDefined } from '@rnw-community/shared';

import type { TechniqueExampleCandidateInterface } from '../interfaces/technique-example-candidate.interface';
import type { TechniqueExampleCellInterface } from '../interfaces/technique-example-cell.interface';
import type { TechniqueExampleInterface } from '../interfaces/technique-example.interface';
import type { CellInterface } from '@suuudokuuu/generator';
import type { SolutionTechniqueEnum, TechniqueResultInterface } from '@suuudokuuu/techniques';

const BLANK_CELL_VALUE = defaultSudokuConfig.blankCellValue;

const formatCellLabel = (cell: Pick<CellInterface, 'x' | 'y'>): string => `r${cell.y + 1}c${cell.x + 1}`;

const isSameCell = (cell: Pick<CellInterface, 'x' | 'y'>, otherCell: Pick<CellInterface, 'x' | 'y'>): boolean =>
    cell.x === otherCell.x && cell.y === otherCell.y;

const buildExampleCell = (sudoku: Sudoku, result: TechniqueResultInterface, cell: CellInterface): TechniqueExampleCellInterface => {
    const isTargetCell = isSameCell(cell, result.cell);
    const isBlankCell = cell.value === BLANK_CELL_VALUE;
    const isPlacedCell = isTargetCell && result.kind === 'placement';

    return {
        row: cell.y,
        column: cell.x,
        label: formatCellLabel(cell),
        value: cell.value,
        placedValue: isPlacedCell ? result.value : BLANK_CELL_VALUE,
        candidates: isBlankCell && !isPlacedCell ? sudoku.getCellCandidates(cell) : [],
        eliminatedCandidates: result.eliminations
            .filter(elimination => isSameCell(elimination.cell, cell))
            .map(elimination => elimination.value),
        isPatternCell: result.reasonCells.some(reasonCell => isSameCell(reasonCell, cell)),
        isTargetCell
    };
};

export const buildTechniqueExample = (boardString: string, technique: SolutionTechniqueEnum): TechniqueExampleInterface => {
    const sudoku = Sudoku.fromString(boardString, defaultSudokuConfig);
    const strategies = createTechniqueStrategies().filter(strategy => strategy.technique === technique);
    const result = new TechniqueManager(sudoku, strategies).findNextStep();

    if (!isDefined(result) || result.technique !== technique) {
        throw new Error(`Expected the solver to report technique ${technique}, received ${result?.technique ?? 'no logical step'}`);
    }

    const placement: TechniqueExampleCandidateInterface = { label: formatCellLabel(result.cell), value: result.value };

    return {
        rows: sudoku.Field.map((cells, index) => ({ index, cells: cells.map(cell => buildExampleCell(sudoku, result, cell)) })),
        patternCellLabels: result.reasonCells.map(formatCellLabel),
        eliminations: result.eliminations.map(elimination => ({ label: formatCellLabel(elimination.cell), value: elimination.value })),
        ...(result.kind === 'placement' && { placement })
    };
};
