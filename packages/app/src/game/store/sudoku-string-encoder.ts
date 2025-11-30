/* eslint-disable no-bitwise, no-plusplus, max-statements */
const GRID_SIZE = 9;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;
const CELL_INDEX_BITS = 7;
const VALUE_BITS = 4;
const BITS_PER_CLUE = CELL_INDEX_BITS + VALUE_BITS;
const EMPTY_CELL = '.';
const BITS_PER_BYTE = 8;

export const encodeSudokuString = (sudokuString: string): string => {
    if (sudokuString.length !== TOTAL_CELLS) {
        return '';
    }

    const clues: Array<{ cellIndex: number; value: number }> = [];

    for (let i = 0; i < sudokuString.length; i++) {
        const char = sudokuString[i];
        if (char !== EMPTY_CELL) {
            clues.push({ cellIndex: i, value: parseInt(char, 10) });
        }
    }

    if (clues.length === 0) {
        return '';
    }

    const totalBits = clues.length * BITS_PER_CLUE;
    const byteCount = Math.ceil(totalBits / BITS_PER_BYTE);
    const bytes = new Uint8Array(byteCount);

    let bitPosition = 0;
    for (const clue of clues) {
        const packed = (clue.cellIndex & ((1 << CELL_INDEX_BITS) - 1)) |
                       ((clue.value & ((1 << VALUE_BITS) - 1)) << CELL_INDEX_BITS);

        for (let i = 0; i < BITS_PER_CLUE; i++) {
            const bit = (packed >> i) & 1;
            const byteIndex = Math.floor(bitPosition / BITS_PER_BYTE);
            const bitOffset = bitPosition % BITS_PER_BYTE;
            bytes[byteIndex] |= bit << bitOffset;
            bitPosition++;
        }
    }

    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
};

export const decodeSudokuString = (encoded: string): string => {
    if (encoded.length === 0) {
        return EMPTY_CELL.repeat(TOTAL_CELLS);
    }

    let bytes: Uint8Array;
    try {
        const binary = atob(encoded);
        bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
    } catch {
        return EMPTY_CELL.repeat(TOTAL_CELLS);
    }

    const totalBits = bytes.length * BITS_PER_BYTE;
    const clueCount = Math.floor(totalBits / BITS_PER_CLUE);

    const result = Array(TOTAL_CELLS).fill(EMPTY_CELL);

    let bitPosition = 0;
    for (let clueIndex = 0; clueIndex < clueCount; clueIndex++) {
        let packed = 0;
        for (let i = 0; i < BITS_PER_CLUE; i++) {
            const byteIndex = Math.floor(bitPosition / BITS_PER_BYTE);
            const bitOffset = bitPosition % BITS_PER_BYTE;
            if (byteIndex < bytes.length) {
                const bit = (bytes[byteIndex] >> bitOffset) & 1;
                packed |= bit << i;
            }
            bitPosition++;
        }

        const cellIndex = packed & ((1 << CELL_INDEX_BITS) - 1);
        const value = (packed >> CELL_INDEX_BITS) & ((1 << VALUE_BITS) - 1);

        if (cellIndex < TOTAL_CELLS && value >= 1 && value <= GRID_SIZE) {
            result[cellIndex] = value.toString();
        }
    }

    return result.join('');
};
