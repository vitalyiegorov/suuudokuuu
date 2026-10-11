import { isDefined } from '@rnw-community/shared';

import { HintRegionKindEnum } from '../enums/hint-region-kind.enum';

import type { HintRegionInterface } from '../interfaces/hint-region.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export const getHintRegion = (
    cells: readonly CellInterface[],
    placementCell?: CellInterface,
    scriptPlacementCell?: CellInterface
): HintRegionInterface | null => {
    const [firstCell] = cells;
    const fallbackPlacementCell = placementCell ?? scriptPlacementCell;

    if (cells.length < 2) {
        return isDefined(fallbackPlacementCell) ? { kind: HintRegionKindEnum.ROW, number: fallbackPlacementCell.y + 1 } : null;
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

    return isDefined(fallbackPlacementCell) ? { kind: HintRegionKindEnum.ROW, number: fallbackPlacementCell.y + 1 } : null;
};
