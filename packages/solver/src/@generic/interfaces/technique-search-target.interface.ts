import type { TechniqueSearchIntentType } from '../types/technique-search-intent.type';
import type { CellInterface } from '@suuudokuuu/generator';

export interface TechniqueSearchTargetInterface {
    readonly cell: CellInterface;
    readonly value: number;
    readonly intent: TechniqueSearchIntentType;
}
