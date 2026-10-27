import { isDefined } from '@rnw-community/shared';

import { GRID_CELL_COUNT, GRID_EMPTY_CELL } from '../../@generic/constants/grid.constant';

const TOKEN_DELIMITER_PATTERN = /[\s?&#=/,;]+/u;

const readTokenCells = (token: string, isDashBlank: boolean): string | null => {
    const cells = token.replaceAll(isDashBlank ? /[+|]/gu : /[+|-]/gu, '');

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

export const parsePuzzleText = (text: string): string | null => {
    const isDashBlank = !/[|+]/u.test(text);
    const tokenCells = text.split(TOKEN_DELIMITER_PATTERN).map(token => readTokenCells(token, isDashBlank));

    return (
        collectCellRuns(tokenCells)
            .flatMap(run => [run.join(''), ...run])
            .find(cells => cells.length === GRID_CELL_COUNT) ?? null
    );
};
