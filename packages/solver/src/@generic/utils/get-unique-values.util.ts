export const getUniqueValues = (values: number[]): number[] =>
    [...new Set(values)].sort((firstValue, secondValue) => firstValue - secondValue);
