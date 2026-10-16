import { getCellKey } from '@suuudokuuu/field-core';

import { gameGetWitnessPoint } from './game-get-witness-point.util';

import type { WitnessBadgeInterface } from '../interface/witness-badge.interface';
import type { ChainCandidateInterface } from '@suuudokuuu/techniques';

const centerCandidateValue = 5;
const badgeRadiusRatio = 0.24;
const sharedCellBadgeRadiusRatio = 0.13;
const sharedCellSpreadScale = 1.45;

export const gameGetWitnessBadges = (
    candidates: readonly Pick<ChainCandidateInterface, 'cell' | 'value'>[],
    cellSize: number,
    cellMargin: number
): WitnessBadgeInterface[] => {
    const cellKeys = candidates.map(({ cell }) => getCellKey(cell));

    return candidates.map(({ cell, value }, index) => {
        const isSharedCell = cellKeys.indexOf(cellKeys[index]) !== cellKeys.lastIndexOf(cellKeys[index]);
        const center = gameGetWitnessPoint(cell, centerCandidateValue, cellSize, cellMargin);
        const point = gameGetWitnessPoint(cell, value, cellSize, cellMargin);
        const spreadScale = isSharedCell ? sharedCellSpreadScale : 1;

        return {
            x: center.x + (point.x - center.x) * spreadScale,
            y: center.y + (point.y - center.y) * spreadScale,
            radius: cellSize * (isSharedCell ? sharedCellBadgeRadiusRatio : badgeRadiusRatio),
            value
        };
    });
};
