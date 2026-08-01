import { isNotEmptyString } from '@rnw-community/shared';

import { GRID_CELL_COUNT } from '../constants/grid.constant';

export const parseGridString = (value: string): Uint8Array => {
    const isValidGridString = isNotEmptyString(value) && value.length === GRID_CELL_COUNT && /^\d+$/u.test(value);
    if (!isValidGridString) {
        throw new Error(`Grid string must contain exactly ${GRID_CELL_COUNT} digits`);
    }

    return Uint8Array.from(value, character => Number(character));
};
