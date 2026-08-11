import { hasMaskValue } from './has-mask-value.util';

export const getMaskValues = (mask: number, valueCount: number): number[] => {
    const values: number[] = [];

    for (let value = 1; value <= valueCount; value += 1) {
        if (hasMaskValue(mask, value)) {
            values.push(value);
        }
    }

    return values;
};
