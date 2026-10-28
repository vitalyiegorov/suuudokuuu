import { msg } from '@lingui/core/macro';

import { ListConjunctionEnum } from '../enums/list-conjunction.enum';

import { gameFormatList } from './game-format-list.util';
import { gameGetCellName } from './game-get-cell-name.util';

import type { I18n } from '@lingui/core';
import type { StepScriptCandidateInterface } from '@suuudokuuu/field-core';

export const gameGetEliminationList = (eliminations: readonly StepScriptCandidateInterface[], i18n: I18n): string =>
    [...new Set(eliminations.map(({ cell }) => gameGetCellName(cell)))]
        .map(cell => {
            const values = gameFormatList(
                eliminations.flatMap(elimination => (gameGetCellName(elimination.cell) === cell ? [elimination.value] : [])),
                ListConjunctionEnum.OR,
                i18n
            );

            return i18n._(msg`${cell} cannot be ${values}`);
        })
        .join('; ');
