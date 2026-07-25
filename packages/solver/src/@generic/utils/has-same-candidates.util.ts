export const hasSameCandidates = (firstCandidates: readonly number[], secondCandidates: readonly number[]): boolean =>
    firstCandidates.length === secondCandidates.length && firstCandidates.every(candidate => secondCandidates.includes(candidate));
