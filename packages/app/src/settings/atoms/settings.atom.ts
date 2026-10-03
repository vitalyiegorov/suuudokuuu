import { ReactivityKeyEnum, SettingsRepository } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';

import { databaseQueryAtom } from '../../@generic/utils/database-query-atom.util';

export const settingsAtom = databaseQueryAtom(
    [ReactivityKeyEnum.Settings],
    Effect.flatMap(SettingsRepository, settingsRepository => settingsRepository.get)
);
