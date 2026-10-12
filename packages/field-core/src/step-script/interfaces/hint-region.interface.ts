import type { HintRegionKindEnum } from '../enums/hint-region-kind.enum';

export interface HintRegionInterface {
    readonly kind: HintRegionKindEnum;
    readonly number: number;
}
