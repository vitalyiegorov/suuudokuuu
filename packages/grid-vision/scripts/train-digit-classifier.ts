import { writeFileSync } from 'node:fs';

import jpeg from 'jpeg-js';

import { CELL_COUNT, DIGIT_COUNT, GLYPH_PIXEL_COUNT } from '../src/constants/grid-vision.constant';
import { readGridGlyphs } from '../src/utils/read-grid-glyphs.util';

import { registerDigitFonts } from './shared/register-digit-fonts';
import { photographCanvas, renderFlatGrid } from './shared/render-synthetic-photo';
import { SeededRandom } from './shared/seeded-random';

const TRAINING_PHOTO_COUNT = 1500;
const HELD_OUT_PHOTO_COUNT = 200;
const TRAINING_SEED = 606;
const HELD_OUT_SEED = 1606;
const HIDDEN_SIZE = 96;
const EPOCH_COUNT = 14;
const INITIAL_LEARNING_RATE = 0.02;
const CLUE_PROBABILITY = 0.45;
const INT8_LIMIT = 127;
const MAXIMUM_MISPLACED_CELL_COUNT = 2;
const JPEG_QUALITY = { minimum: 40, maximum: 90 };
const OUTPUT_FILE = new URL('../src/constants/digit-classifier-weights.constant.ts', import.meta.url);

interface GlyphSetInterface {
    readonly glyphs: Float32Array[];
    readonly labels: number[];
}

interface NetworkInterface {
    readonly hiddenWeights: Float32Array;
    readonly hiddenBiases: Float32Array;
    readonly outputWeights: Float32Array;
    readonly outputBiases: Float32Array;
}

const collectGlyphs = (seed: number, photoCount: number, families: readonly string[]): GlyphSetInterface => {
    const random = new SeededRandom(seed);
    const glyphs: Float32Array[] = [];
    const labels: number[] = [];
    let missedGridCount = 0;

    for (let photo = 0; photo < photoCount; photo += 1) {
        const puzzle = random.puzzle(CLUE_PROBABILITY);
        const encoded = photographCanvas(random, renderFlatGrid(random, puzzle, random.pick(families))).encodeSync(
            'jpeg',
            random.integer(JPEG_QUALITY)
        );
        const decoded = jpeg.decode(encoded, { useTArray: true });
        const cellGlyphs = readGridGlyphs({
            width: decoded.width,
            height: decoded.height,
            data: new Uint8ClampedArray(decoded.data.buffer)
        });

        const misplacedCellCount = cellGlyphs?.filter((glyph, cell) => (glyph === null) !== (puzzle[cell] === '.')).length ?? CELL_COUNT;
        const isAligned = misplacedCellCount <= MAXIMUM_MISPLACED_CELL_COUNT;

        missedGridCount += isAligned ? 0 : 1;
        cellGlyphs?.forEach((glyph, cell) => {
            if (isAligned && glyph !== null && puzzle[cell] !== '.') {
                glyphs.push(glyph);
                labels.push(Number(puzzle[cell]) - 1);
            }
        });
    }

    console.log(`Collected ${glyphs.length} glyphs from ${photoCount} photos, ${missedGridCount} grids missed or misaligned`);

    return { glyphs, labels };
};

const createNetwork = (random: SeededRandom): NetworkInterface => {
    const initialize = (count: number, fanIn: number): Float32Array =>
        Float32Array.from({ length: count }, () => (random.next() * 2 - 1) * Math.sqrt(6 / fanIn));

    return {
        hiddenWeights: initialize(HIDDEN_SIZE * GLYPH_PIXEL_COUNT, GLYPH_PIXEL_COUNT),
        hiddenBiases: new Float32Array(HIDDEN_SIZE),
        outputWeights: initialize(DIGIT_COUNT * HIDDEN_SIZE, HIDDEN_SIZE),
        outputBiases: new Float32Array(DIGIT_COUNT)
    };
};

const forward = (
    network: NetworkInterface,
    glyph: Float32Array,
    activeInputs: readonly number[]
): { hidden: Float32Array; probabilities: Float32Array } => {
    const hidden = new Float32Array(HIDDEN_SIZE);
    const logits = new Float32Array(DIGIT_COUNT);

    for (let neuron = 0; neuron < HIDDEN_SIZE; neuron += 1) {
        let sum = network.hiddenBiases[neuron];

        for (const pixel of activeInputs) {
            sum += network.hiddenWeights[neuron * GLYPH_PIXEL_COUNT + pixel] * glyph[pixel];
        }

        hidden[neuron] = Math.max(0, sum);
    }

    for (let digit = 0; digit < DIGIT_COUNT; digit += 1) {
        let sum = network.outputBiases[digit];

        for (let neuron = 0; neuron < HIDDEN_SIZE; neuron += 1) {
            sum += network.outputWeights[digit * HIDDEN_SIZE + neuron] * hidden[neuron];
        }

        logits[digit] = sum;
    }

    const largest = Math.max(...logits);
    const exponents = logits.map(logit => Math.exp(logit - largest));
    const total = exponents.reduce((sum, value) => sum + value, 0);

    return { hidden, probabilities: exponents.map(value => value / total) };
};

const listActiveInputs = (glyph: Float32Array): number[] =>
    Array.from({ length: GLYPH_PIXEL_COUNT }, (_, pixel) => pixel).filter(pixel => glyph[pixel] > 0);

const trainSample = (network: NetworkInterface, glyph: Float32Array, label: number, learningRate: number): void => {
    const activeInputs = listActiveInputs(glyph);
    const { hidden, probabilities } = forward(network, glyph, activeInputs);
    const outputGradients = probabilities.map((probability, digit) => probability - (digit === label ? 1 : 0));
    const hiddenGradients = new Float32Array(HIDDEN_SIZE);

    for (let digit = 0; digit < DIGIT_COUNT; digit += 1) {
        for (let neuron = 0; neuron < HIDDEN_SIZE; neuron += 1) {
            hiddenGradients[neuron] +=
                hidden[neuron] > 0 ? outputGradients[digit] * network.outputWeights[digit * HIDDEN_SIZE + neuron] : 0;
            network.outputWeights[digit * HIDDEN_SIZE + neuron] -= learningRate * outputGradients[digit] * hidden[neuron];
        }

        network.outputBiases[digit] -= learningRate * outputGradients[digit];
    }

    for (let neuron = 0; neuron < HIDDEN_SIZE; neuron += 1) {
        for (const pixel of activeInputs) {
            network.hiddenWeights[neuron * GLYPH_PIXEL_COUNT + pixel] -= learningRate * hiddenGradients[neuron] * glyph[pixel];
        }

        network.hiddenBiases[neuron] -= learningRate * hiddenGradients[neuron];
    }
};

const predict = (network: NetworkInterface, glyph: Float32Array): number => {
    const { probabilities } = forward(network, glyph, listActiveInputs(glyph));

    return probabilities.indexOf(Math.max(...probabilities));
};

const measureAccuracy = (network: NetworkInterface, set: GlyphSetInterface): number =>
    set.glyphs.filter((glyph, index) => predict(network, glyph) === set.labels[index]).length / set.glyphs.length;

const quantize = (weights: Float32Array): { scale: number; values: Int8Array } => {
    const scale = Math.max(...weights.map(Math.abs)) / INT8_LIMIT;

    return { scale, values: Int8Array.from(weights, weight => Math.round(weight / scale)) };
};

const writeWeightsModule = (network: NetworkInterface): NetworkInterface => {
    const hidden = quantize(network.hiddenWeights);
    const output = quantize(network.outputWeights);
    const floats = Float32Array.from([hidden.scale, output.scale, ...network.hiddenBiases, ...network.outputBiases]);
    const bytes = Buffer.concat([Buffer.from(floats.buffer), Buffer.from(hidden.values.buffer), Buffer.from(output.values.buffer)]);
    const padded = Buffer.concat([bytes, Buffer.alloc((3 - (bytes.length % 3)) % 3)]);

    writeFileSync(
        OUTPUT_FILE,
        [
            '// Generated by packages/grid-vision/scripts/train-digit-classifier.ts from synthetic printed digits. Do not edit by hand.',
            `export const DIGIT_CLASSIFIER_HIDDEN_SIZE = ${HIDDEN_SIZE};`,
            '',
            `export const DIGIT_CLASSIFIER_BASE64 = '${padded.toString('base64')}';`,
            ''
        ].join('\n')
    );
    console.log(`Wrote ${padded.length} weight bytes`);

    return {
        hiddenWeights: Float32Array.from(hidden.values, value => value * hidden.scale),
        hiddenBiases: network.hiddenBiases,
        outputWeights: Float32Array.from(output.values, value => value * output.scale),
        outputBiases: network.outputBiases
    };
};

const fonts = registerDigitFonts();
const trainingSet = collectGlyphs(TRAINING_SEED, TRAINING_PHOTO_COUNT, fonts.trainingFamilies);
const heldOutSet = collectGlyphs(HELD_OUT_SEED, HELD_OUT_PHOTO_COUNT, fonts.heldOutFamilies);
const random = new SeededRandom(TRAINING_SEED);
const network = createNetwork(random);
const order = trainingSet.glyphs.map((_, index) => index);

for (let epoch = 0; epoch < EPOCH_COUNT; epoch += 1) {
    const learningRate = INITIAL_LEARNING_RATE * (1 - epoch / EPOCH_COUNT);

    for (let index = order.length - 1; index > 0; index -= 1) {
        const swapIndex = random.integer({ minimum: 0, maximum: index });

        [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
    }

    for (const sample of order) {
        trainSample(network, trainingSet.glyphs[sample], trainingSet.labels[sample], learningRate);
    }

    console.log(`Epoch ${epoch + 1}: held-out accuracy ${(measureAccuracy(network, heldOutSet) * 100).toFixed(2)}%`);
}

console.log(`Training accuracy ${(measureAccuracy(network, trainingSet) * 100).toFixed(2)}%`);
console.log(`Quantized held-out accuracy ${(measureAccuracy(writeWeightsModule(network), heldOutSet) * 100).toFixed(2)}%`);
