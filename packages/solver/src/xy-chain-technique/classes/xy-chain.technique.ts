import { isDefined } from '@rnw-community/shared';

import { XY_CHAIN_MAX_CELLS, XY_CHAIN_MIN_CELLS } from '../../@generic/constants/chain-scan.constant';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { getBivalueCells } from '../../@generic/utils/get-bivalue-cells.util';
import { getCommonPeerEliminations } from '../../@generic/utils/get-common-peer-eliminations.util';
import { isBivalueCell } from '../../@generic/utils/is-bivalue-cell.util';
import { isSameCell } from '../../@generic/utils/is-same-cell.util';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export class XYChainTechnique {
    readonly technique = SolutionTechniqueEnum.XYChain;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const startCell of getBivalueCells(context)) {
            for (const eliminationValue of context.getCandidates(startCell)) {
                const linkValue = context.getCandidates(startCell).find(candidate => candidate !== eliminationValue);

                if (isDefined(linkValue)) {
                    results.push(...this.collectXYChainResults(context, [startCell], linkValue, eliminationValue));
                }
            }
        }

        return results;
    }

    private collectXYChainResults(
        context: CandidateContext,
        path: CellInterface[],
        linkValue: number,
        eliminationValue: number
    ): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const currentCell = path[path.length - 1];

        if (!isDefined(currentCell) || path.length >= XY_CHAIN_MAX_CELLS) {
            return results;
        }

        for (const nextCell of this.getNextXYChainCells(context, path, currentCell, linkValue)) {
            const nextLinkValue = context.getCandidates(nextCell).find(candidate => candidate !== linkValue);

            if (isDefined(nextLinkValue)) {
                const nextPath = [...path, nextCell];

                if (nextLinkValue === eliminationValue && nextPath.length >= XY_CHAIN_MIN_CELLS) {
                    const [firstCell] = nextPath;
                    const eliminations = getCommonPeerEliminations(context, [firstCell, nextCell], eliminationValue, nextPath);

                    results.push(...createEliminationResults(context, this.technique, eliminations, nextPath));
                }

                results.push(...this.collectXYChainResults(context, nextPath, nextLinkValue, eliminationValue));
            }
        }

        return results;
    }

    private getNextXYChainCells(
        context: CandidateContext,
        path: CellInterface[],
        currentCell: CellInterface,
        linkValue: number
    ): CellInterface[] {
        return context
            .getPeers(currentCell)
            .filter(cell => isBivalueCell(context, cell))
            .filter(cell => context.getCandidates(cell).includes(linkValue))
            .filter(cell => !path.some(pathCell => isSameCell(pathCell, cell)));
    }
}
