/* eslint-disable no-bitwise */
export class SudokuStringEncoder {
    private readonly gridSize = 9;
    private readonly totalCells = this.gridSize * this.gridSize;
    private readonly cellIndexBits = 7;
    private readonly valueBits = 4;
    private readonly bitsPerClue = this.cellIndexBits + this.valueBits;
    private readonly emptyCell = '.';
    private readonly bitsPerByte = 8;
    private readonly cellIndexMask = (1 << this.cellIndexBits) - 1;
    private readonly valueMask = (1 << this.valueBits) - 1;

    encode(sudokuString: string): string {
        if (sudokuString.length !== this.totalCells) {
            return '';
        }

        const clues = this.extractClues(sudokuString);

        if (clues.length === 0) {
            return '';
        }

        const bytes = this.packCluesToBytes(clues);

        return this.bytesToBase64(bytes);
    }

    decode(encoded: string): string {
        if (encoded.length === 0) {
            return this.emptyCell.repeat(this.totalCells);
        }

        const bytes = this.base64ToBytes(encoded);
        if (bytes.length === 0) {
            return this.emptyCell.repeat(this.totalCells);
        }

        return this.unpackBytesToGrid(bytes);
    }

    private extractClues(sudokuString: string): Array<{ cellIndex: number; value: number }> {
        const clues: Array<{ cellIndex: number; value: number }> = [];

        for (let i = 0; i < sudokuString.length; i += 1) {
            const char = sudokuString[i];
            if (char !== this.emptyCell) {
                clues.push({ cellIndex: i, value: parseInt(char, 10) });
            }
        }

        return clues;
    }

    private packCluesToBytes(clues: Array<{ cellIndex: number; value: number }>): Uint8Array {
        const totalBits = clues.length * this.bitsPerClue;
        const byteCount = Math.ceil(totalBits / this.bitsPerByte);
        const bytes = new Uint8Array(byteCount);

        let bitPosition = 0;
        for (const clue of clues) {
            const packed = (clue.cellIndex & this.cellIndexMask) |
                           ((clue.value & this.valueMask) << this.cellIndexBits);

            this.writeBitsToBytes(bytes, bitPosition, packed);
            bitPosition += this.bitsPerClue;
        }

        return bytes;
    }

    private writeBitsToBytes(bytes: Uint8Array, startBit: number, value: number): void {
        for (let i = 0; i < this.bitsPerClue; i += 1) {
            const bit = (value >> i) & 1;
            const byteIndex = Math.floor((startBit + i) / this.bitsPerByte);
            const bitOffset = (startBit + i) % this.bitsPerByte;
            bytes[byteIndex] |= bit << bitOffset;
        }
    }

    private unpackBytesToGrid(bytes: Uint8Array): string {
        const totalBits = bytes.length * this.bitsPerByte;
        const clueCount = Math.floor(totalBits / this.bitsPerClue);

        const result = Array(this.totalCells).fill(this.emptyCell);

        let bitPosition = 0;
        for (let clueIndex = 0; clueIndex < clueCount; clueIndex += 1) {
            const packed = this.readBitsFromBytes(bytes, bitPosition);
            bitPosition += this.bitsPerClue;

            const cellIndex = packed & this.cellIndexMask;
            const value = (packed >> this.cellIndexBits) & this.valueMask;

            if (cellIndex < this.totalCells && value >= 1 && value <= this.gridSize) {
                result[cellIndex] = value.toString();
            }
        }

        return result.join('');
    }

    private readBitsFromBytes(bytes: Uint8Array, startBit: number): number {
        let packed = 0;

        for (let i = 0; i < this.bitsPerClue; i += 1) {
            const byteIndex = Math.floor((startBit + i) / this.bitsPerByte);
            const bitOffset = (startBit + i) % this.bitsPerByte;

            if (byteIndex < bytes.length) {
                const bit = (bytes[byteIndex] >> bitOffset) & 1;
                packed |= bit << i;
            }
        }

        return packed;
    }

    private bytesToBase64(bytes: Uint8Array): string {
        return btoa(String.fromCharCode(...bytes));
    }

    private base64ToBytes(base64: string): Uint8Array {
        try {
            const binary = atob(base64);

            return Uint8Array.from(binary, char => char.charCodeAt(0));
        } catch {
            return new Uint8Array(0);
        }
    }
}
