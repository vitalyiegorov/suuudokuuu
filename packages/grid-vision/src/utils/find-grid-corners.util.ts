import { adaptiveThreshold } from './adaptive-threshold.util';
import { dilateMask } from './dilate-mask.util';
import { keepThinInk } from './keep-thin-ink.util';
import { labelComponents } from './label-components.util';

import type { BinaryImageInterface } from '../interfaces/binary-image.interface';
import type { ConnectedComponentInterface } from '../interfaces/connected-component.interface';
import type { GrayImageInterface } from '../interfaces/gray-image.interface';
import type { PointInterface } from '../interfaces/point.interface';

const GRID_THRESHOLD_RADIUS_RATIO = 0.025;
const GRID_THRESHOLD_SENSITIVITY = 0.1;
const BRIDGE_RADIUS_RATIO = 0.008;
const MINIMUM_GRID_SIDE_RATIO = 0.25;
const MAXIMUM_CANDIDATE_COUNT = 3;

const findCorners = (mask: BinaryImageInterface, labels: Int32Array, component: ConnectedComponentInterface): PointInterface[] => {
    const corners = [
        { x: 0, y: 0, score: Infinity },
        { x: 0, y: 0, score: -Infinity },
        { x: 0, y: 0, score: -Infinity },
        { x: 0, y: 0, score: Infinity }
    ];

    for (let y = component.minY; y <= component.maxY; y += 1) {
        for (let x = component.minX; x <= component.maxX; x += 1) {
            const index = y * mask.width + x;

            if (mask.data[index] === 1 && labels[index] === component.label) {
                corners[0] = x + y < corners[0].score ? { x, y, score: x + y } : corners[0];
                corners[1] = x - y > corners[1].score ? { x: x + 1, y, score: x - y } : corners[1];
                corners[2] = x + y > corners[2].score ? { x: x + 1, y: y + 1, score: x + y } : corners[2];
                corners[3] = x - y < corners[3].score ? { x, y: y + 1, score: x - y } : corners[3];
            }
        }
    }

    return corners;
};

export const findGridCorners = (gray: GrayImageInterface, isFusedSearch: boolean): PointInterface[][] => {
    const longestSide = Math.max(gray.width, gray.height);
    const minimumSide = MINIMUM_GRID_SIDE_RATIO * Math.min(gray.width, gray.height);
    const mask = adaptiveThreshold(gray, Math.round(longestSide * GRID_THRESHOLD_RADIUS_RATIO), GRID_THRESHOLD_SENSITIVITY);
    const bridgeRadius = Math.max(1, Math.round(longestSide * BRIDGE_RADIUS_RATIO));
    const inkMask = isFusedSearch ? keepThinInk(mask, bridgeRadius) : mask;

    return [inkMask, dilateMask(inkMask, bridgeRadius)]
        .map(labelComponents)
        .flatMap(({ labels, components }) =>
            components
                .filter(component => component.maxX - component.minX >= minimumSide && component.maxY - component.minY >= minimumSide)
                .map(component => ({ labels, component, area: (component.maxX - component.minX) * (component.maxY - component.minY) }))
        )
        .sort((first, second) => second.area - first.area)
        .slice(0, MAXIMUM_CANDIDATE_COUNT)
        .map(({ labels, component }) => findCorners(inkMask, labels, component));
};
