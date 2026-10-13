import type { FieldBoardLabelsInterface } from './field-board-labels.interface';
import type { FieldNumberPadLabelsInterface } from './field-number-pad-labels.interface';
import type { FieldStepPlayerLabelsInterface } from './field-step-player-labels.interface';

export interface FieldGameLabelsInterface {
    readonly board: FieldBoardLabelsInterface;
    readonly numberPad: FieldNumberPadLabelsInterface;
    readonly stepPlayer: FieldStepPlayerLabelsInterface;
}
