import type { ClassifierLayerInterface } from '../interfaces/classifier-layer.interface';
import type { ClassifierParametersInterface } from '../interfaces/classifier-parameters.interface';

export const measureLayerOutputSize = ({ inSize, kernel, stride, padding }: ClassifierLayerInterface): number =>
    Math.floor((inSize + 2 * padding - kernel) / stride) + 1;

export const locateKernel = (layer: ClassifierLayerInterface, outputIndex: number) => {
    const outSize = measureLayerOutputSize(layer);

    return {
        weightOffset: Math.floor(outputIndex / outSize ** 2) * layer.inChannels * layer.kernel ** 2,
        originY: (Math.floor(outputIndex / outSize) % outSize) * layer.stride - layer.padding,
        originX: (outputIndex % outSize) * layer.stride - layer.padding
    };
};

const sumKernel = (layer: ClassifierLayerInterface, weights: ArrayLike<number>, input: Float32Array, outputIndex: number): number => {
    const { inSize, inChannels, kernel } = layer;
    const { weightOffset, originY, originX } = locateKernel(layer, outputIndex);
    const firstY = Math.max(0, -originY);
    const lastY = Math.min(kernel, inSize - originY);
    const firstX = Math.max(0, -originX);
    const lastX = Math.min(kernel, inSize - originX);
    let sum = 0;

    for (let channel = 0; channel < inChannels; channel += 1) {
        for (let kernelY = firstY; kernelY < lastY; kernelY += 1) {
            const weightRow = weightOffset + (channel * kernel + kernelY) * kernel;
            const inputRow = (channel * inSize + originY + kernelY) * inSize + originX;

            for (let kernelX = firstX; kernelX < lastX; kernelX += 1) {
                sum += weights[weightRow + kernelX] * input[inputRow + kernelX];
            }
        }
    }

    return sum;
};

export const runClassifierLayer = (
    layer: ClassifierLayerInterface,
    { weights, weightScale, biases }: ClassifierParametersInterface,
    input: Float32Array,
    isRectified: boolean
): Float32Array => {
    const outArea = measureLayerOutputSize(layer) ** 2;
    const output = new Float32Array(layer.outChannels * outArea);

    for (let outputIndex = 0; outputIndex < output.length; outputIndex += 1) {
        const sum = biases[Math.floor(outputIndex / outArea)] + weightScale * sumKernel(layer, weights, input, outputIndex);

        output[outputIndex] = isRectified && sum < 0 ? 0 : sum;
    }

    return output;
};
