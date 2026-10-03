import { CurrentRunService } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';

import { appRuntime } from '../../@generic/runtime/app.runtime';

import type { FieldEngine } from '@suuudokuuu/field-core';
import type { CellInterface } from '@suuudokuuu/generator';

export const gameToggleCellCandidate = (engine: FieldEngine, cell: CellInterface): void => {
    engine.toggleCandidate(cell, cell.value);
    void appRuntime.runPromise(
        Effect.flatMap(CurrentRunService, currentRunService =>
            currentRunService.toggleCellCandidate({ cell, candidates: engine.serialize().candidates })
        )
    );
};
