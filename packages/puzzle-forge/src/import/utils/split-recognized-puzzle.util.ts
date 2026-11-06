import { defaultSudokuConfig } from '@suuudokuuu/generator';

interface RecognizedPuzzleInterface {
    readonly puzzleString: string;
    readonly confidences: readonly number[];
    readonly handwritten: readonly boolean[];
}

const cellCount = defaultSudokuConfig.fieldSize ** 2;

export const splitRecognizedPuzzle = (
    { puzzleString, confidences, handwritten }: RecognizedPuzzleInterface,
    uncertainConfidence: number
) => {
    if (puzzleString.length !== cellCount || confidences.length !== cellCount || handwritten.length !== cellCount) {
        return null;
    }
    const digits = Array.from(puzzleString);

    return {
        clueString: digits.map((digit, index) => (handwritten[index] ? '.' : digit)).join(''),
        entryString: digits.map((digit, index) => (handwritten[index] ? digit : '.')).join(''),
        uncertainCellIndexes: digits.flatMap((digit, index) =>
            /[1-9]/u.test(digit) && confidences[index] < uncertainConfidence ? [index] : []
        )
    };
};
