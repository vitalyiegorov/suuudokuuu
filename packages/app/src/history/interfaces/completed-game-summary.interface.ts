import type { TechniqueUsageInterface } from './technique-usage.interface';

export interface CompletedGameSummaryInterface {
    readonly techniqueUsageList: readonly TechniqueUsageInterface[];
    readonly hintCount: number;
    readonly revealCount: number;
}
