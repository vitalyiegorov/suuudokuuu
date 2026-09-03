import type { LineType } from './line.type';

export type FishBaseType = {
    readonly unitPositions: readonly number[];
    readonly baseType: LineType;
    readonly coverType: LineType;
    readonly value: number;
};
