import { runCurrentRunCommand } from './run-current-run-command.util';

import type { FieldEngine } from '@suuudokuuu/field-core';
import type { CellInterface } from '@suuudokuuu/generator';

export const gameToggleCellCandidate = (engine: FieldEngine, cell: CellInterface): void => {
    engine.toggleCandidate(cell, cell.value);
    void runCurrentRunCommand(currentRunService =>
        currentRunService.toggleCellCandidate({ cell, candidates: engine.serialize().candidates })
    );
};
