import { CELL_SIZE, GRID_SIZE, LINE_BAND, WARPED_GRID_SIZE } from '../constants/grid-vision.constant';

import type { BinaryImageInterface } from '../interfaces/binary-image.interface';
import type { PointInterface } from '../interfaces/point.interface';

const PIXEL_CENTER = 0.5;
const STRIP_LENGTH = WARPED_GRID_SIZE / 3;
const FIRST_STRIP_CENTER = STRIP_LENGTH / 2;
const LAST_STRIP_CENTER = WARPED_GRID_SIZE - STRIP_LENGTH / 2;
const MINIMUM_VISIBLE_GRID_RATIO = 0.7;
const MAXIMUM_PITCH = CELL_SIZE / MINIMUM_VISIBLE_GRID_RATIO;
const MINIMUM_PITCH_RATIO = 0.9;
const MINIMUM_PITCH = CELL_SIZE * MINIMUM_PITCH_RATIO;
const PITCH_STEP = 0.25;
const BOX_SIZE = 3;
const BOX_LINE_WEIGHT = 2;
const GRID_END_SLACK = 15;

const measureStripProfile = (mask: BinaryImageInterface, isVertical: boolean, stripCenter: number): Float32Array => {
    const profile = new Float32Array(WARPED_GRID_SIZE);

    for (let position = 0; position < WARPED_GRID_SIZE; position += 1) {
        let runLength = 0;

        for (let along = stripCenter - STRIP_LENGTH / 2; along <= stripCenter + STRIP_LENGTH / 2; along += 1) {
            const isInk =
                along < stripCenter + STRIP_LENGTH / 2 &&
                mask.data[isVertical ? along * WARPED_GRID_SIZE + position : position * WARPED_GRID_SIZE + along] === 1;

            profile[position] += !isInk && runLength >= CELL_SIZE ? runLength : 0;
            runLength = isInk ? runLength + 1 : 0;
        }
    }

    return profile;
};

const sumLineBand = (profile: Float32Array, center: number, weigh: (position: number) => number): number => {
    let sum = 0;

    for (let position = Math.max(0, center - LINE_BAND); position <= Math.min(WARPED_GRID_SIZE - 1, center + LINE_BAND); position += 1) {
        sum += profile[position] * weigh(position);
    }

    return sum;
};

const findLineComb = (profile: Float32Array) => {
    const smoothed = profile.map((_, center) => sumLineBand(profile, center, position => LINE_BAND + 1 - Math.abs(position - center)));
    let best = { start: 0, pitch: CELL_SIZE, score: -Infinity };

    for (let pitch = MINIMUM_PITCH; pitch <= MAXIMUM_PITCH; pitch += PITCH_STEP) {
        for (let start = WARPED_GRID_SIZE - GRID_END_SLACK - GRID_SIZE * pitch; start <= GRID_END_SLACK; start += 1) {
            let score = 0;

            for (let line = 0; line <= GRID_SIZE; line += 1) {
                score += (smoothed[Math.round(start + line * pitch)] ?? 0) * (line % BOX_SIZE === 0 ? BOX_LINE_WEIGHT : 1);
            }

            best = score > best.score ? { start, pitch, score } : best;
        }
    }

    return best;
};

const fitGridEdges = (mask: BinaryImageInterface, isVertical: boolean, stripCenter: number) => {
    const profile = measureStripProfile(mask, isVertical, stripCenter);
    const comb = findLineComb(profile);
    const lines = Array.from({ length: GRID_SIZE - 1 }, (_, index) => {
        const line = index + 1;
        const center = Math.round(comb.start + line * comb.pitch);
        const weight = sumLineBand(profile, center, () => 1);

        return { line, weight, position: sumLineBand(profile, center, position => position) / weight };
    }).filter(({ weight }) => weight >= STRIP_LENGTH);
    const lineSum = lines.reduce((total, { line }) => total + line, 0);
    const positionSum = lines.reduce((total, { position }) => total + position, 0);
    const spread = lines.reduce((total, { line }) => total + (line * lines.length - lineSum) ** 2, 0);
    const pitch =
        spread > 0
            ? lines.reduce((total, { line, position }) => total + (line * lines.length - lineSum) * position, 0) * (lines.length / spread)
            : comb.pitch;
    const start = spread > 0 ? (positionSum - pitch * lineSum) / lines.length : comb.start;

    return { start: start + PIXEL_CENTER, end: start + GRID_SIZE * pitch + PIXEL_CENTER };
};

const fitGridSides = (mask: BinaryImageInterface, isVertical: boolean) => {
    const first = fitGridEdges(mask, isVertical, FIRST_STRIP_CENTER);
    const last = fitGridEdges(mask, isVertical, LAST_STRIP_CENTER);

    return [
        { first: first.start, last: last.start },
        { first: first.end, last: last.end }
    ].map(({ first: firstPosition, last: lastPosition }) => {
        const slope = (lastPosition - firstPosition) / (LAST_STRIP_CENTER - FIRST_STRIP_CENTER);

        return { slope, intercept: firstPosition - slope * FIRST_STRIP_CENTER };
    });
};

export const fitGridCorners = (mask: BinaryImageInterface): PointInterface[] => {
    const [top, bottom] = fitGridSides(mask, false);
    const [left, right] = fitGridSides(mask, true);

    return [
        [top, left],
        [top, right],
        [bottom, right],
        [bottom, left]
    ].map(([horizontal, vertical]) => {
        const y = (horizontal.intercept + horizontal.slope * vertical.intercept) / (1 - horizontal.slope * vertical.slope);

        return { x: vertical.intercept + vertical.slope * y, y };
    });
};
