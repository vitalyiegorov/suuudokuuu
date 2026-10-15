import { ENTRY_BLANK_CHARACTER, ENTRY_DIGIT_PATTERN, ENTRY_GRID_SIZE } from '../constants/puzzle-entry.constant';

const BLANK_MARKERS = new Set(['.', '0', '-', 'x', 'X', '*', '_']);
const LINE_BREAK_PATTERN = /\r?\n/u;
const SEPARATOR_LINE_PATTERN = /^[\s|+=-]+$/u;
const BOX_CORNER_PATTERN = /[+=]/u;

const readLineCells = (line: string): string[] =>
    Array.from(line)
        .filter(character => ENTRY_DIGIT_PATTERN.test(character) || BLANK_MARKERS.has(character))
        .map(character => (ENTRY_DIGIT_PATTERN.test(character) ? character : ENTRY_BLANK_CHARACTER));

const isSeparatorLine = (line: string): boolean =>
    SEPARATOR_LINE_PATTERN.test(line) && (BOX_CORNER_PATTERN.test(line) || readLineCells(line).length > ENTRY_GRID_SIZE);

export const readPuzzleEntryCells = (value: string): string[] =>
    value
        .split(LINE_BREAK_PATTERN)
        .filter(line => !isSeparatorLine(line))
        .flatMap(readLineCells);
