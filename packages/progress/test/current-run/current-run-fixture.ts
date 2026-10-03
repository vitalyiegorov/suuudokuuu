import { DifficultyEnum } from '@suuudokuuu/generator';
import * as Effect from 'effect/Effect';
import * as Option from 'effect/Option';

import { initialCurrentRun } from '../../src/current-run/constant/initial-current-run.constant';
import { CurrentRunRepository } from '../../src/current-run/repository/current-run.repository';

import type { CurrentRunType } from '../../src/current-run/type/current-run.type';

export const startedSudokuString = '530070000600195000098000060800060003400803001700020006060000280000419005000080079';

export const saveRun = (run: Partial<CurrentRunType> = {}) =>
    Effect.flatMap(CurrentRunRepository, currentRunRepository =>
        currentRunRepository.save({ ...initialCurrentRun, sudokuString: startedSudokuString, difficulty: DifficultyEnum.Medium, ...run })
    );

export const getRun = Effect.flatMap(CurrentRunRepository, currentRunRepository => currentRunRepository.get).pipe(
    Effect.map(Option.getOrThrow)
);
