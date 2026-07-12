import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { CellInterface } from '@suuudokuuu/generator';

export interface XChainScanStateInterface {
    readonly context: CandidateContext;
    readonly edges: [CellInterface, CellInterface][];
    readonly paths: CellInterface[][];
    readonly value: number;
}
