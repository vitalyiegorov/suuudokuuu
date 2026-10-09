import type { ChainLinkEnum } from '../enums/chain-link.enum';
import type { CellInterface } from '@suuudokuuu/generator';

export interface ChainCandidateInterface {
    readonly cell: CellInterface;
    readonly value: number;
    readonly link?: ChainLinkEnum;
}
