export const gameMergeCandidateValues = (candidates: number[], extraCandidates: number[]): number[] =>
    extraCandidates.length === 0 ? candidates : [...new Set([...candidates, ...extraCandidates])].sort((left, right) => left - right);
