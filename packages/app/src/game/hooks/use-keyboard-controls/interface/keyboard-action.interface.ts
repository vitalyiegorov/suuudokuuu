import type { CellInterface } from '@suuudokuuu/generator';

interface KeyboardSelectCellActionInterface {
    readonly type: 'select-cell';
    readonly cell: CellInterface | undefined;
}

interface KeyboardSelectValueActionInterface {
    readonly type: 'select-value';
    readonly value: number;
}

interface KeyboardToggleInputModeActionInterface {
    readonly type: 'toggle-input-mode';
}

interface KeyboardExitActionInterface {
    readonly type: 'exit';
}

interface KeyboardUndoActionInterface {
    readonly type: 'undo';
}

interface KeyboardRedoActionInterface {
    readonly type: 'redo';
}

interface KeyboardNoopActionInterface {
    readonly type: 'noop';
}

export type KeyboardActionInterface =
    | KeyboardSelectCellActionInterface
    | KeyboardSelectValueActionInterface
    | KeyboardToggleInputModeActionInterface
    | KeyboardExitActionInterface
    | KeyboardUndoActionInterface
    | KeyboardRedoActionInterface
    | KeyboardNoopActionInterface;
