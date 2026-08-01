import type { FinnedFishBaseType } from './finned-fish-base.type';
import type { CellInterface } from '@suuudokuuu/generator';

export type FinnedFishScanType = FinnedFishBaseType & {
    readonly bodyCells: CellInterface[];
    readonly coverIndexes: number[];
    readonly finCells: CellInterface[];
    readonly value: number;
};
