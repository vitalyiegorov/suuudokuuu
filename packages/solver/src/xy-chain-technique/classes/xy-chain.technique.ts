import { isDefined } from '@rnw-community/shared';

import { AbstractChainTechnique } from '../../@generic/classes/abstract-chain-technique';
import { XY_CHAIN_MAX_CELLS, XY_CHAIN_MIN_CELLS } from '../../@generic/constants/chain-scan.constant';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export class XYChainTechnique extends AbstractChainTechnique {
    readonly technique = SolutionTechniqueEnum.XYChain;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const startCell of this.getBivalueCells(context)) {
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
                    const eliminations = this.getCommonPeerEliminations(context, [firstCell, nextCell], eliminationValue, nextPath);

                    results.push(...this.createEliminationResults(context, this.technique, eliminations, nextPath));
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
            .filter(cell => this.isBivalueCell(context, cell))
            .filter(cell => context.getCandidates(cell).includes(linkValue))
            .filter(cell => !path.some(pathCell => this.isSameCell(pathCell, cell)));
    }
}
