import { GRID_SIZE } from '../constants/grid-vision.constant';

import { adaptiveThreshold } from './adaptive-threshold.util';
import { labelComponents } from './label-components.util';

import type { BinaryImageInterface } from '../interfaces/binary-image.interface';
import type { ConnectedComponentInterface } from '../interfaces/connected-component.interface';
import type { GrayImageInterface } from '../interfaces/gray-image.interface';
import type { PointInterface } from '../interfaces/point.interface';

const THRESHOLD_RADIUS_RATIO = 0.025;
const THRESHOLD_SENSITIVITY = 0.1;
const BRIDGE_RADIUS_RATIO = 0.008;
const MINIMUM_GRID_SIDE_RATIO = 0.25;
const MINIMUM_HOLE_SIDE_RATIO = 0.02;
const MAXIMUM_HOLE_SIDE_RATIO = 1 / 3;
const MINIMUM_HOLE_SQUARENESS = 0.6;
const MINIMUM_HOLE_FILL = 0.5;
const SIMILAR_HOLE_SIDE_RATIO = 1.35;
const MINIMUM_HOLE_COUNT = GRID_SIZE;
const MAXIMUM_COMPONENT_CANDIDATE_COUNT = 3;

const measureWidth = (component: ConnectedComponentInterface): number => component.maxX - component.minX + 1;

const measureHeight = (component: ConnectedComponentInterface): number => component.maxY - component.minY + 1;

const measureSide = (component: ConnectedComponentInterface): number => Math.max(measureWidth(component), measureHeight(component));

const dilate = (mask: BinaryImageInterface, radius: number): BinaryImageInterface => {
    const horizontal = new Uint8Array(mask.data.length);
    const data = new Uint8Array(mask.data.length);

    for (let index = 0; index < data.length; index += 1) {
        const x = index % mask.width;

        for (let offset = Math.max(-radius, -x); offset <= Math.min(radius, mask.width - 1 - x) && horizontal[index] === 0; offset += 1) {
            horizontal[index] = mask.data[index + offset];
        }
    }

    for (let index = 0; index < data.length; index += 1) {
        const y = Math.floor(index / mask.width);

        for (let offset = Math.max(-radius, -y); offset <= Math.min(radius, mask.height - 1 - y) && data[index] === 0; offset += 1) {
            data[index] = horizontal[index + offset * mask.width];
        }
    }

    return { ...mask, data };
};

const findCorners = (width: number, pixelCount: number, isSelected: (index: number) => boolean): PointInterface[] => {
    const corners = [
        { x: 0, y: 0, score: Infinity },
        { x: 0, y: 0, score: -Infinity },
        { x: 0, y: 0, score: -Infinity },
        { x: 0, y: 0, score: Infinity }
    ];

    for (let index = 0; index < pixelCount; index += 1) {
        const x = index % width;
        const y = Math.floor(index / width);

        if (isSelected(index)) {
            corners[0] = x + y < corners[0].score ? { x, y, score: x + y } : corners[0];
            corners[1] = x - y > corners[1].score ? { x: x + 1, y, score: x - y } : corners[1];
            corners[2] = x + y > corners[2].score ? { x: x + 1, y: y + 1, score: x + y } : corners[2];
            corners[3] = x - y < corners[3].score ? { x, y: y + 1, score: x - y } : corners[3];
        }
    }

    return corners;
};

const findLargestSimilarGroup = (holes: readonly ConnectedComponentInterface[]): ConnectedComponentInterface[] => {
    const sorted = [...holes].sort((first, second) => measureSide(first) - measureSide(second));
    let best: ConnectedComponentInterface[] = [];
    let end = 0;

    for (let start = 0; start < sorted.length; start += 1) {
        while (end < sorted.length && measureSide(sorted[end]) <= measureSide(sorted[start]) * SIMILAR_HOLE_SIDE_RATIO) {
            end += 1;
        }

        best = end - start > best.length ? sorted.slice(start, end) : best;
    }

    return best;
};

const findCellHoleCorners = (mask: BinaryImageInterface): PointInterface[] | null => {
    const shortestSide = Math.min(mask.width, mask.height);
    const closed = dilate(mask, 1);
    const { labels, components } = labelComponents({ ...closed, data: closed.data.map(value => 1 - value) });
    const isCellShaped = (hole: ConnectedComponentInterface): boolean =>
        measureSide(hole) >= MINIMUM_HOLE_SIDE_RATIO * shortestSide &&
        measureSide(hole) <= MAXIMUM_HOLE_SIDE_RATIO * shortestSide &&
        Math.min(measureWidth(hole), measureHeight(hole)) >= MINIMUM_HOLE_SQUARENESS * measureSide(hole) &&
        hole.area >= MINIMUM_HOLE_FILL * measureWidth(hole) * measureHeight(hole);
    const group = findLargestSimilarGroup(components.filter(isCellShaped));
    const isGroupLabel = new Uint8Array(components.length + 1);

    for (const hole of group) {
        isGroupLabel[hole.label] = 1;
    }

    return group.length >= MINIMUM_HOLE_COUNT ? findCorners(mask.width, labels.length, index => isGroupLabel[labels[index]] === 1) : null;
};

const findComponentCorners = (mask: BinaryImageInterface): PointInterface[][] => {
    const longestSide = Math.max(mask.width, mask.height);
    const minimumGridSide = MINIMUM_GRID_SIDE_RATIO * Math.min(mask.width, mask.height);

    return [mask, dilate(mask, Math.max(1, Math.round(longestSide * BRIDGE_RADIUS_RATIO)))]
        .map(labelComponents)
        .flatMap(labeling =>
            labeling.components
                .filter(component => measureWidth(component) >= minimumGridSide && measureHeight(component) >= minimumGridSide)
                .map(component => ({ labels: labeling.labels, component }))
        )
        .sort(
            (first, second) =>
                measureWidth(second.component) * measureHeight(second.component) -
                measureWidth(first.component) * measureHeight(first.component)
        )
        .slice(0, MAXIMUM_COMPONENT_CANDIDATE_COUNT)
        .map(({ labels, component }) =>
            findCorners(mask.width, labels.length, index => mask.data[index] === 1 && labels[index] === component.label)
        );
};

export const findGridCorners = (gray: GrayImageInterface): PointInterface[][] => {
    const mask = adaptiveThreshold(gray, Math.round(Math.max(gray.width, gray.height) * THRESHOLD_RADIUS_RATIO), THRESHOLD_SENSITIVITY);
    const holeCorners = findCellHoleCorners(mask);

    return [...(holeCorners === null ? [] : [holeCorners]), ...findComponentCorners(mask)];
};
