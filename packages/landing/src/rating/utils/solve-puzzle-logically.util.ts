import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum, TechniqueManager } from '@suuudokuuu/techniques';

import { isDefined, isNotEmptyArray } from '@rnw-community/shared';

import { TECHNIQUE_LADDER } from '../constants/technique-ladder.constant';

import type { LogicalSolveResultInterface } from '../interfaces/logical-solve-result.interface';
import type { CellInterface } from '@suuudokuuu/generator';
import type { TechniqueResultInterface } from '@suuudokuuu/techniques';

const getBlankCells = (sudoku: Sudoku): CellInterface[] =>
    sudoku.Field.flatMap(row => row).filter(cell => cell.value === defaultSudokuConfig.blankCellValue);

const applyPlacements = (sudoku: Sudoku, steps: TechniqueResultInterface[]): void => {
    for (const step of steps) {
        if (step.kind === 'placement') {
            sudoku.setCellValue({ ...step.cell, value: step.value });
        }
    }
};

const revealOneCell = (sudoku: Sudoku): void => {
    const [blankCell] = getBlankCells(sudoku);

    if (isDefined(blankCell)) {
        sudoku.setCellValue({ ...blankCell, value: sudoku.getCorrectValue(blankCell) });
    }
};

export const solvePuzzleLogically = (puzzleString: string): LogicalSolveResultInterface => {
    const sudoku = Sudoku.fromString(puzzleString, defaultSudokuConfig);
    const usedTechniques = new Set<SolutionTechniqueEnum>();
    let isBeyondTechniqueLadder = false;

    for (let blankCells = getBlankCells(sudoku); isNotEmptyArray(blankCells); blankCells = getBlankCells(sudoku)) {
        const { outcome, steps } = new TechniqueManager(sudoku).solveLogically();

        for (const step of steps) {
            usedTechniques.add(step.technique);
        }

        applyPlacements(sudoku, steps);

        if (outcome !== 'solved') {
            isBeyondTechniqueLadder = true;
            revealOneCell(sudoku);
        }
    }

    const requiredTechniques = TECHNIQUE_LADDER.filter(technique => usedTechniques.has(technique));

    return {
        requiredTechniques,
        hardestTechnique: requiredTechniques.at(-1) ?? SolutionTechniqueEnum.Guess,
        isBeyondTechniqueLadder
    };
};
