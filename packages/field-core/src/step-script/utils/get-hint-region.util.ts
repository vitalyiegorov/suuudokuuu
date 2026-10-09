import { isDefined } from '@rnw-community/shared';

import { HintRegionKindEnum } from '../enums/hint-region-kind.enum';

import type { HintRegionInterface } from '../interfaces/hint-region.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export const getHintRegion = (cells: readonly CellInterface[], placementCell?: CellInterface): HintRegionInterface | null => {
    const [firstCell] = cells;

    if (cells.length < 2) {
        return isDefined(placementCell) ? { kind: HintRegionKindEnum.ROW, number: placementCell.y + 1 } : null;
    }

    if (cells.every(cell => cell.y === firstCell.y)) {
        return { kind: HintRegionKindEnum.ROW, number: firstCell.y + 1 };
    }

    if (cells.every(cell => cell.x === firstCell.x)) {
        return { kind: HintRegionKindEnum.COLUMN, number: firstCell.x + 1 };
    }

    if (cells.every(cell => cell.group === firstCell.group)) {
        return { kind: HintRegionKindEnum.BOX, number: firstCell.group + 1 };
    }

    return isDefined(placementCell) ? { kind: HintRegionKindEnum.ROW, number: placementCell.y + 1 } : null;
};
