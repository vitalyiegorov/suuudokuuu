import { DIGIT_CLASSIFIER_BASE64, DIGIT_CLASSIFIER_HIDDEN_SIZE } from '../constants/digit-classifier-weights.constant';
import { DIGIT_COUNT, GLYPH_PIXEL_COUNT } from '../constants/grid-vision.constant';

import type { DigitPredictionInterface } from '../interfaces/digit-prediction.interface';

const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const BASE64_RADIX = 64;
const BYTE_RADIX = 256;
const BASE64_GROUP_LENGTH = 4;
const BYTES_PER_GROUP = 3;
const FLOAT_BYTE_COUNT = 4;
const SCALE_COUNT = 2;

const decodeBase64 = (base64: string): Uint8Array => {
    const bytes = new Uint8Array((base64.length / BASE64_GROUP_LENGTH) * BYTES_PER_GROUP);

    for (let group = 0; group * BASE64_GROUP_LENGTH < base64.length; group += 1) {
        const value = Array.from(base64.slice(group * BASE64_GROUP_LENGTH, (group + 1) * BASE64_GROUP_LENGTH)).reduce(
            (total, character) => total * BASE64_RADIX + BASE64_ALPHABET.indexOf(character),
            0
        );

        bytes[group * BYTES_PER_GROUP] = Math.floor(value / (BYTE_RADIX * BYTE_RADIX));
        bytes[group * BYTES_PER_GROUP + 1] = Math.floor(value / BYTE_RADIX) % BYTE_RADIX;
        bytes[group * BYTES_PER_GROUP + 2] = value % BYTE_RADIX;
    }

    return bytes;
};

const weightBytes = decodeBase64(DIGIT_CLASSIFIER_BASE64);
const floatCount = SCALE_COUNT + DIGIT_CLASSIFIER_HIDDEN_SIZE + DIGIT_COUNT;
const floats = new Float32Array(weightBytes.buffer, 0, floatCount);
const [hiddenScale, outputScale] = floats;
const hiddenBiases = floats.subarray(SCALE_COUNT, SCALE_COUNT + DIGIT_CLASSIFIER_HIDDEN_SIZE);
const outputBiases = floats.subarray(SCALE_COUNT + DIGIT_CLASSIFIER_HIDDEN_SIZE);
const hiddenWeights = new Int8Array(weightBytes.buffer, floatCount * FLOAT_BYTE_COUNT, GLYPH_PIXEL_COUNT * DIGIT_CLASSIFIER_HIDDEN_SIZE);
const outputWeights = new Int8Array(
    weightBytes.buffer,
    floatCount * FLOAT_BYTE_COUNT + GLYPH_PIXEL_COUNT * DIGIT_CLASSIFIER_HIDDEN_SIZE,
    DIGIT_CLASSIFIER_HIDDEN_SIZE * DIGIT_COUNT
);

const computeHiddenLayer = (glyph: Float32Array): Float32Array => {
    const hidden = new Float32Array(DIGIT_CLASSIFIER_HIDDEN_SIZE);

    for (let neuron = 0; neuron < DIGIT_CLASSIFIER_HIDDEN_SIZE; neuron += 1) {
        const rowOffset = neuron * GLYPH_PIXEL_COUNT;
        let sum = 0;

        for (let pixel = 0; pixel < GLYPH_PIXEL_COUNT; pixel += 1) {
            sum += hiddenWeights[rowOffset + pixel] * glyph[pixel];
        }

        hidden[neuron] = Math.max(0, hiddenBiases[neuron] + hiddenScale * sum);
    }

    return hidden;
};

const computeProbabilities = (hidden: Float32Array): Float32Array => {
    const logits = new Float32Array(DIGIT_COUNT);

    for (let digitIndex = 0; digitIndex < DIGIT_COUNT; digitIndex += 1) {
        const rowOffset = digitIndex * DIGIT_CLASSIFIER_HIDDEN_SIZE;
        let sum = 0;

        for (let neuron = 0; neuron < DIGIT_CLASSIFIER_HIDDEN_SIZE; neuron += 1) {
            sum += outputWeights[rowOffset + neuron] * hidden[neuron];
        }

        logits[digitIndex] = outputBiases[digitIndex] + outputScale * sum;
    }

    const largestLogit = Math.max(...logits);
    const exponents = logits.map(logit => Math.exp(logit - largestLogit));
    const exponentSum = exponents.reduce((total, exponent) => total + exponent, 0);

    return exponents.map(exponent => exponent / exponentSum);
};

export const classifyGlyph = (glyph: Float32Array): DigitPredictionInterface => {
    const probabilities = computeProbabilities(computeHiddenLayer(glyph));
    const ranked = Array.from(probabilities.keys()).sort((first, second) => probabilities[second] - probabilities[first]);
    const [bestIndex, alternativeIndex] = ranked;

    return { digit: bestIndex + 1, confidence: probabilities[bestIndex], alternative: alternativeIndex + 1 };
};
