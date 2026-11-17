import { GRID_SIZE, PIXEL_CENTER } from '../constants/grid-vision.constant';

import type { GrayImageInterface } from '../interfaces/gray-image.interface';
import type { PointInterface } from '../interfaces/point.interface';

const LINE_COUNT = GRID_SIZE + 1;
const BOX_SIZE = 3;
const BOX_LINE_WEIGHT = 2;
const CELL_LINE_WEIGHT = 0.5;
const CELL_CENTER_WEIGHT = 0.75;
const RIDGE_CONTRAST = 6;
const RIDGE_REACH = 3;
const STEP_CONTRAST = 24;
const STEP = 1;
const RIDGE = 2;
const MINIMUM_SIDE_RATIO = 0.25;
const MAXIMUM_SIDE_RATIO = 1.05;
const PITCH_STEP = 0.25;
const PITCH_TOLERANCE = 0.08;
const CANDIDATE_COUNT = 3;
const SMALLER_PITCH_MARGIN = 0.05;
const MINIMUM_CONTRAST = 0.3;
const CONFIDENT_CONTRAST = 0.55;
const MINIMUM_VISIBLE_RATIO = 0.65;
const VISIBLE_LINE_QUANTILE = 0.75;
const OUTSIDE_LINE_PENALTY = 1;
const VISIBLE_SIDE_BONUS = 0.2;
const LINE_REACH = 1;
const REFINE_WINDOW_RATIO = 0.2;
const REFINE_MINIMUM_WEIGHT = 0.3;
const REFINE_PASSES = 2;

interface ProfileInterface {
    readonly lines: Float32Array;
    readonly frame: Float32Array;
}

interface CombInterface {
    readonly start: number;
    readonly pitch: number;
    readonly score: number;
}

const findRidges = ({ width, height, data }: GrayImageInterface, isHorizontal: boolean): Uint8Array => {
    const ridges = new Uint8Array(width * height);
    const step = isHorizontal ? width : 1;

    for (let index = 0; index < ridges.length; index += 1) {
        const position = isHorizontal ? Math.floor(index / width) : index % width;
        const limit = isHorizontal ? height : width;
        let kind = 0;

        for (let reach = 1; reach <= RIDGE_REACH && kind < RIDGE && position - reach >= 0 && position + reach < limit; reach += 1) {
            const before = data[index - reach * step] - data[index];
            const after = data[index + reach * step] - data[index];
            const isRidge =
                (before >= RIDGE_CONTRAST && after >= RIDGE_CONTRAST) || (before <= -RIDGE_CONTRAST && after <= -RIDGE_CONTRAST);

            kind = isRidge ? RIDGE : Math.max(kind, Math.abs(before - after) >= STEP_CONTRAST ? STEP : 0);
        }

        ridges[index] = kind;
    }

    return ridges;
};

const measureProfile = (
    gray: GrayImageInterface,
    ridges: Uint8Array,
    isRows: boolean,
    span: Pick<CombInterface, 'pitch' | 'start'>
): ProfileInterface => {
    const first = Math.max(0, Math.floor(span.start));
    const last = Math.min(isRows ? gray.width : gray.height, Math.ceil(span.start + GRID_SIZE * span.pitch));
    const lines = new Float32Array(isRows ? gray.height : gray.width);
    const frame = new Float32Array(lines.length);

    for (let line = 0; line < lines.length; line += 1) {
        let ridgeSum = 0;
        let edgeSum = 0;

        for (let along = first; along < last; along += 1) {
            const kind = ridges[isRows ? line * gray.width + along : along * gray.width + line];

            ridgeSum += kind === RIDGE ? 1 : 0;
            edgeSum += kind === 0 ? 0 : 1;
        }

        lines[line] = ridgeSum / Math.max(1, last - first);
        frame[line] = edgeSum / Math.max(1, last - first);
    }

    return { lines, frame };
};

const readBand = (profile: Float32Array, position: number, reach = 1): number => {
    const center = Math.round(position);
    let strongest = 0;

    for (let offset = -reach; offset <= reach; offset += 1) {
        strongest = Math.max(strongest, profile[center + offset] ?? 0);
    }

    return strongest;
};

const readLine = (profile: ProfileInterface, line: number, position: number): number =>
    readBand(line === 0 || line === GRID_SIZE ? profile.frame : profile.lines, position, LINE_REACH);

const scoreComb = (profile: ProfileInterface, start: number, pitch: number): number => {
    let score = 0;

    for (let line = 0; line < LINE_COUNT; line += 1) {
        score += (line % BOX_SIZE === 0 ? BOX_LINE_WEIGHT : CELL_LINE_WEIGHT) * readLine(profile, line, start + line * pitch);
        score -= line < GRID_SIZE ? CELL_CENTER_WEIGHT * readBand(profile.lines, start + (line + PIXEL_CENTER) * pitch) : 0;
    }

    return score;
};

const findCombs = (profile: ProfileInterface, minimumPitch: number, maximumPitch: number): CombInterface[] => {
    const combs: CombInterface[] = [];

    for (let pitch = maximumPitch; pitch >= minimumPitch; pitch -= PITCH_STEP) {
        for (let start = -pitch; start + (GRID_SIZE - 1) * pitch < profile.lines.length; start += 1) {
            const score = scoreComb(profile, start, pitch);
            const similar = combs.findIndex(
                comb => Math.abs(comb.start - start) <= comb.pitch / 2 && Math.abs(comb.pitch - pitch) <= comb.pitch * PITCH_TOLERANCE
            );
            const weakest = similar === -1 && combs.length === CANDIDATE_COUNT ? combs.length - 1 : similar;
            const isBetter = weakest === -1 || score > combs[weakest].score + SMALLER_PITCH_MARGIN * Math.abs(combs[weakest].score);

            if (isBetter) {
                combs.splice(weakest === -1 ? combs.length : weakest, weakest === -1 ? 0 : 1, { start, pitch, score });
                combs.sort((first, second) => second.score - first.score);
            }
        }
    }

    return combs;
};

const sightLines = (profile: Float32Array, comb: CombInterface) => {
    const window = Math.max(LINE_REACH + 1, Math.round(comb.pitch * REFINE_WINDOW_RATIO));

    return Array.from({ length: LINE_COUNT }, (_, line) => {
        const center = Math.round(comb.start + line * comb.pitch);
        let weight = 0;
        let moment = 0;

        for (let position = center - window; position <= center + window; position += 1) {
            weight += profile[position] ?? 0;
            moment += (profile[position] ?? 0) * position;
        }

        return { line, weight, centroid: moment / Math.max(weight, Number.EPSILON) };
    }).filter(sighting => sighting.weight >= REFINE_MINIMUM_WEIGHT);
};

const refineComb = ({ lines: profile }: ProfileInterface, comb: CombInterface): CombInterface => {
    let refined = comb;

    for (let pass = 0; pass < REFINE_PASSES; pass += 1) {
        const sightings = sightLines(profile, refined);
        const weightSum = sightings.reduce((total, sighting) => total + sighting.weight, 0);
        const lineSum = sightings.reduce((total, sighting) => total + sighting.weight * sighting.line, 0);
        const positionSum = sightings.reduce((total, sighting) => total + sighting.weight * sighting.centroid, 0);
        const lineSquareSum = sightings.reduce((total, sighting) => total + sighting.weight * sighting.line * sighting.line, 0);
        const linePositionSum = sightings.reduce((total, sighting) => total + sighting.weight * sighting.line * sighting.centroid, 0);
        const spread = weightSum * lineSquareSum - lineSum * lineSum;
        const pitch = spread > 0 ? (weightSum * linePositionSum - lineSum * positionSum) / spread : refined.pitch;
        const isPlausible = weightSum > 0 && Math.abs(pitch - comb.pitch) <= comb.pitch * PITCH_TOLERANCE;

        refined = isPlausible ? { ...refined, pitch, start: (positionSum - pitch * lineSum) / weightSum } : refined;
    }

    return refined;
};

const measureContrast = (profile: ProfileInterface, comb: CombInterface): number => {
    let lines = 0;
    let centers = 0;

    for (let line = 0; line < LINE_COUNT; line += 1) {
        const position = comb.start + line * comb.pitch;

        lines +=
            (readBand(profile.lines, position, LINE_REACH) -
                (position < 0 || position > profile.lines.length - 1 ? OUTSIDE_LINE_PENALTY : 0)) /
            LINE_COUNT;
        centers += line < GRID_SIZE ? readBand(profile.lines, comb.start + (line + PIXEL_CENTER) * comb.pitch) / GRID_SIZE : 0;
    }

    return lines - centers;
};

const measureLineVisibility = ({ lines: profile }: ProfileInterface, across: CombInterface): number =>
    Array.from({ length: LINE_COUNT }, (_, line) => readBand(profile, across.start + line * across.pitch)).sort(
        (first, second) => first - second
    )[Math.floor(VISIBLE_LINE_QUANTILE * LINE_COUNT)];

const findOuterCells = (along: CombInterface) =>
    [0, GRID_SIZE - 1].map(cell => ({ start: along.start + cell * along.pitch, pitch: along.pitch / GRID_SIZE }));

export const findGridLattice = (gray: GrayImageInterface) => {
    const horizontal = findRidges(gray, true);
    const vertical = findRidges(gray, false);
    const shortestSide = Math.min(gray.width, gray.height);
    const wholeHeight = { start: 0, pitch: gray.height / GRID_SIZE };
    const lattices = findCombs(
        measureProfile(gray, vertical, false, wholeHeight),
        (shortestSide * MINIMUM_SIDE_RATIO) / GRID_SIZE,
        (shortestSide * MAXIMUM_SIDE_RATIO) / GRID_SIZE
    ).flatMap(roughColumns => {
        const rowProfile = measureProfile(gray, horizontal, true, roughColumns);

        return findCombs(rowProfile, roughColumns.pitch * (1 - PITCH_TOLERANCE), roughColumns.pitch * (1 + PITCH_TOLERANCE)).map(
            roughRows => {
                const rows = refineComb(rowProfile, roughRows);
                const columnProfile = measureProfile(gray, vertical, false, rows);
                const columns = refineComb(columnProfile, roughColumns);
                const visibleRows = findOuterCells(rows).map(cell =>
                    measureLineVisibility(measureProfile(gray, vertical, false, cell), columns)
                );
                const visibleColumns = findOuterCells(columns).map(cell =>
                    measureLineVisibility(measureProfile(gray, horizontal, true, cell), rows)
                );
                const contrast = Math.min(measureContrast(rowProfile, rows), measureContrast(columnProfile, columns));
                const visibleSum = [...visibleRows, ...visibleColumns].reduce((total, ratio) => total + ratio, 0);

                return { columns, rows, visibleRows, visibleColumns, contrast, rank: contrast + VISIBLE_SIDE_BONUS * visibleSum };
            }
        );
    });
    const best = lattices.reduce<(typeof lattices)[number] | null>(
        (winner, lattice) => (winner === null || lattice.rank > winner.rank ? lattice : winner),
        null
    );

    if (best === null || best.contrast < MINIMUM_CONTRAST) {
        return null;
    }

    const { columns, rows } = best;
    const [left, right] = [columns.start, columns.start + GRID_SIZE * columns.pitch].map(position => position + PIXEL_CENTER);
    const [top, bottom] = [rows.start, rows.start + GRID_SIZE * rows.pitch].map(position => position + PIXEL_CENTER);
    const corners: PointInterface[] = [
        { x: left, y: top },
        { x: right, y: top },
        { x: right, y: bottom },
        { x: left, y: bottom }
    ];

    return {
        corners,
        isConfident: best.contrast >= CONFIDENT_CONTRAST,
        visibleRows: best.visibleRows.map(ratio => ratio >= MINIMUM_VISIBLE_RATIO),
        visibleColumns: best.visibleColumns.map(ratio => ratio >= MINIMUM_VISIBLE_RATIO)
    };
};
