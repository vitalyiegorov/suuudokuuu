import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { GRID_CELL_COUNT, GRID_EMPTY_CELL } from '../../@generic/constants/grid.constant';

const TOKEN_DELIMITER_PATTERN = /(?:[\s?&#=/,;()[\]{}"'`]|%(?:0[9AD]|20|2C))+/giu;

const readTokenCells = (token: string): string | null => {
    const cells = token.replaceAll(/[+|]/u.test(token) ? /[+|-]/gu : /[+|]/gu, '');

    return /^[\d.*_-]*$/u.test(cells) ? cells.replaceAll(/[0*_-]/gu, GRID_EMPTY_CELL) : null;
};

const readTokens = function* (text: string): Generator<string> {
    let startIndex = 0;

    for (const delimiter of text.matchAll(TOKEN_DELIMITER_PATTERN)) {
        yield text.slice(startIndex, delimiter.index);
        startIndex = delimiter.index + delimiter[0].length;
    }

    yield text.slice(startIndex);
};

export const parsePuzzleText = (text: string): string | null => {
    const tokenLengths: number[] = [];
    let candidate = '';

    for (const token of readTokens(text)) {
        const cells = readTokenCells(token);

        if (!isDefined(cells)) {
            candidate = '';
            tokenLengths.length = 0;
        } else if (isNotEmptyString(cells)) {
            candidate += cells;
            tokenLengths.push(cells.length);

            while (candidate.length > GRID_CELL_COUNT) {
                candidate = candidate.slice(tokenLengths.shift());
            }

            if (candidate.length === GRID_CELL_COUNT) {
                return candidate;
            }
        }
    }

    return null;
};
