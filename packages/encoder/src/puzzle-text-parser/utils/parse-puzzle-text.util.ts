import { isDefined } from '@rnw-community/shared';

import { GRID_CELL_COUNT, GRID_EMPTY_CELL } from '../../@generic/constants/grid.constant';

const TOKEN_DELIMITER_PATTERN = /[\s?&#=/,;]+/u;
const GRID_BORDER_PATTERN = /[|+]/u;
const BORDER_CHARACTERS = new Set(['|', '+']);
const BLANK_CHARACTERS = new Set(['0', '.', '_', '*']);
const DASH_CHARACTER = '-';

const isDigitCharacter = (character: string): boolean => character >= '1' && character <= '9';

const isBlankCharacter = (character: string, isDashBlank: boolean): boolean =>
    BLANK_CHARACTERS.has(character) || (isDashBlank && character === DASH_CHARACTER);

const isBorderCharacter = (character: string, isDashBlank: boolean): boolean =>
    BORDER_CHARACTERS.has(character) || (!isDashBlank && character === DASH_CHARACTER);

const readTokenCells = (token: string, isDashBlank: boolean): string | null => {
    const characters = token.split('').filter(character => !isBorderCharacter(character, isDashBlank));

    if (!characters.every(character => isDigitCharacter(character) || isBlankCharacter(character, isDashBlank))) {
        return null;
    }

    return characters.map(character => (isDigitCharacter(character) ? character : GRID_EMPTY_CELL)).join('');
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

const findPuzzleInRun = (run: string[]): string | undefined => {
    const joinedCells = run.join('');

    if (joinedCells.length === GRID_CELL_COUNT) {
        return joinedCells;
    }

    return run.find(cells => cells.length === GRID_CELL_COUNT);
};

export const parsePuzzleText = (text: string): string | null => {
    const isDashBlank = !GRID_BORDER_PATTERN.test(text);
    const tokenCells = text.split(TOKEN_DELIMITER_PATTERN).map(token => readTokenCells(token, isDashBlank));

    return collectCellRuns(tokenCells).map(findPuzzleInRun).find(isDefined) ?? null;
};
