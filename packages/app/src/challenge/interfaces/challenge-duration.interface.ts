import type { ChallengeDurationUnit } from '../enums/challenge-duration-unit.enum';

export interface ChallengeDurationPartInterface {
    readonly unit: ChallengeDurationUnit;
    readonly value: number;
}

export interface ChallengeDurationPartsInterface {
    readonly primary: ChallengeDurationPartInterface;
    readonly secondary?: ChallengeDurationPartInterface;
}
