import { dilateMask } from './dilate-mask.util';

import type { BinaryImageInterface } from '../interfaces/binary-image.interface';

export const keepThinInk = (mask: BinaryImageInterface, radius: number): BinaryImageInterface => {
    const paper = new Uint8Array(mask.data.length);

    for (let index = 0; index < paper.length; index += 1) {
        paper[index] = 1 - mask.data[index];
    }

    const widePaper = dilateMask({ ...mask, data: paper }, radius).data;

    for (let index = 0; index < paper.length; index += 1) {
        paper[index] = 1 - widePaper[index];
    }

    const solid = dilateMask({ ...mask, data: paper }, radius).data;
    const data = new Uint8Array(mask.data.length);

    for (let index = 0; index < data.length; index += 1) {
        data[index] = solid[index] === 1 ? 0 : mask.data[index];
    }

    return { ...mask, data };
};
