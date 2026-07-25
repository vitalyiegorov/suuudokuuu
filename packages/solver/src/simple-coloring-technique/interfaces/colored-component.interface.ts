import type { ColorType } from '../types/color.type';
import type { CellInterface } from '@suuudokuuu/generator';

export interface ColoredComponentInterface {
    readonly colorsByKey: Map<string, ColorType>;
    readonly cellsByKey: Map<string, CellInterface>;
}
