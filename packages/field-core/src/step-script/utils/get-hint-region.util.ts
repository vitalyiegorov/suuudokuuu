import { defaultSudokuConfig } from '@suuudokuuu/generator';

import { isDefined } from '@rnw-community/shared';

import { HintRegionKindEnum } from '../enums/hint-region-kind.enum';

import type { HintRegionInterface } from '../interfaces/hint-region.interface';
import type { CellInterface } from '@suuudokuuu/generator';

const { fieldGroupHeight, fieldGroupWidth, fieldSize } = defaultSudokuConfig;

const getBoxNumber = (cell: Pick<CellInterface, 'x' | 'y'>): number =>
    Math.floor(cell.y / fieldGroupHeight) * (fieldSize / fieldGroupWidth) + Math.floor(cell.x / fieldGroupWidth) + 1;

const getTargetRegion = (targetCell?: CellInterface): HintRegionInterface | null =>
    isDefined(targetCell) ? { kind: HintRegionKindEnum.CELL, number: getBoxNumber(targetCell), cell: targetCell } : null;

export const getHintRegion = (cells: readonly CellInterface[], targetCell?: CellInterface): HintRegionInterface | null => {
    const [firstCell] = cells;

    if (cells.length < 2) {
        return getTargetRegion(targetCell);
    }

    if (cells.every(cell => cell.y === firstCell.y)) {
        return { kind: HintRegionKindEnum.ROW, number: firstCell.y + 1 };
    }

    if (cells.every(cell => cell.x === firstCell.x)) {
        return { kind: HintRegionKindEnum.COLUMN, number: firstCell.x + 1 };
    }

    if (cells.every(cell => cell.group === firstCell.group)) {
        return { kind: HintRegionKindEnum.BOX, number: getBoxNumber(firstCell) };
    }

    return getTargetRegion(targetCell);
};
