import type { BinaryImageInterface } from '../interfaces/binary-image.interface';

const dilateAlongAxis = (mask: BinaryImageInterface, radius: number, isHorizontal: boolean): BinaryImageInterface => {
    const data = new Uint8Array(mask.data.length);
    const lineCount = isHorizontal ? mask.height : mask.width;
    const length = isHorizontal ? mask.width : mask.height;
    const step = isHorizontal ? 1 : mask.width;

    for (let line = 0; line < lineCount; line += 1) {
        const start = isHorizontal ? line * mask.width : line;
        let count = 0;

        for (let position = -radius; position < length; position += 1) {
            count += position + radius < length ? mask.data[start + (position + radius) * step] : 0;
            count -= position - radius - 1 >= 0 ? mask.data[start + (position - radius - 1) * step] : 0;

            if (position >= 0) {
                data[start + position * step] = count > 0 ? 1 : 0;
            }
        }
    }

    return { ...mask, data };
};

export const dilateMask = (mask: BinaryImageInterface, radius: number): BinaryImageInterface =>
    dilateAlongAxis(dilateAlongAxis(mask, radius, true), radius, false);
