import type { CustomThemeIdType } from '../types/theme-id.type';

const Base36Radix = 36;
const RandomSegmentStart = 2;
const RandomSegmentEnd = 8;

export const generateCustomThemeId = (): CustomThemeIdType =>
    `custom-${Date.now().toString(Base36Radix)}-${Math.random().toString(Base36Radix).slice(RandomSegmentStart, RandomSegmentEnd)}`;
