import { isDefined, isNumber } from '@rnw-community/shared';

import type { ViewStyle } from 'react-native';

const readLastNonZero = (resolved: number, entryValue: number): number => (entryValue === 0 ? resolved : entryValue);

export const readStyleNumber = (style: unknown, propertyName: keyof ViewStyle): number => {
    if (typeof style !== 'object' || !isDefined(style)) {
        return 0;
    }

    if (Array.isArray(style)) {
        return style.reduce<number>((resolved, entry) => readLastNonZero(resolved, readStyleNumber(entry, propertyName)), 0);
    }

    const value: unknown = Reflect.get(style, propertyName);

    return isNumber(value) ? value : 0;
};
