export const getUniqueValues = (values: readonly number[]): number[] =>
    [...new Set(values)].sort((firstValue, secondValue) => firstValue - secondValue);
