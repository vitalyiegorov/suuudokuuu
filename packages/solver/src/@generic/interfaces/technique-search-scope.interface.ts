import type { TechniqueSearchTargetInterface } from './technique-search-target.interface';

export interface TechniqueSearchScopeInterface {
    readonly eliminationValues: number[];
    readonly directTarget?: TechniqueSearchTargetInterface;
}
