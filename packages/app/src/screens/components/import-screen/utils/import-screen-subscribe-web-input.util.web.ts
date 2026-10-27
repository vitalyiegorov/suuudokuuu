import { defaultSudokuConfig } from '@suuudokuuu/generator';

import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import type { Dispatch, SetStateAction } from 'react';

const { blankCellValue, fieldSize } = defaultSudokuConfig;
const lastCellIndex = fieldSize * fieldSize - 1;
const digitCodePattern = /^(?:Digit|Numpad)([1-9])$/u;
const clearCodePattern = /^(?:Digit0|Numpad0|Backspace|Delete)$/u;

const getArrowTarget = (cellIndex: number, key: string): number | null => {
    const column = cellIndex % fieldSize;
    const arrowTargets: Record<string, number> = {
        ArrowDown: cellIndex + fieldSize <= lastCellIndex ? cellIndex + fieldSize : cellIndex,
        ArrowLeft: column > 0 ? cellIndex - 1 : cellIndex,
        ArrowRight: column < fieldSize - 1 ? cellIndex + 1 : cellIndex,
        ArrowUp: cellIndex - fieldSize >= 0 ? cellIndex - fieldSize : cellIndex
    };

    return arrowTargets[key] ?? null;
};

export const importScreenSubscribeWebInput = (
    onPaste: (text: string) => void,
    onSelectCell: Dispatch<SetStateAction<number | null>>,
    onInput: (value: number) => void
) => {
    const handlePaste = (event: ClipboardEvent) => {
        const text = event.clipboardData?.getData('text/plain') ?? '';

        if (isNotEmptyString(text)) {
            event.preventDefault();
            onPaste(text);
        }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        const digitMatch = digitCodePattern.exec(event.code);

        if (event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }

        if (isDefined(getArrowTarget(0, event.key))) {
            event.preventDefault();
            onSelectCell(current => (isDefined(current) ? getArrowTarget(current, event.key) : 0));
        } else if (isDefined(digitMatch)) {
            event.preventDefault();
            onInput(Number(digitMatch[1]));
        } else if (clearCodePattern.test(event.code)) {
            event.preventDefault();
            onInput(blankCellValue);
        }
    };

    document.addEventListener('paste', handlePaste);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
        document.removeEventListener('paste', handlePaste);
        window.removeEventListener('keydown', handleKeyDown);
    };
};
