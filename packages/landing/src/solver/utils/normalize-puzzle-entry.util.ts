import {
    ENTRY_BLANK_CHARACTER,
    ENTRY_CELL_COUNT,
    ENTRY_DIGIT_PATTERN,
    ENTRY_GRID_BLANK_CHARACTER
} from '../constants/puzzle-entry.constant';

const isEntryCharacter = (character: string): boolean =>
    ENTRY_DIGIT_PATTERN.test(character) || character === ENTRY_BLANK_CHARACTER || character === ENTRY_GRID_BLANK_CHARACTER;

export const normalizePuzzleEntry = (value: string): string =>
    Array.from(value)
        .filter(isEntryCharacter)
        .map(character => (ENTRY_DIGIT_PATTERN.test(character) ? character : ENTRY_BLANK_CHARACTER))
        .join('')
        .slice(0, ENTRY_CELL_COUNT)
        .padEnd(ENTRY_CELL_COUNT, ENTRY_BLANK_CHARACTER);
