import { ENTRY_BLANK_CHARACTER, ENTRY_DIGIT_PATTERN } from '../constants/puzzle-entry.constant';

const CLEAR_KEYS = new Set(['0', 'Backspace', 'Delete']);

export const readEntryKey = (key: string): string | null => {
    if (ENTRY_DIGIT_PATTERN.test(key)) {
        return key;
    }

    return CLEAR_KEYS.has(key) ? ENTRY_BLANK_CHARACTER : null;
};
