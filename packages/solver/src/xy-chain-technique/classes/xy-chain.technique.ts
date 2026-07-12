import { isDefined } from '@rnw-community/shared';

import { XY_CHAIN_MAX_VISITS_PER_ROOT, XY_CHAIN_MIN_CELLS } from '../../@generic/constants/chain-scan.constant';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { getBivalueCells } from '../../@generic/utils/get-bivalue-cells.util';
import { getCommonPeerEliminations } from '../../@generic/utils/get-common-peer-eliminations.util';
import { isBivalueCell } from '../../@generic/utils/is-bivalue-cell.util';
import { isSameCell } from '../../@generic/utils/is-same-cell.util';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { XYChainScanInterface } from '../interfaces/xy-chain-scan.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export class XYChainTechnique {
    readonly technique = SolutionTechniqueEnum.XYChain;

    private scanVisits = 0;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const startCell of getBivalueCells(context)) {
            for (const eliminationValue of context.getCandidates(startCell)) {
                const linkValue = context.getCandidates(startCell).find(candidate => candidate !== eliminationValue);

                if (isDefined(linkValue)) {
                    const scan = { context, eliminationValue, results };

                    this.scanVisits = 0;
                    this.collectXYChainResults(scan, [startCell], linkValue);
                }
            }
        }

        return results;
    }

    private collectXYChainResults(scan: XYChainScanInterface, path: CellInterface[], linkValue: number): void {
        const currentCell = path[path.length - 1];

        if (!isDefined(currentCell) || this.scanVisits >= XY_CHAIN_MAX_VISITS_PER_ROOT) {
            return;
        }

        for (const nextCell of this.getNextXYChainCells(scan.context, path, currentCell, linkValue)) {
            if (this.scanVisits >= XY_CHAIN_MAX_VISITS_PER_ROOT) {
                return;
            }

            this.scanVisits += 1;
            this.visitNextCell(scan, path, linkValue, nextCell);
        }
    }

    private visitNextCell(scan: XYChainScanInterface, path: CellInterface[], linkValue: number, nextCell: CellInterface): void {
        const nextLinkValue = scan.context.getCandidates(nextCell).find(candidate => candidate !== linkValue);

        if (isDefined(nextLinkValue)) {
            const nextPath = [...path, nextCell];

            if (nextLinkValue === scan.eliminationValue && nextPath.length >= XY_CHAIN_MIN_CELLS) {
                const [firstCell] = nextPath;
                const eliminations = getCommonPeerEliminations(scan.context, [firstCell, nextCell], scan.eliminationValue, nextPath);

                scan.results.push(...createEliminationResults(this.technique, eliminations, nextPath));
            }

            this.collectXYChainResults(scan, nextPath, nextLinkValue);
        }
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
