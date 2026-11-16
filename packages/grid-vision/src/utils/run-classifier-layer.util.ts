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
    let sum = 0;

    for (let channel = 0; channel < inChannels; channel += 1) {
        for (let kernelY = 0; kernelY < kernel; kernelY += 1) {
            const inY = originY + kernelY;

            if (inY >= 0 && inY < inSize) {
                const weightRow = weightOffset + (channel * kernel + kernelY) * kernel;
                const inputRow = (channel * inSize + inY) * inSize;

                for (let kernelX = 0; kernelX < kernel; kernelX += 1) {
                    const inX = originX + kernelX;

                    sum += inX >= 0 && inX < inSize ? weights[weightRow + kernelX] * input[inputRow + inX] : 0;
                }
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
    const outSize = measureLayerOutputSize(layer);

    return Float32Array.from({ length: layer.outChannels * outSize ** 2 }, (_, outputIndex) => {
        const sum = biases[Math.floor(outputIndex / outSize ** 2)] + weightScale * sumKernel(layer, weights, input, outputIndex);

        return isRectified ? Math.max(0, sum) : sum;
    });
};
