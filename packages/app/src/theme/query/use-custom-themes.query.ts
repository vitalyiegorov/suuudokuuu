import { useAtomValue } from '@effect/atom-react/Hooks';
import { CustomThemeRepository, ReactivityKeyEnum } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import * as AsyncResult from 'effect/reactivity/AsyncResult';

import { databaseQueryAtom } from '../../@generic/utils/database-query-atom.util';

const customThemesAtom = databaseQueryAtom(
    [ReactivityKeyEnum.CustomThemes],
    Effect.flatMap(CustomThemeRepository, customThemeRepository => customThemeRepository.findAll)
);

export const useCustomThemes = () => AsyncResult.getOrElse(useAtomValue(customThemesAtom), () => []);
