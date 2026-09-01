const PRESENCE_TABLE_MAX_CANDIDATE_VALUE = 31;

export const getUniqueValues = (values: readonly number[]): number[] => {
    const presenceTable = new Array<boolean>(PRESENCE_TABLE_MAX_CANDIDATE_VALUE + 1).fill(false);

    for (const value of values) {
        presenceTable[value] = true;
    }

    const uniqueValues: number[] = [];

    for (let value = 0; value <= PRESENCE_TABLE_MAX_CANDIDATE_VALUE; value += 1) {
        if (presenceTable[value]) {
            uniqueValues.push(value);
        }
    }

    return uniqueValues;
};
