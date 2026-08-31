export const mergeCandidateValues = (...valueGroups: number[][]): number[] =>
    [...new Set(valueGroups.flat())].sort((left, right) => left - right);
