import { BlankCellValueConstant, type FieldInterface, FieldSizeConstant } from './game';
import { getGroupValue } from './game/utils/create-cell.util';

export class GameLogic {
    private readonly emptyStringValue = '.';
    private readonly field: FieldInterface;

    constructor(fieldString: string) {
        this.field = this.fromString(fieldString);
    }

    toString(): string {
        return this.field
            .map(row => row.map(cell => (cell.value === BlankCellValueConstant ? this.emptyStringValue : cell.value)).join(''))
            .join('');
    }

    private fromString(fieldString: string): FieldInterface {
        const emptyField: FieldInterface = Array.from({ length: FieldSizeConstant }, () => Array.from({ length: FieldSizeConstant }));

        return fieldString.split('').reduce((acc, stringValue, index) => {
            const x = index % FieldSizeConstant;
            const y = Math.floor(index / FieldSizeConstant);
            const value = stringValue === this.emptyStringValue ? BlankCellValueConstant : parseInt(stringValue, 10);

            acc[y][x] = { x, y, value, group: getGroupValue(x, y) };

            return acc;
        }, emptyField);
    }
}
