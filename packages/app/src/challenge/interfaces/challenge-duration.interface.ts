export const ChallengeDurationUnit = {
    Day: 'day',
    Hour: 'hour',
    Minute: 'minute',
    Second: 'second'
} as const;

export type ChallengeDurationUnit = (typeof ChallengeDurationUnit)[keyof typeof ChallengeDurationUnit];

export interface ChallengeDurationPartInterface {
    readonly unit: ChallengeDurationUnit;
    readonly value: number;
}

export interface ChallengeDurationPartsInterface {
    readonly primary: ChallengeDurationPartInterface;
    readonly secondary?: ChallengeDurationPartInterface;
}
