import { createCanvas } from '@napi-rs/canvas';

import type { SeededRandom } from './seeded-random';
import type { Canvas, SKRSContext2D } from '@napi-rs/canvas';

const GRID_SIZE = 9;
const BOX_SIZE = 3;
const RGBA = 4;
const FULL_TURN = 2 * Math.PI;
const HALF_TURN_DEGREES = 180;
const SCREENSHOT = { width: 1320, height: 2868 };
const PHOTO = { left: 54, top: 750, width: 1212, height: 1490, radius: 40, overscan: 1.03 };
const BOARD = { left: 56, top: 330, size: 1100, thinLineWidth: 2, boxLineWidth: 5 };
const SCREEN_TEXT = { titleBaseline: 120, difficultyBaseline: 250 };
const PAGE_TEXT = { firstBaseline: 640, secondBaseline: 710, footerOffset: 90 };
const DIGIT_SIZE_RATIO = 0.62;
const MARK_SIZE_RATIO = 0.2;
const MARK_COUNT = { minimum: 2, maximum: 3 };
const MARK_DIGITS = { minimum: 1, maximum: 9 };
const CAMERA = {
    tiltDegrees: { minimum: -0.6, maximum: 0.6 },
    shear: { minimum: -0.012, maximum: 0.012 },
    light: { minimum: 0.8, maximum: 0.95 },
    lightSlope: { minimum: -0.08, maximum: 0.08 },
    contrast: 0.82,
    blackLevel: 26,
    moireAmplitude: 0.035,
    moirePeriod: { minimum: 2.4, maximum: 3.4 },
    moireAngle: { minimum: 0, maximum: Math.PI },
    noise: 5,
    blurRadius: { minimum: 0.5, maximum: 0.9 }
};
const COLORS = {
    page: 'rgb(14, 17, 19)',
    pageText: 'rgb(215, 218, 220)',
    screen: 'rgb(238, 240, 243)',
    cell: 'rgb(250, 251, 253)',
    peer: 'rgb(226, 235, 243)',
    sameDigit: 'rgb(195, 215, 234)',
    selected: 'rgb(187, 222, 251)',
    thinLine: 'rgb(191, 198, 212)',
    boxLine: 'rgb(52, 72, 97)',
    given: 'rgb(29, 37, 51)',
    entry: 'rgb(50, 90, 175)',
    mark: 'rgb(110, 124, 140)'
};

const pickCellFill = (digits: string, cell: number, selectedCell: number): string => {
    const isPeer =
        cell % GRID_SIZE === selectedCell % GRID_SIZE ||
        Math.floor(cell / GRID_SIZE) === Math.floor(selectedCell / GRID_SIZE) ||
        (Math.floor(cell / GRID_SIZE / BOX_SIZE) === Math.floor(selectedCell / GRID_SIZE / BOX_SIZE) &&
            Math.floor((cell % GRID_SIZE) / BOX_SIZE) === Math.floor((selectedCell % GRID_SIZE) / BOX_SIZE));

    if (cell === selectedCell) {
        return COLORS.selected;
    }

    if (digits[cell] !== '.' && digits[cell] === digits[selectedCell]) {
        return COLORS.sameDigit;
    }

    return isPeer ? COLORS.peer : COLORS.cell;
};

const drawPencilMarks = (context: SKRSContext2D, random: SeededRandom, left: number, top: number, cellSize: number): void => {
    context.fillStyle = COLORS.mark;
    context.font = `${Math.round(MARK_SIZE_RATIO * cellSize)}px sans-serif`;

    for (let mark = 0; mark < random.integer(MARK_COUNT); mark += 1) {
        const digit = random.integer(MARK_DIGITS);

        context.fillText(
            digit.toString(),
            left + ((((digit - 1) % BOX_SIZE) + 0.5) * cellSize) / BOX_SIZE,
            top + ((Math.floor((digit - 1) / BOX_SIZE) + 0.5) * cellSize) / BOX_SIZE
        );
    }
};

const drawAppScreen = (random: SeededRandom, digits: string, entryMask: string, fontFamily: string): Canvas => {
    const canvas = createCanvas(PHOTO.width, PHOTO.height);
    const context = canvas.getContext('2d');
    const cellSize = BOARD.size / GRID_SIZE;
    const selectedCell = random.pick(Array.from(entryMask, (_, cell) => cell).filter(cell => entryMask[cell] === 'h'));

    context.fillStyle = COLORS.screen;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = COLORS.given;
    context.font = 'bold 64px sans-serif';
    context.fillText('Sudoku board', BOARD.left, SCREEN_TEXT.titleBaseline);
    context.font = '34px sans-serif';
    context.fillText('Difficulty:  Easy  Medium  Hard  Expert  Master', BOARD.left, SCREEN_TEXT.difficultyBaseline);
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    for (let cell = 0; cell < digits.length; cell += 1) {
        const left = BOARD.left + (cell % GRID_SIZE) * cellSize;
        const top = BOARD.top + Math.floor(cell / GRID_SIZE) * cellSize;

        context.fillStyle = pickCellFill(digits, cell, selectedCell);
        context.fillRect(left, top, cellSize, cellSize);

        if (digits[cell] === '.') {
            drawPencilMarks(context, random, left, top, cellSize);
        } else {
            context.fillStyle = entryMask[cell] === 'h' ? COLORS.entry : COLORS.given;
            context.font = `${Math.round(DIGIT_SIZE_RATIO * cellSize)}px "${fontFamily}"`;
            context.fillText(digits[cell], left + cellSize / 2, top + cellSize / 2);
        }
    }

    for (let line = 0; line <= GRID_SIZE; line += 1) {
        context.strokeStyle = line % BOX_SIZE === 0 ? COLORS.boxLine : COLORS.thinLine;
        context.lineWidth = line % BOX_SIZE === 0 ? BOARD.boxLineWidth : BOARD.thinLineWidth;
        context.beginPath();
        context.moveTo(BOARD.left + line * cellSize, BOARD.top);
        context.lineTo(BOARD.left + line * cellSize, BOARD.top + BOARD.size);
        context.moveTo(BOARD.left, BOARD.top + line * cellSize);
        context.lineTo(BOARD.left + BOARD.size, BOARD.top + line * cellSize);
        context.stroke();
    }

    return canvas;
};

const photographScreen = (random: SeededRandom, screen: Canvas): Canvas => {
    const tilted = createCanvas(screen.width, screen.height);
    const tiltedContext = tilted.getContext('2d');
    const base = random.between(CAMERA.light);
    const slopeX = random.between(CAMERA.lightSlope);
    const slopeY = random.between(CAMERA.lightSlope);
    const period = random.between(CAMERA.moirePeriod);
    const angle = random.between(CAMERA.moireAngle);

    tiltedContext.translate(screen.width / 2, screen.height / 2);
    tiltedContext.rotate((random.between(CAMERA.tiltDegrees) * Math.PI) / HALF_TURN_DEGREES);
    tiltedContext.transform(1, random.between(CAMERA.shear), random.between(CAMERA.shear), 1, 0, 0);
    tiltedContext.scale(PHOTO.overscan, PHOTO.overscan);
    tiltedContext.drawImage(screen, -screen.width / 2, -screen.height / 2);

    const pixels = tiltedContext.getImageData(0, 0, screen.width, screen.height);

    for (let pixel = 0; pixel < pixels.data.length / RGBA; pixel += 1) {
        const x = pixel % screen.width;
        const y = Math.floor(pixel / screen.width);
        const light = base + (slopeX * x) / screen.width + (slopeY * y) / screen.height;
        const moire = 1 + CAMERA.moireAmplitude * Math.sin((FULL_TURN * (x * Math.cos(angle) + y * Math.sin(angle))) / period);

        for (let channel = 0; channel < RGBA - 1; channel += 1) {
            pixels.data[pixel * RGBA + channel] =
                pixels.data[pixel * RGBA + channel] * light * moire * CAMERA.contrast +
                CAMERA.blackLevel +
                (random.next() - 0.5) * 2 * CAMERA.noise;
        }
    }

    tiltedContext.putImageData(pixels, 0, 0);

    const photo = createCanvas(screen.width, screen.height);
    const photoContext = photo.getContext('2d');

    photoContext.filter = `blur(${random.between(CAMERA.blurRadius).toFixed(2)}px)`;
    photoContext.drawImage(tilted, 0, 0);

    return photo;
};

export const renderPhoneScreenshot = (random: SeededRandom, digits: string, entryMask: string, fontFamily: string): Canvas => {
    const canvas = createCanvas(SCREENSHOT.width, SCREENSHOT.height);
    const context = canvas.getContext('2d');

    context.fillStyle = COLORS.page;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = COLORS.pageText;
    context.font = '54px sans-serif';
    context.fillText('Often find myself stuck here, what is', PHOTO.left, PAGE_TEXT.firstBaseline);
    context.fillText('your strategy?', PHOTO.left, PAGE_TEXT.secondBaseline);
    context.fillText('52 votes   32 comments', PHOTO.left, PHOTO.top + PHOTO.height + PAGE_TEXT.footerOffset);
    context.beginPath();
    context.roundRect(PHOTO.left, PHOTO.top, PHOTO.width, PHOTO.height, PHOTO.radius);
    context.clip();
    context.drawImage(photographScreen(random, drawAppScreen(random, digits, entryMask, fontFamily)), PHOTO.left, PHOTO.top);

    return canvas;
};
