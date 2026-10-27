import { describe, expect, it } from 'vitest';

import { parsePuzzleText } from '../../../src/puzzle-text-parser/utils/parse-puzzle-text.util';

const puzzle = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';
const zeroPuzzle = puzzle.replaceAll('.', '0');
const rows = Array.from(puzzle.matchAll(/.{9}/gu), match => match[0]);

const borderedGrid = [
    '+-------+-------+-------+',
    '| 5 3 . | . 7 . | . . . |',
    '| 6 . . | 1 9 5 | . . . |',
    '| . 9 8 | . . . | . 6 . |',
    '+-------+-------+-------+',
    '| 8 . . | . 6 . | . . 3 |',
    '| 4 . . | 8 . 3 | . . 1 |',
    '| 7 . . | . 2 . | . . 6 |',
    '+-------+-------+-------+',
    '| . 6 . | . . . | 2 8 . |',
    '| . . . | 4 1 9 | . . 5 |',
    '| . . . | . 8 . | . 7 9 |',
    '+-------+-------+-------+'
].join('\n');

describe('parsePuzzleText', () => {
    it.each([
        ['a dotted string', puzzle],
        ['a zero string', zeroPuzzle],
        ['a dashed string', puzzle.replaceAll('.', '-')],
        ['an underscored string', puzzle.replaceAll('.', '_')],
        ['an asterisk string', puzzle.replaceAll('.', '*')],
        ['a string with surrounding whitespace', `  \n${puzzle}\t \n`],
        ['nine plain rows', rows.join('\n')],
        ['nine rows with spaced cells', rows.map(row => row.split('').join(' ')).join('\r\n')],
        ['space-separated row groups on one line', rows.join(' ')],
        ['a bordered grid', borderedGrid],
        ['a SudokuWiki link', `https://www.sudokuwiki.org/sudoku.htm?bd=${zeroPuzzle}`],
        ['an import link', `https://www.suuudokuuu.com/import?puzzle=${puzzle}`],
        ['a link with the puzzle in the path', `https://example.com/play/${zeroPuzzle}?mode=classic#top`],
        ['a puzzle inside a post', `Can someone help with this one? Stuck after the X-Wing.\n\n${puzzle}\n\nRated 7.2 - thanks!`]
    ])('should parse %s', (_name, text) => {
        expect.assertions(1);

        expect(parsePuzzleText(text)).toBe(puzzle);
    });

    it.each([
        ['an empty string', ''],
        ['eighty cells', puzzle.slice(1)],
        ['eighty-two cells', `${puzzle}1`],
        ['a letter inside the string', puzzle.replace('7', 'x')],
        ['eight rows', rows.slice(1).join('\n')],
        ['prose without a puzzle', 'I spent 30 minutes on a 7.2 puzzle - 17 clues, 3 mistakes.'],
        ['a compressed SudokuPad link', 'https://sudokupad.app/N4IgzglgXgpiBcBOANCA5gJwhAJgQQEYAZ']
    ])('should reject %s', (_name, text) => {
        expect.assertions(1);

        expect(parsePuzzleText(text)).toBeNull();
    });
});
