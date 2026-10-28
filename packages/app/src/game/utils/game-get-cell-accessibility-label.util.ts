import { msg } from '@lingui/core/macro';

import { isNotEmptyArray } from '@rnw-community/shared';

import type { GameCellAccessibilityLabelParamsInterface } from '../interface/game-cell-accessibility-label-params.interface';
import type { MessageDescriptor } from '@lingui/core';

export const gameGetCellAccessibilityLabel = (params: GameCellAccessibilityLabelParamsInterface): MessageDescriptor => {
    const { candidates, cell, eliminatedCandidates, isEmpty, isWrong } = params;

    const row = cell.y + 1;
    const column = cell.x + 1;
    const { value } = cell;

    if (isWrong) {
        return msg`Row ${row}, column ${column}, ${value}, wrong`;
    }

    if (!isEmpty) {
        return msg`Row ${row}, column ${column}, ${value}`;
    }

    if (isNotEmptyArray(candidates)) {
        const noteList = candidates.join(', ');
        const crossedOutList = eliminatedCandidates.join(', ');

        return isNotEmptyArray(eliminatedCandidates)
            ? msg`Row ${row}, column ${column}, empty, notes ${noteList}, crossed out ${crossedOutList}`
            : msg`Row ${row}, column ${column}, empty, notes ${noteList}`;
    }

    return msg`Row ${row}, column ${column}, empty`;
};
