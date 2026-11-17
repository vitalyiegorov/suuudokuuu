import { measureLayerOutputSize } from './measure-layer-output-size.util';

import type { ClassifierLayerInterface } from '../interfaces/classifier-layer.interface';

export const locateKernel = (layer: ClassifierLayerInterface, outputIndex: number) => {
    const outSize = measureLayerOutputSize(layer);
    const channel = Math.floor(outputIndex / outSize ** 2);

    return {
        channel,
        weightOffset: channel * layer.inChannels * layer.kernel ** 2,
        originY: (Math.floor(outputIndex / outSize) % outSize) * layer.stride - layer.padding,
        originX: (outputIndex % outSize) * layer.stride - layer.padding
    };
};
