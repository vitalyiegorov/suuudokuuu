export interface HellRefillOptionsInterface<CandidateType> {
    readonly advance: (budgetMilliseconds: number) => { readonly candidate?: CandidateType };
    readonly shouldContinue: () => boolean;
    readonly onCandidate: (candidate: CandidateType) => void;
}
