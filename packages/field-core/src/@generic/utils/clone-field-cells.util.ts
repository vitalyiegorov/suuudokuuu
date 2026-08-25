import type { FieldInterface } from '@suuudokuuu/generator';

export const cloneFieldCells = (field: FieldInterface): FieldInterface => field.map(row => row.map(cell => ({ ...cell })));
