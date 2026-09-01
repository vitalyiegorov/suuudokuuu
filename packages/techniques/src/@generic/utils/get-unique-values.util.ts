const PRESENCE_TABLE_MAX_VALUE = 31;

const getUniqueValuesByPresenceTable = (values: readonly number[]): number[] => {
    const presenceTable = new Array<boolean>(PRESENCE_TABLE_MAX_VALUE + 1).fill(false);

    for (const value of values) {
        presenceTable[value] = true;
    }

    const uniqueValues: number[] = [];

    for (let value = 0; value <= PRESENCE_TABLE_MAX_VALUE; value += 1) {
        if (presenceTable[value]) {
            uniqueValues.push(value);
        }
    }

    return uniqueValues;
};

const getUniqueValuesBySort = (values: readonly number[]): number[] => {
    const sortedValues = [...values].sort((firstValue, secondValue) => firstValue - secondValue);
    const uniqueValues: number[] = [];

    for (let index = 0; index < sortedValues.length; index += 1) {
        if (index === 0 || sortedValues[index] !== sortedValues[index - 1]) {
            uniqueValues.push(sortedValues[index]);
        }
    }

    return uniqueValues;
};

const isWithinPresenceTableRange = (value: number): boolean => Number.isInteger(value) && value >= 0 && value <= PRESENCE_TABLE_MAX_VALUE;

const isEveryValueWithinPresenceTableRange = (values: readonly number[]): boolean => {
    for (let index = 0; index < values.length; index += 1) {
        if (!isWithinPresenceTableRange(values[index])) {
            return false;
        }
    }

    return true;
};

export const getUniqueValues = (values: readonly number[]): number[] => {
    if (values.length === 0) {
        return [];
    }

    if (isEveryValueWithinPresenceTableRange(values)) {
        return getUniqueValuesByPresenceTable(values);
    }

    return getUniqueValuesBySort(values);
};
