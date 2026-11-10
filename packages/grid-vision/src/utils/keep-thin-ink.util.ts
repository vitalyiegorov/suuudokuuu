import { dilateMask } from './dilate-mask.util';

import type { BinaryImageInterface } from '../interfaces/binary-image.interface';

const invertMask = (mask: BinaryImageInterface): BinaryImageInterface => ({ ...mask, data: mask.data.map(value => 1 - value) });

export const keepThinInk = (mask: BinaryImageInterface, radius: number): BinaryImageInterface => {
    const solid = dilateMask(invertMask(dilateMask(invertMask(mask), radius)), radius);

    return { ...mask, data: mask.data.map((value, index) => (solid.data[index] === 1 ? 0 : value)) };
};
