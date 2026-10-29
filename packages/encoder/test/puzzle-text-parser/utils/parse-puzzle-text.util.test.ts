import { describe, expect, it, vi } from 'vitest';

import { parsePuzzleText } from '../../../src/puzzle-text-parser/utils/parse-puzzle-text.util';

const trailingTokenCount = 1_000_000;
const strayNumberCount = 20_000;
const puzzle = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';
const encodedPuzzle =
    '%35%33%2E%2E%37%2E%2E%2E%2E%36%2E%2E%31%39%35%2E%2E%2E%2E%39%38%2E%2E%2E%2E%36%2E%38%2E%2E%2E%36%2E%2E%2E%33%34%2E%2E%38%2E%33%2E%2E%31%37%2E%2E%2E%32%2E%2E%2E%36%2E%36%2E%2E%2E%2E%32%38%2E%2E%2E%2E%34%31%39%2E%2E%35%2E%2E%2E%2E%38%2E%2E%37%39';
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
    it.each(['------+-------+------', '---------------------', '-'.repeat(9)])('ignores horizontal row separator %s', separator => {
        expect.assertions(1);

        expect(parsePuzzleText(rows.join(`\n${separator}\n`))).toBe(puzzle);
    });

    it.each([0, 4, 8])('preserves an unbordered blank dashed row at index %s', blankRowIndex => {
        expect.assertions(1);

        const gridRows = rows.map((row, rowIndex) => (rowIndex === blankRowIndex ? '---------' : row.replaceAll('.', '-')));

        expect(parsePuzzleText(gridRows.join('\n'))).toBe(gridRows.join('').replaceAll('-', '.'));
    });

    it('stops normalizing tokens after the first grid', () => {
        expect.assertions(2);

        const normalization = vi.spyOn(String.prototype, 'replaceAll');
        const result = parsePuzzleText(`${puzzle}\n${'1 '.repeat(trailingTokenCount)}`);
        const calls = normalization.mock.calls.length;

        normalization.mockRestore();
        expect(result).toBe(puzzle);
        expect(calls).toBeLessThanOrEqual(4);
    });

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
        ['compact pipe borders with dashed blanks', rows.map(row => `|${row.replaceAll('.', '-')}|`).join('\n')],
        [
            'compact dashed rows with horizontal frames',
            rows.map(row => `|${row.replaceAll('.', '-')}|`).join('\n+-------+-------+-------+\n')
        ],
        ['a fully percent-encoded SudokuWiki value', `https://www.sudokuwiki.org/sudoku.htm?bd=${encodedPuzzle}`],
        ['lowercase percent escapes', `https://www.sudokuwiki.org/sudoku.htm?bd=${encodedPuzzle.toLowerCase()}`],
        ['encoded semicolon-separated rows', `https://example.com/?puzzle=${encodeURIComponent(rows.join(';'))}`],
        ['encoded bordered grid', `https://example.com/?puzzle=${encodeURIComponent(borderedGrid)}`],
        ['mixed encoded cells', `https://example.com/?puzzle=${puzzle.replaceAll('.', '%30')}`],
        ['a puzzle after malformed URL escapes', `https://example.com/?bad=%GG&puzzle=${encodedPuzzle}`],
        ['a SudokuWiki link', `https://www.sudokuwiki.org/sudoku.htm?bd=${zeroPuzzle}`],
        ['an import link', `https://www.suuudokuuu.com/import?puzzle=${puzzle}`],
        ['a link with the puzzle in the path', `https://example.com/play/${zeroPuzzle}?mode=classic#top`],
        ['a parenthesized puzzle', `Puzzle (${puzzle}) from today`],
        ['a quoted puzzle', `"${puzzle}"`],
        ['a backticked puzzle', `\`${puzzle}\``],
        ['a dashed string after an unrelated plus', `Rated 7 + hard: ${puzzle.replaceAll('.', '-')}`],
        ['dashed blanks inside a bordered grid', borderedGrid.replaceAll(' . ', ' - ')],
        ['a link with encoded row breaks', `https://example.com/import?puzzle=${rows.join('%0A')}`],
        ['a numbered grid', `Puzzle 1\n${rows.join('\n')}`],
        ['a puzzle followed by its solution grid', `${rows.join('\n')}\n\n${rows.join('\n')}`],
        ['a puzzle after a long run of stray numbers', `${'12345678 '.repeat(strayNumberCount)}${puzzle}`],
        ['a puzzle inside a post', `Can someone help with this one? Stuck after the X-Wing.\n\n${puzzle}\n\nRated 7.2 - thanks!`]
    ])('should parse %s', (_name, text) => {
        expect.assertions(1);

        expect(parsePuzzleText(text)).toBe(puzzle);
    });

    it('preserves completely blank dashed rows inside pipe borders', () => {
        expect.assertions(1);

        expect(parsePuzzleText(Array.from({ length: 9 }, () => '|---------|').join('\n'))).toBe('.'.repeat(puzzle.length));
    });

    it.each([
        ['double-encoded cells', `https://example.com/?puzzle=${encodedPuzzle.replaceAll('%', '%25')}`],
        ['double-encoded row breaks', `https://example.com/?puzzle=${rows.join('%250A')}`],
        ['an incomplete percent escape', `https://example.com/?puzzle=${puzzle.slice(1)}%`],
        ['a truncated percent escape', `https://example.com/?puzzle=${puzzle.slice(1)}%3`],
        ['a non-hexadecimal percent escape', `https://example.com/?puzzle=${puzzle.slice(1)}%GG`],
        ['malformed UTF-8 escapes', `https://example.com/?puzzle=${puzzle.slice(1)}%E0%A4%A`],
        ['an empty string', ''],
        ['a large invalid run', '12345678 '.repeat(strayNumberCount)],
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
