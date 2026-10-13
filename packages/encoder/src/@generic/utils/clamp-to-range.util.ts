export const clampToRange = (value: number, maximum: number): number => Math.min(Math.max(Math.trunc(value), 0), maximum);
