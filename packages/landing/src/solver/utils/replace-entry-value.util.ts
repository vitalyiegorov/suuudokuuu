import { ENTRY_CELL_COUNT } from '../constants/puzzle-entry.constant';

export const replaceEntryValue = (entry: string, index: number, character: string): string => {
    if (index < 0 || index >= ENTRY_CELL_COUNT) {
        return entry;
    }

    return `${entry.slice(0, index)}${character}${entry.slice(index + 1)}`;
};
