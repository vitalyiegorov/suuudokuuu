import { writeFileSync } from 'node:fs';

import { createCanvas } from '@napi-rs/canvas';
import jpeg from 'jpeg-js';

import { CELL_COUNT, DIGIT_COUNT, GLYPH_SIZE } from '../src/constants/grid-vision.constant';
import { findGridBoard } from '../src/utils/find-grid-board.util';
import { readGridGlyphs } from '../src/utils/read-grid-glyphs.util';
import { locateKernel, measureLayerOutputSize, runClassifierLayer } from '../src/utils/run-classifier-layer.util';

import { WHOLE_IMAGE_REGION, readCanvasRegion } from './shared/read-canvas-region';
import { registerDigitFonts } from './shared/register-digit-fonts';
import { renderPhoneScreenshot } from './shared/render-phone-screenshot';
import { photographCanvas, renderFlatGrid } from './shared/render-synthetic-photo';
import { SeededRandom } from './shared/seeded-random';

import type { ClassifierLayerInterface } from '../src/interfaces/classifier-layer.interface';
import type { ClassifierParametersInterface } from '../src/interfaces/classifier-parameters.interface';
import type { RgbaImageInterface } from '../src/interfaces/rgba-image.interface';

const LAYERS: readonly ClassifierLayerInterface[] = [
    { inSize: GLYPH_SIZE, inChannels: 1, outChannels: 8, kernel: 5, stride: 2, padding: 2 },
    { inSize: 14, inChannels: 8, outChannels: 16, kernel: 3, stride: 2, padding: 1 },
    { inSize: 7, inChannels: 16, outChannels: 48, kernel: 7, stride: 1, padding: 0 },
    { inSize: 1, inChannels: 48, outChannels: DIGIT_COUNT, kernel: 1, stride: 1, padding: 0 }
];
const TRAINING = { seed: 606, photoCount: 1500, flatCount: 700, screenshotCount: 240 };
const HELD_OUT = { seed: 1606, photoCount: 300, flatCount: 150, screenshotCount: 80 };
const EPOCH_COUNT = 14;
const INITIAL_LEARNING_RATE = 0.008;
const INT8_LIMIT = 127;
const MAXIMUM_MISPLACED_CELL_COUNT = 2;
const PHOTO_CLUE_PROBABILITY = 0.45;
const PHOTO_JPEG_QUALITY = { minimum: 40, maximum: 90 };
const FLAT = { scale: { minimum: 0.7, maximum: 1.6 }, smoothChance: 0.8, jpegQuality: { minimum: 55, maximum: 100 } };
const SCREENSHOT = { digitProbability: 0.75, entryProbability: 0.55, smoothChance: 0.6, jpegQuality: { minimum: 70, maximum: 100 } };
const AUGMENTATION = {
    scale: { minimum: 0.88, maximum: 1.12 },
    shift: { minimum: -1.6, maximum: 1.6 },
    gamma: { minimum: 0.7, maximum: 1.4 }
};
const TEMPERATURES = Array.from({ length: 23 }, (_, step) => 0.5 + step / 4);
const CONFIDENT = 0.9;
const MINIMUM_PROBABILITY = 1e-9;
const OUTPUT_FILE = new URL('../src/constants/digit-classifier-weights.constant.ts', import.meta.url);

interface GlyphSetInterface {
    readonly glyphs: Float32Array[];
    readonly labels: number[];
}

interface LayerWeightsInterface extends ClassifierParametersInterface {
    readonly weights: Float32Array;
    readonly biases: Float32Array;
}

const collectGlyphs = (set: typeof TRAINING, families: readonly string[]): GlyphSetInterface => {
    const random = new SeededRandom(set.seed);
    const glyphs: Float32Array[] = [];
    const labels: number[] = [];
    let droppedCount = 0;
    const collect = (image: RgbaImageInterface, puzzle: string): void => {
        const board = findGridBoard(image, 1)?.board ?? null;
        const cells = board === null ? [] : readGridGlyphs(image, board);
        const misplacedCellCount =
            board === null ? CELL_COUNT : cells.filter((glyph, cell) => (glyph === null) !== (puzzle[cell] === '.')).length;

        droppedCount += misplacedCellCount > MAXIMUM_MISPLACED_CELL_COUNT ? 1 : 0;
        cells.forEach((glyph, cell) => {
            if (misplacedCellCount <= MAXIMUM_MISPLACED_CELL_COUNT && glyph !== null && puzzle[cell] !== '.') {
                glyphs.push(glyph.glyph);
                labels.push(Number(puzzle[cell]) - 1);
            }
        });
    };

    for (let photo = 0; photo < set.photoCount; photo += 1) {
        const puzzle = random.puzzle(PHOTO_CLUE_PROBABILITY);
        const encoded = photographCanvas(random, renderFlatGrid(random, puzzle, random.pick(families))).encodeSync(
            'jpeg',
            random.integer(PHOTO_JPEG_QUALITY)
        );
        const decoded = jpeg.decode(encoded, { useTArray: true });

        collect({ width: decoded.width, height: decoded.height, data: new Uint8ClampedArray(decoded.data.buffer) }, puzzle);
    }

    for (let flat = 0; flat < set.flatCount; flat += 1) {
        const puzzle = random.puzzle(PHOTO_CLUE_PROBABILITY);
        const grid = renderFlatGrid(random, puzzle, random.pick(families));
        const scale = random.between(FLAT.scale);
        const canvas = createCanvas(Math.round(grid.width * scale), Math.round(grid.height * scale));
        const context = canvas.getContext('2d');

        context.imageSmoothingEnabled = random.chance(FLAT.smoothChance);
        context.imageSmoothingQuality = 'high';
        context.drawImage(grid, 0, 0, canvas.width, canvas.height);
        collect(readCanvasRegion(canvas, WHOLE_IMAGE_REGION, true, random.integer(FLAT.jpegQuality)), puzzle);
    }

    for (let screenshot = 0; screenshot < set.screenshotCount; screenshot += 1) {
        const digits = random.puzzle(SCREENSHOT.digitProbability);
        const entryMask = Array.from(digits, (digit, cell) =>
            digit !== '.' && (cell === digits.search(/\d/u) || random.chance(SCREENSHOT.entryProbability)) ? 'h' : '.'
        ).join('');
        const source = renderPhoneScreenshot(random, digits, entryMask, random.pick(families));
        const isSmooth = random.chance(SCREENSHOT.smoothChance);
        const quality = random.integer(SCREENSHOT.jpegQuality);
        const overview = readCanvasRegion(source, WHOLE_IMAGE_REGION, isSmooth, quality);
        const closerRegion =
            findGridBoard(overview, Math.max(source.width, source.height) / Math.max(overview.width, overview.height))?.closerRegion ??
            null;

        collect(overview, digits);
        if (closerRegion !== null) {
            collect(readCanvasRegion(source, closerRegion, isSmooth, quality), digits);
        }
    }

    console.log(`Collected ${glyphs.length} glyphs, ${droppedCount} reads missed or misaligned`);

    return { glyphs, labels };
};

const createNetwork = (random: SeededRandom): LayerWeightsInterface[] =>
    LAYERS.map(layer => {
        const fanIn = layer.inChannels * layer.kernel ** 2;

        return {
            weights: Float32Array.from({ length: layer.outChannels * fanIn }, () => (random.next() * 2 - 1) * Math.sqrt(6 / fanIn)),
            weightScale: 1,
            biases: new Float32Array(layer.outChannels)
        };
    });

const runNetwork = (network: readonly LayerWeightsInterface[], glyph: Float32Array): Float32Array[] =>
    LAYERS.reduce(
        (activations, layer, index) => [
            ...activations,
            runClassifierLayer(layer, network[index], activations[index], index < LAYERS.length - 1)
        ],
        [glyph]
    );

const toProbabilities = (logits: Float32Array, temperature: number): Float32Array => {
    const largest = Math.max(...logits);
    const exponents = logits.map(logit => Math.exp((logit - largest) / temperature));
    const total = exponents.reduce((sum, value) => sum + value, 0);

    return exponents.map(value => value / total);
};

const trainKernel = (
    layer: ClassifierLayerInterface,
    weights: Float32Array,
    input: Float32Array,
    inputGradient: Float32Array,
    outputIndex: number,
    step: number
): void => {
    const { inSize, inChannels, kernel } = layer;
    const { weightOffset, originY, originX } = locateKernel(layer, outputIndex);

    for (let channel = 0; channel < inChannels; channel += 1) {
        for (let kernelY = 0; kernelY < kernel; kernelY += 1) {
            const weightRow = weightOffset + (channel * kernel + kernelY) * kernel;
            const inputRow = (channel * inSize + originY + kernelY) * inSize;

            for (let kernelX = 0; kernelX < kernel; kernelX += 1) {
                if (originY + kernelY >= 0 && originY + kernelY < inSize && originX + kernelX >= 0 && originX + kernelX < inSize) {
                    inputGradient[inputRow + originX + kernelX] += step * weights[weightRow + kernelX];
                    weights[weightRow + kernelX] -= step * input[inputRow + originX + kernelX];
                }
            }
        }
    }
};

const trainLayer = (
    layer: ClassifierLayerInterface,
    { weights, biases }: LayerWeightsInterface,
    input: Float32Array,
    outputGradient: Float32Array,
    learningRate: number
): Float32Array => {
    const outSize = measureLayerOutputSize(layer);
    const inputGradient = new Float32Array(input.length);

    for (let outputIndex = 0; outputIndex < outputGradient.length; outputIndex += 1) {
        const step = learningRate * outputGradient[outputIndex];

        if (step !== 0) {
            trainKernel(layer, weights, input, inputGradient, outputIndex, step);
            biases[Math.floor(outputIndex / outSize ** 2)] -= step;
        }
    }

    return inputGradient.map(gradient => gradient / learningRate);
};

const trainSample = (network: readonly LayerWeightsInterface[], glyph: Float32Array, label: number, learningRate: number): void => {
    const activations = runNetwork(network, glyph);
    const probabilities = toProbabilities(activations[LAYERS.length], 1);

    LAYERS.reduceRight(
        (outputGradient, layer, index) =>
            trainLayer(layer, network[index], activations[index], outputGradient, learningRate).map((gradient, pixel) =>
                index > 0 && activations[index][pixel] <= 0 ? 0 : gradient
            ),
        probabilities.map((probability, digit) => probability - (digit === label ? 1 : 0))
    );
};

const augmentGlyph = (random: SeededRandom, glyph: Float32Array): Float32Array => {
    const scale = random.between(AUGMENTATION.scale);
    const shiftX = random.between(AUGMENTATION.shift);
    const shiftY = random.between(AUGMENTATION.shift);
    const gamma = random.between(AUGMENTATION.gamma);
    const center = (GLYPH_SIZE - 1) / 2;
    const sample = (x: number, y: number): number => (x >= 0 && x < GLYPH_SIZE && y >= 0 && y < GLYPH_SIZE ? glyph[y * GLYPH_SIZE + x] : 0);

    return glyph.map((_, pixel) => {
        const sourceX = ((pixel % GLYPH_SIZE) - center) / scale + center - shiftX;
        const sourceY = (Math.floor(pixel / GLYPH_SIZE) - center) / scale + center - shiftY;
        const left = Math.floor(sourceX);
        const top = Math.floor(sourceY);
        const weightX = sourceX - left;
        const weightY = sourceY - top;

        return (
            ((sample(left, top) * (1 - weightX) + sample(left + 1, top) * weightX) * (1 - weightY) +
                (sample(left, top + 1) * (1 - weightX) + sample(left + 1, top + 1) * weightX) * weightY) **
            gamma
        );
    });
};

const readLogits = (network: readonly LayerWeightsInterface[], set: GlyphSetInterface): Float32Array[] =>
    set.glyphs.map(glyph => runNetwork(network, glyph)[LAYERS.length]);

const measure = (logits: readonly Float32Array[], labels: readonly number[], temperature: number) => {
    const results = logits.map((cellLogits, index) => {
        const probabilities = toProbabilities(cellLogits, temperature);
        const confidence = Math.max(...probabilities);

        return {
            isCorrect: probabilities.indexOf(confidence) === labels[index],
            isConfident: confidence >= CONFIDENT,
            loss: -Math.log(Math.max(MINIMUM_PROBABILITY, probabilities[labels[index]]))
        };
    });

    return {
        accuracy: results.filter(result => result.isCorrect).length / results.length,
        confidentErrorCount: results.filter(result => !result.isCorrect && result.isConfident).length,
        loss: results.reduce((total, result) => total + result.loss, 0) / results.length
    };
};

const formatPercent = (ratio: number): string => `${(ratio * 100).toFixed(2)}%`;

const quantize = (network: readonly LayerWeightsInterface[]) =>
    network.map(({ weights, biases }) => {
        const weightScale = Math.max(...weights.map(Math.abs)) / INT8_LIMIT;

        return { weightScale, biases, values: Int8Array.from(weights, weight => Math.round(weight / weightScale)) };
    });

const writeWeightsModule = (quantized: ReturnType<typeof quantize>, temperature: number): void => {
    const floats = Float32Array.from(quantized.flatMap(({ weightScale, biases }) => [weightScale, ...biases]));
    const bytes = Buffer.concat([Buffer.from(floats.buffer), ...quantized.map(({ values }) => Buffer.from(values.buffer))]);
    const padded = Buffer.concat([bytes, Buffer.alloc((3 - (bytes.length % 3)) % 3)]);

    writeFileSync(
        OUTPUT_FILE,
        [
            '// Generated by packages/grid-vision/scripts/train-digit-classifier.ts from synthetic printed digits. Do not edit by hand.',
            "import type { ClassifierLayerInterface } from '../interfaces/classifier-layer.interface';",
            '',
            'export const DIGIT_CLASSIFIER_LAYERS: readonly ClassifierLayerInterface[] = [',
            LAYERS.map(
                layer =>
                    `    { ${Object.entries(layer)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ')} }`
            ).join(',\n'),
            '];',
            `export const DIGIT_CLASSIFIER_TEMPERATURE = ${temperature};`,
            '',
            `export const DIGIT_CLASSIFIER_BASE64 = '${padded.toString('base64')}';`,
            ''
        ].join('\n')
    );
    console.log(`Wrote ${padded.length} weight bytes`);
};

const fonts = registerDigitFonts();
const trainingSet = collectGlyphs(TRAINING, fonts.trainingFamilies);
const heldOutSet = collectGlyphs(HELD_OUT, fonts.heldOutFamilies);
const random = new SeededRandom(TRAINING.seed);
const network = createNetwork(random);
const order = trainingSet.glyphs.map((_, index) => index);

for (let epoch = 0; epoch < EPOCH_COUNT; epoch += 1) {
    const learningRate = INITIAL_LEARNING_RATE * (1 - epoch / EPOCH_COUNT);

    for (let index = order.length - 1; index > 0; index -= 1) {
        const swapIndex = random.integer({ minimum: 0, maximum: index });

        [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
    }

    for (const sample of order) {
        trainSample(network, augmentGlyph(random, trainingSet.glyphs[sample]), trainingSet.labels[sample], learningRate);
    }

    console.log(
        `Epoch ${epoch + 1}: held-out accuracy ${formatPercent(measure(readLogits(network, heldOutSet), heldOutSet.labels, 1).accuracy)}`
    );
}

console.log(`Training accuracy ${formatPercent(measure(readLogits(network, trainingSet), trainingSet.labels, 1).accuracy)}`);

const quantized = quantize(network);
const heldOutLogits = readLogits(
    quantized.map(({ weightScale, biases, values }) => ({
        biases,
        weightScale: 1,
        weights: Float32Array.from(values, value => value * weightScale)
    })),
    heldOutSet
);
const temperature = TEMPERATURES.map(candidate => ({ candidate, loss: measure(heldOutLogits, heldOutSet.labels, candidate).loss })).reduce(
    (best, current) => (current.loss < best.loss ? current : best)
).candidate;
const calibrated = measure(heldOutLogits, heldOutSet.labels, temperature);

writeWeightsModule(quantized, temperature);
console.log(
    `Quantized held-out accuracy ${formatPercent(calibrated.accuracy)}, ${calibrated.confidentErrorCount} of ${heldOutSet.glyphs.length} wrong at confidence ${CONFIDENT} or more, temperature ${temperature}`
);
