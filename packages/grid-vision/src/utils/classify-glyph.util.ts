import {
    DIGIT_CLASSIFIER_BASE64,
    DIGIT_CLASSIFIER_LAYERS,
    DIGIT_CLASSIFIER_TEMPERATURE
} from '../constants/digit-classifier-weights.constant';

import { runClassifierLayer } from './run-classifier-layer.util';

const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const BASE64_RADIX = 64;
const BYTE_RADIX = 256;
const BASE64_GROUP_LENGTH = 4;
const BYTES_PER_GROUP = 3;
const FLOAT_BYTE_COUNT = 4;

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
const floatCount = DIGIT_CLASSIFIER_LAYERS.reduce((total, layer) => total + 1 + layer.outChannels, 0);
const floats = new Float32Array(weightBytes.buffer, 0, floatCount);
const layers = DIGIT_CLASSIFIER_LAYERS.map((layer, index) => {
    const previous = DIGIT_CLASSIFIER_LAYERS.slice(0, index);
    const floatOffset = previous.reduce((total, { outChannels }) => total + 1 + outChannels, 0);
    const weightOffset = previous.reduce((total, { inChannels, outChannels, kernel }) => total + outChannels * inChannels * kernel ** 2, 0);

    return {
        layer,
        parameters: {
            weightScale: floats[floatOffset],
            biases: floats.subarray(floatOffset + 1, floatOffset + 1 + layer.outChannels),
            weights: new Int8Array(
                weightBytes.buffer,
                floatCount * FLOAT_BYTE_COUNT + weightOffset,
                layer.outChannels * layer.inChannels * layer.kernel ** 2
            )
        }
    };
});

export const classifyGlyph = (glyph: Float32Array): Float32Array => {
    const logits = layers.reduce<Float32Array>(
        (input, { layer, parameters }, index) => runClassifierLayer(layer, parameters, input, index < layers.length - 1),
        glyph
    );
    const largestLogit = Math.max(...logits);
    const exponents = logits.map(logit => Math.exp((logit - largestLogit) / DIGIT_CLASSIFIER_TEMPERATURE));
    const exponentSum = exponents.reduce((total, exponent) => total + exponent, 0);

    return exponents.map(exponent => exponent / exponentSum);
};
