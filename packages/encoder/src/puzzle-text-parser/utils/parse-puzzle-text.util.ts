import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { GRID_CELL_COUNT, GRID_EMPTY_CELL, GRID_SIZE } from '../../@generic/constants/grid.constant';

const DASHED_ROW = '-'.repeat(GRID_SIZE);
const TOKEN_DELIMITER_PATTERN = /[\s?&#=/,;()[\]{}"'`]+/gu;

const readTokenCells = (token: string): string | null => {
    const cells = /^(?=[-+]*\+)[-+]+$/u.test(token) || /^-{10,80}$/u.test(token) ? '' : token.replaceAll(/[+|]/gu, '');

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

const readDecodedTokens = function* (text: string): Generator<string> {
    for (const token of readTokens(text)) {
        yield* readTokens(token.replaceAll(/%[\dA-F]{2}/giu, encoded => String.fromCharCode(Number(`0x${encoded.slice(1)}`))));
    }
};

const readRowsWithoutSeparators = (rows: readonly string[], tokens: Generator<string>): string | null => {
    let candidate = rows.filter(row => row !== DASHED_ROW).join('');

    for (const token of tokens) {
        const cells = /^-+$/u.test(token) ? '' : readTokenCells(token);

        if (cells !== '') {
            if (cells?.length !== GRID_SIZE) {
                return null;
            }
            candidate += cells;
            if (candidate.length === GRID_CELL_COUNT) {
                return candidate;
            }
        }
    }

    return null;
};

export const parsePuzzleText = (text: string): string | null => {
    const tokenCells: string[] = [];
    const tokens = readDecodedTokens(text);
    let candidate = '';

    for (const token of tokens) {
        const cells = readTokenCells(token);

        if (!isDefined(cells)) {
            candidate = '';
            tokenCells.length = 0;
        } else if (isNotEmptyString(cells)) {
            candidate += cells;
            tokenCells.push(token === DASHED_ROW ? token : cells);

            while (candidate.length > GRID_CELL_COUNT) {
                candidate = candidate.slice(tokenCells.shift()?.length);
            }

            if (candidate.length === GRID_CELL_COUNT) {
                if (tokenCells.every(row => row.length === GRID_SIZE) && tokenCells.includes(DASHED_ROW)) {
                    return readRowsWithoutSeparators(tokenCells, tokens) ?? candidate;
                }

                return candidate;
            }
        }
    }

    return null;
};
