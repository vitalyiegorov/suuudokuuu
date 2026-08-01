import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueSearchTargetInterface } from '../../@generic/interfaces/technique-search-target.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export interface XChainScanStateInterface {
    readonly context: CandidateContext;
    readonly strongLinks: [CellInterface, CellInterface][];
    readonly value: number;
    readonly results: TechniqueResultInterface[];
    readonly target?: TechniqueSearchTargetInterface;
    linkVisits: number;
    resultsAtStart: number;
}
