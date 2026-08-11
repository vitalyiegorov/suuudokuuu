import type { FieldDirectionType } from '@suuudokuuu/field-core';

export const getKeyDirection = (key: string): FieldDirectionType | null => {
    switch (key) {
        case 'ArrowUp':
            return 'up';
        case 'ArrowDown':
            return 'down';
        case 'ArrowLeft':
            return 'left';
        case 'ArrowRight':
            return 'right';
        default:
            return null;
    }
};
