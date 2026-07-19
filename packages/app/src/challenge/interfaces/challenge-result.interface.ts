export const ChallengeResult = {
    Lost: 'lost',
    Tied: 'tied',
    Won: 'won'
} as const;

export type ChallengeResult = (typeof ChallengeResult)[keyof typeof ChallengeResult];
