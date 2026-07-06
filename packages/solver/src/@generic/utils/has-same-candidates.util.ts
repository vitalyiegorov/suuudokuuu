export const hasSameCandidates = (firstCandidates: number[], secondCandidates: number[]): boolean =>
    firstCandidates.length === secondCandidates.length && firstCandidates.every(candidate => secondCandidates.includes(candidate));
