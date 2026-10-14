import { msg } from '@lingui/core/macro';
import { defaultSudokuConfig } from '@suuudokuuu/generator';

import { formatCellLabel } from './format-cell-label.util';

import type { I18n } from '@lingui/core';
import type { FieldGameLabelsInterface } from '@suuudokuuu/field-dom';

const BLANK_CELL_VALUE = defaultSudokuConfig.blankCellValue;

export const buildFieldLabels = (i18n: I18n): FieldGameLabelsInterface => ({
    board: {
        board: i18n._(msg`Interactive Sudoku board`),
        cell: cell => {
            const cellLabel = formatCellLabel(cell);

            return cell.value === BLANK_CELL_VALUE ? i18n._(msg`${cellLabel}, empty`) : `${cellLabel}, ${cell.value}`;
        }
    },
    numberPad: {
        numberPad: i18n._(msg`Number pad`),
        digit: (value, remaining) => i18n._(msg`Enter ${value}, ${remaining} still missing`),
        candidateMode: i18n._(msg`Notes`),
        undo: i18n._(msg`Undo`),
        redo: i18n._(msg`Redo`)
    },
    stepPlayer: {
        stepPlayer: i18n._(msg`Technique walkthrough`),
        previousStep: i18n._(msg`Previous step`),
        nextStep: i18n._(msg`Next step`),
        resetSteps: i18n._(msg`Restart walkthrough`),
        applySteps: i18n._(msg`Apply to the board`),
        stepProgress: (step, stepCount) => i18n._(msg`Step ${step} of ${stepCount}`)
    }
});
