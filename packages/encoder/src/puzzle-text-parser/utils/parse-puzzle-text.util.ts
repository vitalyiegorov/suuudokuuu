import { isDefined } from '@rnw-community/shared';

import { GRID_CELL_COUNT, GRID_EMPTY_CELL } from '../../@generic/constants/grid.constant';

const TOKEN_DELIMITER_PATTERN = /(?:[\s?&#=/,;()[\]{}"'`]|%(?:0[9AD]|20|2C))+/iu;

const readTokenCells = (token: string): string | null => {
    const cells = token.replaceAll(/[+|]/u.test(token) ? /[+|-]/gu : /[+|]/gu, '');

    return /^[\d.*_-]*$/u.test(cells) ? cells.replaceAll(/[0*_-]/gu, GRID_EMPTY_CELL) : null;
};

const collectCellRuns = (tokenCells: (string | null)[]): string[][] =>
    tokenCells.reduce<string[][]>(
        (runs, cells) => {
            if (isDefined(cells)) {
                runs.at(-1)?.push(cells);
            } else {
                runs.push([]);
            }

            return runs;
        },
        [[]]
    );

const joinUpToGrid = (joinedCells: string, cells: string): string =>
    joinedCells.length < GRID_CELL_COUNT ? `${joinedCells}${cells}` : joinedCells;

export const parsePuzzleText = (text: string): string | null =>
    collectCellRuns(text.split(TOKEN_DELIMITER_PATTERN).map(readTokenCells))
        .flatMap(run => run.map((_cells, startIndex) => run.slice(startIndex).reduce(joinUpToGrid, '')))
        .find(cells => cells.length === GRID_CELL_COUNT) ?? null;
