import { isDefined } from '@rnw-community/shared';

import { X_CHAIN_MAX_VISITS_PER_ROOT, X_CHAIN_MIN_CELLS } from '../../@generic/constants/chain-scan.constant';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { getCommonPeerEliminations } from '../../@generic/utils/get-common-peer-eliminations.util';
import { getUniqueCells } from '../../@generic/utils/get-unique-cells.util';
import { isSameCell } from '../../@generic/utils/is-same-cell.util';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { XChainScanStateInterface } from '../interfaces/x-chain-scan-state.interface';
import type { CellInterface } from '@suuudokuuu/generator';

type StrongLinkType = [CellInterface, CellInterface];

export class XChainTechnique {
    readonly technique = SolutionTechniqueEnum.XChain;

    private scanVisits = 0;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const value of context.getValues()) {
            const edges = this.getStrongLinks(context, value);
            const paths = this.getAlternatingPaths(context, edges, value);

            for (const path of paths) {
                const [firstCell] = path;
                const [lastCell] = path.slice(-1);

                if (isDefined(firstCell) && isDefined(lastCell)) {
                    const eliminations = getCommonPeerEliminations(context, [firstCell, lastCell], value, path);

                    results.push(...createEliminationResults(context, this.technique, eliminations, path));
                }
            }
        }

        return results;
    }

    private getStrongLinks(context: CandidateContext, value: number): StrongLinkType[] {
        const links: StrongLinkType[] = [];

        for (const unit of context.getUnits()) {
            const cells = unit.cells.filter(cell => context.getCandidates(cell).includes(value));
            const [firstCell, secondCell] = cells;

            if (cells.length === 2 && isDefined(firstCell) && isDefined(secondCell)) {
                links.push([firstCell, secondCell]);
            }
        }

        return links;
    }

    private getAlternatingPaths(context: CandidateContext, edges: StrongLinkType[], value: number): CellInterface[][] {
        const paths: CellInterface[][] = [];
        const cells = context.getBlankCells().filter(cell => context.getCandidates(cell).includes(value));

        for (const cell of cells) {
            this.scanVisits = 0;
            this.collectAlternatingPaths({ context, edges, paths, value }, [cell], true);
        }

        return paths;
    }

    private collectAlternatingPaths(state: XChainScanStateInterface, path: CellInterface[], requiresStrongLink: boolean): void {
        const currentCell = path[path.length - 1];

        if (!isDefined(currentCell) || this.scanVisits >= X_CHAIN_MAX_VISITS_PER_ROOT) {
            return;
        }

        const neighbors = requiresStrongLink
            ? this.getStrongNeighbors(state.edges, currentCell)
            : state.context.getPeers(currentCell).filter(cell => state.context.getCandidates(cell).includes(state.value));

        for (const neighbor of neighbors) {
            if (!path.some(cell => isSameCell(cell, neighbor))) {
                this.scanVisits += 1;

                const nextPath = [...path, neighbor];

                if (requiresStrongLink && nextPath.length >= X_CHAIN_MIN_CELLS) {
                    state.paths.push(nextPath);
                }

                this.collectAlternatingPaths(state, nextPath, !requiresStrongLink);
            }
        }
    }

    private getStrongNeighbors(edges: StrongLinkType[], cell: CellInterface): CellInterface[] {
        const neighbors: CellInterface[] = [];

        for (const [firstCell, secondCell] of edges) {
            if (isSameCell(firstCell, cell)) {
                neighbors.push(secondCell);
            }

            if (isSameCell(secondCell, cell)) {
                neighbors.push(firstCell);
            }
        }

        return getUniqueCells(neighbors);
    }
}
