import type { HintRegionKindEnum } from '../enums/hint-region-kind.enum';
import type { CellInterface } from '@suuudokuuu/generator';

export interface HintRegionInterface {
    readonly kind: HintRegionKindEnum;
    readonly number: number;
    readonly cell?: CellInterface;
}
