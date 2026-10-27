import { defaultSudokuConfig } from '@suuudokuuu/generator';

import { isDefined } from '@rnw-community/shared';

const { blankCellValue, fieldSize } = defaultSudokuConfig;
const lastCellIndex = fieldSize * fieldSize - 1;
const digitCodePattern = /^(?:Digit|Numpad)([1-9])$/u;
const clearCodePattern = /^(?:Digit0|Numpad0|Backspace|Delete)$/u;

const getArrowTarget = (cellIndex: number, key: string): number | null => {
    const column = cellIndex % fieldSize;
    const arrowTargets: Record<string, number | null> = {
        ArrowDown: cellIndex + fieldSize <= lastCellIndex ? cellIndex + fieldSize : cellIndex,
        ArrowLeft: column > 0 ? cellIndex - 1 : cellIndex,
        ArrowRight: column < fieldSize - 1 ? cellIndex + 1 : cellIndex,
        ArrowUp: cellIndex - fieldSize >= 0 ? cellIndex - fieldSize : cellIndex
    };

    return arrowTargets[key] ?? null;
};

export const importScreenSubscribeKeyboard = (
    selectedCellIndex: number | null,
    onSelectCell: (cellIndex: number) => void,
    onInput: (value: number) => void
) => {
    const handleKeyDown = (event: KeyboardEvent) => {
        const arrowTarget = getArrowTarget(selectedCellIndex ?? 0, event.key);
        const digitMatch = digitCodePattern.exec(event.code);

        if (isDefined(arrowTarget)) {
            event.preventDefault();
            onSelectCell(isDefined(selectedCellIndex) ? arrowTarget : 0);

            return;
        }

        if (!isDefined(selectedCellIndex)) {
            return;
        }

        if (isDefined(digitMatch)) {
            event.preventDefault();
            onInput(Number(digitMatch[1]));
        } else if (clearCodePattern.test(event.code)) {
            event.preventDefault();
            onInput(blankCellValue);
        }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => void window.removeEventListener('keydown', handleKeyDown);
};
