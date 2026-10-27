import { createCanvas } from '@napi-rs/canvas';

import { solveHomography } from '../../src/utils/solve-homography.util';

import type { PointInterface } from '../../src/interfaces/point.interface';
import type { SeededRandom } from './seeded-random';
import type { Canvas, SKRSContext2D } from '@napi-rs/canvas';

const GRID_SIZE = 9;
const BOX_SIZE = 3;
const RGBA = 4;
const MAXIMUM_CHANNEL = 255;
const HALF_TURN_DEGREES = 180;
const GRAIN_CENTER = 1.5;
const STYLE = {
    inkLevel: { minimum: 0, maximum: 70 },
    inkTint: { minimum: 0, maximum: 25 },
    paperLevel: { minimum: 215, maximum: 255 },
    paperGreenShade: { minimum: 0, maximum: 12 },
    paperBlueShade: { minimum: 0, maximum: 25 },
    referenceGridSize: 450,
    thinLineWidth: { minimum: 0.8, maximum: 2.2 },
    thickLineWidth: { minimum: 2.5, maximum: 6 },
    boxedStyleChance: 0.25,
    boxGap: { minimum: 0.008, maximum: 0.02 },
    givenFillLevel: { minimum: 200, maximum: 240 },
    givenFillChance: 0.3,
    boxedLineWidth: { minimum: 0.7, maximum: 1.6 },
    digitSize: { minimum: 0.45, maximum: 0.7 },
    strokeChance: 0.3,
    strokeWidthRatio: 0.06,
    boldChance: 0.3,
    digitOffset: { minimum: -0.07, maximum: 0.07 },
    digitTiltDegrees: 8,
    digitScaleX: { minimum: 0.85, maximum: 1.15 },
    digitScaleY: { minimum: 0.9, maximum: 1.1 },
    gridSize: { minimum: 300, maximum: 520 },
    paperMargin: { minimum: 0.03, maximum: 0.1 },
    clutterClearance: 1.1,
    clutterCount: { minimum: 4, maximum: 20 },
    clutterLineWidth: { minimum: 1, maximum: 6 },
    clutterMinimumSize: 10,
    clutterFontSize: { minimum: 10, maximum: 30 },
    quadSide: { minimum: 0.55, maximum: 0.88 },
    quadShift: { minimum: -0.08, maximum: 0.08 },
    quadRotationDegrees: 10,
    cornerJitter: { minimum: -0.06, maximum: 0.06 },
    lightBase: { minimum: 0.55, maximum: 1 },
    lightSlope: { minimum: -0.35, maximum: 0.35 },
    lightLimit: { minimum: 0.35, maximum: 1.15 },
    noise: { minimum: 0, maximum: 12 },
    photoHeight: { minimum: 480, maximum: 800 },
    photoWidthRatio: { minimum: 1.1, maximum: 1.6 },
    maximumPhotoSide: 800,
    blurRadius: { minimum: 0, maximum: 1.4 }
} as const;

const toRadians = (degrees: number): number => (degrees * Math.PI) / HALF_TURN_DEGREES;

const symmetric = (limit: number): { minimum: number; maximum: number } => ({ minimum: -limit, maximum: limit });

const toColor = (red: number, green: number, blue: number): string => `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`;

const randomInk = (random: SeededRandom): string => {
    const level = random.between(STYLE.inkLevel);

    return toColor(level + random.between(STYLE.inkTint), level, level + random.between(STYLE.inkTint));
};

const randomPaper = (random: SeededRandom): string => {
    const level = random.between(STYLE.paperLevel);

    return toColor(level, level - random.between(STYLE.paperGreenShade), level - random.between(STYLE.paperBlueShade));
};

const drawLinedGrid = (context: SKRSContext2D, random: SeededRandom, size: number): number[] => {
    const thinWidth = (random.between(STYLE.thinLineWidth) * size) / STYLE.referenceGridSize;
    const thickWidth = (random.between(STYLE.thickLineWidth) * size) / STYLE.referenceGridSize;
    const cell = size / GRID_SIZE;

    for (let line = 0; line <= GRID_SIZE; line += 1) {
        const position = Math.min(Math.max(line * cell, thickWidth / 2), size - thickWidth / 2);

        context.lineWidth = line % BOX_SIZE === 0 ? thickWidth : thinWidth;
        context.beginPath();
        context.moveTo(position, 0);
        context.lineTo(position, size);
        context.moveTo(0, position);
        context.lineTo(size, position);
        context.stroke();
    }

    return Array.from({ length: GRID_SIZE }, (_, index) => index * cell);
};

const drawBoxedGrid = (context: SKRSContext2D, random: SeededRandom, size: number): number[] => {
    const gap = size * random.between(STYLE.boxGap);
    const boxSize = (size - 2 * gap) / BOX_SIZE;
    const cell = boxSize / BOX_SIZE;
    const origins = Array.from(
        { length: GRID_SIZE },
        (_, index) => Math.floor(index / BOX_SIZE) * (boxSize + gap) + (index % BOX_SIZE) * cell
    );
    const givenFill = toColor(
        random.between(STYLE.givenFillLevel),
        random.between(STYLE.givenFillLevel),
        random.between(STYLE.givenFillLevel)
    );

    context.lineWidth = random.between(STYLE.boxedLineWidth);

    for (const y of origins) {
        for (const x of origins) {
            context.fillStyle = random.chance(STYLE.givenFillChance) ? givenFill : 'rgba(0, 0, 0, 0)';
            context.fillRect(x, y, cell, cell);
            context.strokeRect(x, y, cell, cell);
        }
    }

    return origins;
};

const drawDigits = (context: SKRSContext2D, random: SeededRandom, origins: readonly number[], puzzle: string, fontFamily: string): void => {
    const cell = origins[1] - origins[0];
    const fontSize = cell * random.between(STYLE.digitSize);
    const strokeWidth = random.chance(STYLE.strokeChance) ? random.between({ minimum: 0, maximum: fontSize * STYLE.strokeWidthRatio }) : 0;
    const tilt = toRadians(STYLE.digitTiltDegrees);

    context.font = `${random.chance(STYLE.boldChance) ? 'bold ' : ''}${fontSize.toFixed(1)}px "${fontFamily}"`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    for (let index = 0; index < puzzle.length; index += 1) {
        if (puzzle[index] !== '.') {
            context.save();
            context.translate(
                origins[index % GRID_SIZE] + cell * (0.5 + random.between(STYLE.digitOffset)),
                origins[Math.floor(index / GRID_SIZE)] + cell * (0.5 + random.between(STYLE.digitOffset))
            );
            context.rotate(random.between(symmetric(tilt)));
            context.scale(random.between(STYLE.digitScaleX), random.between(STYLE.digitScaleY));
            context.fillText(puzzle[index], 0, 0);
            context.lineWidth = strokeWidth;
            context.strokeText(puzzle[index], 0, 0);
            context.restore();
        }
    }
};

export const renderFlatGrid = (random: SeededRandom, puzzle: string, fontFamily: string): Canvas => {
    const size = random.integer(STYLE.gridSize);
    const margin = Math.round(size * random.between(STYLE.paperMargin));
    const canvas = createCanvas(size + 2 * margin, size + 2 * margin);
    const context = canvas.getContext('2d');
    const ink = randomInk(random);

    context.fillStyle = randomPaper(random);
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.translate(margin, margin);
    context.strokeStyle = ink;

    const origins = random.chance(STYLE.boxedStyleChance) ? drawBoxedGrid(context, random, size) : drawLinedGrid(context, random, size);

    context.fillStyle = ink;
    context.strokeStyle = ink;
    drawDigits(context, random, origins, puzzle, fontFamily);

    return canvas;
};

const clipAroundQuad = (context: SKRSContext2D, quad: readonly PointInterface[]): void => {
    const centerX = quad.reduce((total, corner) => total + corner.x, 0) / quad.length;
    const centerY = quad.reduce((total, corner) => total + corner.y, 0) / quad.length;
    const [first, ...rest] = quad.map(corner => ({
        x: centerX + (corner.x - centerX) * STYLE.clutterClearance,
        y: centerY + (corner.y - centerY) * STYLE.clutterClearance
    }));

    context.beginPath();
    context.rect(0, 0, context.canvas.width, context.canvas.height);
    context.moveTo(first.x, first.y);
    for (const corner of rest) {
        context.lineTo(corner.x, corner.y);
    }
    context.closePath();
    context.clip('evenodd');
};

const drawClutter = (context: SKRSContext2D, random: SeededRandom, quad: readonly PointInterface[]): void => {
    const { width, height } = context.canvas;

    context.save();
    clipAroundQuad(context, quad);

    for (let item = 0; item < random.integer(STYLE.clutterCount); item += 1) {
        context.fillStyle = random.chance(0.5) ? randomInk(random) : randomPaper(random);
        context.strokeStyle = context.fillStyle;
        context.lineWidth = random.between(STYLE.clutterLineWidth);

        if (random.chance(0.5)) {
            context.fillRect(
                random.between({ minimum: 0, maximum: width }),
                random.between({ minimum: 0, maximum: height }),
                random.between({ minimum: STYLE.clutterMinimumSize, maximum: width / 2 }),
                random.between({ minimum: STYLE.clutterMinimumSize, maximum: height / BOX_SIZE })
            );
        } else {
            context.font = `${random.integer(STYLE.clutterFontSize)}px sans-serif`;
            context.fillText(
                'Puzzle 1234 Sudoku news',
                random.between({ minimum: 0, maximum: width }),
                random.between({ minimum: 0, maximum: height })
            );
        }
    }

    context.restore();
};

const placeQuad = (random: SeededRandom, width: number, height: number, aspect: number): PointInterface[] => {
    const side = Math.min(width, height / aspect) * random.between(STYLE.quadSide);
    const centerX = width / 2 + random.between(STYLE.quadShift) * width;
    const centerY = height / 2 + random.between(STYLE.quadShift) * height;
    const rotation = random.between(symmetric(toRadians(STYLE.quadRotationDegrees)));
    const unitCorners = [
        { x: -0.5, y: -0.5 },
        { x: 0.5, y: -0.5 },
        { x: 0.5, y: 0.5 },
        { x: -0.5, y: 0.5 }
    ];

    return unitCorners.map(unit => {
        const jitterX = unit.x + random.between(STYLE.cornerJitter);
        const jitterY = (unit.y + random.between(STYLE.cornerJitter)) * aspect;

        return {
            x: Math.min(Math.max(centerX + side * (jitterX * Math.cos(rotation) - jitterY * Math.sin(rotation)), 0), width - 1),
            y: Math.min(Math.max(centerY + side * (jitterX * Math.sin(rotation) + jitterY * Math.cos(rotation)), 0), height - 1)
        };
    });
};

const projectFlat = (photo: Uint8ClampedArray, photoWidth: number, flat: Canvas, homography: Float64Array): void => {
    const flatPixels = flat.getContext('2d').getImageData(0, 0, flat.width, flat.height).data;
    const [h00, h01, h02, h10, h11, h12, h20, h21, h22] = homography;

    for (let index = 0; index < photo.length / RGBA; index += 1) {
        const x = (index % photoWidth) + 0.5;
        const y = Math.floor(index / photoWidth) + 0.5;
        const depth = h20 * x + h21 * y + h22;
        const flatX = Math.floor((h00 * x + h01 * y + h02) / depth);
        const flatY = Math.floor((h10 * x + h11 * y + h12) / depth);

        if (flatX >= 0 && flatY >= 0 && flatX < flat.width && flatY < flat.height) {
            photo.set(flatPixels.subarray((flatY * flat.width + flatX) * RGBA, (flatY * flat.width + flatX + 1) * RGBA), index * RGBA);
        }
    }
};

const applyLightingAndNoise = (photo: Uint8ClampedArray, width: number, height: number, random: SeededRandom): void => {
    const base = random.between(STYLE.lightBase);
    const slopeX = random.between(STYLE.lightSlope);
    const slopeY = random.between(STYLE.lightSlope);
    const noise = random.between(STYLE.noise);

    for (let index = 0; index < photo.length; index += 1) {
        const pixel = Math.floor(index / RGBA);
        const light = base + (slopeX * (pixel % width)) / width + (slopeY * Math.floor(pixel / width)) / height;
        const grain = (random.next() + random.next() + random.next() - GRAIN_CENTER) * noise;
        const limitedLight = Math.min(Math.max(light, STYLE.lightLimit.minimum), STYLE.lightLimit.maximum);

        photo[index] = index % RGBA === RGBA - 1 ? MAXIMUM_CHANNEL : photo[index] * limitedLight + grain;
    }
};

const resizeToQuad = (flat: Canvas, quad: readonly PointInterface[]): Canvas => {
    const scale = Math.min(1, Math.hypot(quad[1].x - quad[0].x, quad[1].y - quad[0].y) / flat.width);
    const resized = createCanvas(Math.round(flat.width * scale), Math.round(flat.height * scale));

    resized.getContext('2d').drawImage(flat, 0, 0, resized.width, resized.height);

    return resized;
};

export const photographCanvas = (random: SeededRandom, flat: Canvas): Canvas => {
    const height = random.integer(STYLE.photoHeight);
    const width = Math.min(STYLE.maximumPhotoSide, Math.round((height * flat.width * random.between(STYLE.photoWidthRatio)) / flat.height));
    const photo = createCanvas(width, height);
    const context = photo.getContext('2d');
    const quad = placeQuad(random, width, height, flat.height / flat.width);
    const resized = resizeToQuad(flat, quad);
    const flatCorners = [
        { x: 0, y: 0 },
        { x: resized.width, y: 0 },
        { x: resized.width, y: resized.height },
        { x: 0, y: resized.height }
    ];
    const homography = solveHomography(quad, flatCorners) ?? Float64Array.of(1, 0, 0, 0, 1, 0, 0, 0, 1);

    context.fillStyle = randomPaper(random);
    context.fillRect(0, 0, width, height);
    drawClutter(context, random, quad);

    const imageData = context.getImageData(0, 0, width, height);

    projectFlat(imageData.data, width, resized, homography);
    applyLightingAndNoise(imageData.data, width, height, random);
    context.putImageData(imageData, 0, 0);

    const blurred = createCanvas(width, height);
    const blurredContext = blurred.getContext('2d');

    blurredContext.filter = `blur(${random.between(STYLE.blurRadius).toFixed(2)}px)`;
    blurredContext.drawImage(photo, 0, 0);

    return blurred;
};
