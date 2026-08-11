import { defaultSudokuConfig } from '@suuudokuuu/generator';

import { formatCellLabel } from '../utils/format-cell-label.util';

import type { FieldGameLabelsInterface } from '@suuudokuuu/field-dom';

const BLANK_CELL_VALUE = defaultSudokuConfig.blankCellValue;

export const FIELD_LABELS: FieldGameLabelsInterface = {
    board: {
        board: 'Interactive Sudoku board',
        cell: cell => `${formatCellLabel(cell)}, ${cell.value === BLANK_CELL_VALUE ? 'empty' : String(cell.value)}`
    },
    numberPad: {
        numberPad: 'Number pad',
        digit: (value, remaining) => `Enter ${value}, ${remaining} still missing`,
        candidateMode: 'Notes',
        undo: 'Undo',
        redo: 'Redo'
    },
    stepPlayer: {
        stepPlayer: 'Technique walkthrough',
        previousStep: 'Previous step',
        nextStep: 'Next step',
        resetSteps: 'Restart walkthrough',
        applySteps: 'Apply to the board',
        stepProgress: (step, stepCount) => `Step ${step} of ${stepCount}`
    }
};
