import type { ClassifierLayerInterface } from '../interfaces/classifier-layer.interface';

export const measureLayerOutputSize = ({ inSize, kernel, stride, padding }: ClassifierLayerInterface): number =>
    Math.floor((inSize + 2 * padding - kernel) / stride) + 1;
