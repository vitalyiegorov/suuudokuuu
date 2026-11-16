import { LINE_STRIP_LENGTH, CELL_SIZE, GRID_SIZE, PIXEL_CENTER, WARPED_GRID_SIZE } from '../constants/grid-vision.constant';

import { measureLineProfile } from './measure-line-profile.util';
import { solveLinearSystem } from './solve-linear-system.util';

import type { BinaryImageInterface } from '../interfaces/binary-image.interface';
import type { PointInterface } from '../interfaces/point.interface';

interface LineSightingInterface {
    readonly isVertical: boolean;
    readonly line: number;
    readonly across: number;
    readonly along: number;
}

const SEARCH_RADIUS = 12;
const MAXIMUM_RESIDUAL = 2.5 / WARPED_GRID_SIZE;
const MINIMUM_LINE_COUNT = 3;
const MINIMUM_SIGHTING_COUNT = 8;
const UNKNOWN_COUNT = 8;
const STRIP_CENTERS = [LINE_STRIP_LENGTH / 2, WARPED_GRID_SIZE / 2, WARPED_GRID_SIZE - LINE_STRIP_LENGTH / 2];
const LINES = Array.from({ length: GRID_SIZE + 1 }, (_, index) => index);
const UNIT_CORNERS = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 }
];

const sightFrameEdge = (profile: Float32Array, start: number, step: number): number | null => {
    for (let offset = 0; offset <= SEARCH_RADIUS; offset += 1) {
        if (profile[start + step * offset] >= LINE_STRIP_LENGTH / 2) {
            return start + step * offset + (step < 0 ? 1 : 0);
        }
    }

    return null;
};

const sightLine = (profile: Float32Array, line: number): number | null => {
    if (line === 0 || line === GRID_SIZE) {
        return line === 0 ? sightFrameEdge(profile, 0, 1) : sightFrameEdge(profile, WARPED_GRID_SIZE - 1, -1);
    }

    let weight = 0;
    let moment = 0;

    for (let position = line * CELL_SIZE - SEARCH_RADIUS; position <= line * CELL_SIZE + SEARCH_RADIUS; position += 1) {
        weight += profile[position];
        moment += profile[position] * position;
    }

    return weight >= LINE_STRIP_LENGTH ? moment / weight + PIXEL_CENTER : null;
};

const sightLines = (mask: BinaryImageInterface, isVertical: boolean): LineSightingInterface[] =>
    STRIP_CENTERS.flatMap(stripCenter => {
        const profile = measureLineProfile(mask, isVertical, stripCenter);

        return LINES.flatMap(line => {
            const position = sightLine(profile, line);

            return position === null
                ? []
                : [{ isVertical, line, across: position / WARPED_GRID_SIZE, along: stripCenter / WARPED_GRID_SIZE }];
        });
    });

const buildEquation = ({ isVertical, line, across, along }: LineSightingInterface): number[] => {
    const target = line / GRID_SIZE;
    const point = isVertical ? [across, along] : [along, across];
    const depth = [-target * point[0], -target * point[1], target];

    return isVertical ? [...point, 1, 0, 0, 0, ...depth] : [0, 0, 0, ...point, 1, ...depth];
};

const fitProjection = (sightings: readonly LineSightingInterface[]): number[] | null => {
    const equations = sightings.map(buildEquation);

    return solveLinearSystem(
        Array.from({ length: UNKNOWN_COUNT }, (_, row) =>
            Array.from({ length: UNKNOWN_COUNT + 1 }, (__, column) =>
                equations.reduce((total, equation) => total + equation[row] * equation[column], 0)
            )
        )
    );
};

const measureResidual = (projection: readonly number[], sighting: LineSightingInterface): number => {
    const equation = buildEquation(sighting);

    return Math.abs(
        equation.slice(0, UNKNOWN_COUNT).reduce((total, factor, index) => total + factor * projection[index], 0) - equation[UNKNOWN_COUNT]
    );
};

const hasEnoughLines = (sightings: readonly LineSightingInterface[], isVertical: boolean): boolean => {
    const lines = sightings.filter(sighting => sighting.isVertical === isVertical).map(sighting => sighting.line);

    return lines.length >= MINIMUM_SIGHTING_COUNT && new Set(lines).size >= MINIMUM_LINE_COUNT;
};

export const refineGridCorners = (mask: BinaryImageInterface): PointInterface[] | null => {
    const sightings = [...sightLines(mask, true), ...sightLines(mask, false)];
    const roughProjection = fitProjection(sightings);
    const inliers =
        roughProjection === null ? [] : sightings.filter(sighting => measureResidual(roughProjection, sighting) <= MAXIMUM_RESIDUAL);
    const projection = hasEnoughLines(inliers, true) && hasEnoughLines(inliers, false) ? fitProjection(inliers) : null;

    if (projection === null) {
        return null;
    }

    const [xToAcross, yToAcross, acrossOffset, xToDown, yToDown, downOffset, xToDepth, yToDepth] = projection;
    const corners = UNIT_CORNERS.map(target =>
        solveLinearSystem([
            [xToAcross - target.x * xToDepth, yToAcross - target.x * yToDepth, target.x - acrossOffset],
            [xToDown - target.y * xToDepth, yToDown - target.y * yToDepth, target.y - downOffset]
        ])
    ).filter(corner => corner !== null);
    const isNearby = corners.every(
        ([x, y], index) => Math.hypot(x - UNIT_CORNERS[index].x, y - UNIT_CORNERS[index].y) * WARPED_GRID_SIZE <= SEARCH_RADIUS
    );

    return corners.length === UNIT_CORNERS.length && isNearby
        ? corners.map(([x, y]) => ({ x: x * WARPED_GRID_SIZE, y: y * WARPED_GRID_SIZE }))
        : null;
};
