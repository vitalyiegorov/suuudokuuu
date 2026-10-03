import { useAtomValue } from '@effect/atom-react/Hooks';
import { ReactivityKeyEnum, SettingsRepository } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import * as AsyncResult from 'effect/reactivity/AsyncResult';

import { databaseQueryAtom } from '../../@generic/utils/database-query-atom.util';
import { getDefaultSettings } from '../utils/get-default-settings.util';

export const settingsAtom = databaseQueryAtom(
    [ReactivityKeyEnum.Settings],
    Effect.flatMap(SettingsRepository, settingsRepository => settingsRepository.get)
);

export const useSettings = () => AsyncResult.getOrElse(useAtomValue(settingsAtom), getDefaultSettings);
