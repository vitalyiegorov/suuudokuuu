import { isDefined } from '@rnw-community/shared';

import { X_CHAIN_MAX_VISITS_PER_ROOT, X_CHAIN_MIN_CELLS } from '../../@generic/constants/chain-scan.constant';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { getCanonicalTechniqueResults } from '../../@generic/utils/get-canonical-technique-results.util';
import { getChainEndpointEliminations } from '../../@generic/utils/get-chain-endpoint-eliminations.util';
import { getSearchEliminationValues } from '../../@generic/utils/get-search-elimination-values.util';
import { getTargetEliminations } from '../../@generic/utils/get-target-eliminations.util';
import { getUniqueCells } from '../../@generic/utils/get-unique-cells.util';
import { isSameCell } from '../../@generic/utils/is-same-cell.util';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueSearchTargetInterface } from '../../@generic/interfaces/technique-search-target.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';
import type { XChainScanStateInterface } from '../interfaces/x-chain-scan-state.interface';
import type { CellInterface } from '@suuudokuuu/generator';

type StrongLinkType = [CellInterface, CellInterface];

const compareCells = (firstCell: CellInterface, secondCell: CellInterface): number =>
    firstCell.y - secondCell.y || firstCell.x - secondCell.x;

export class XChainTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.XChain;

    find(context: CandidateContext, target?: TechniqueSearchTargetInterface): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const eliminationValues = getSearchEliminationValues(context, target);

        for (const eliminationValue of eliminationValues) {
            const strongLinks = this.getStrongLinks(context, eliminationValue);
            const roots = this.getRoots(context, eliminationValue, target);
            const scan = {
                context,
                strongLinks,
                value: eliminationValue,
                results,
                target,
                linkVisits: 0,
                resultsAtStart: results.length
            };

            this.collectResults(roots, scan);

            if (target && results.length > 0) {
                return results;
            }
        }

        return target ? results : getCanonicalTechniqueResults(results);
    }

    private getRoots(context: CandidateContext, value: number, target?: TechniqueSearchTargetInterface): CellInterface[] {
        return context
            .getBlankCells()
            .filter(cell => context.getCandidates(cell).includes(value))
            .filter(cell => !target || (!isSameCell(cell, target.cell) && getTargetEliminations(context, cell, target, value).length > 0))
            .sort(compareCells);
    }

    private collectResults(roots: CellInterface[], scan: XChainScanStateInterface): void {
        for (const root of roots) {
            scan.linkVisits = 0;
            scan.resultsAtStart = scan.results.length;

            this.collectAlternatingPaths(scan, [root], true);

            if (scan.target && scan.results.length > scan.resultsAtStart) {
                return;
            }

            const canonicalResults = getCanonicalTechniqueResults(scan.results);

            scan.results.splice(0, scan.results.length, ...canonicalResults);
        }
    }

    private collectAlternatingPaths(scan: XChainScanStateInterface, path: CellInterface[], requiresStrongLink: boolean): void {
        const currentCell = path[path.length - 1];

        if (
            !isDefined(currentCell) ||
            (scan.target && scan.results.length > scan.resultsAtStart) ||
            scan.linkVisits >= X_CHAIN_MAX_VISITS_PER_ROOT
        ) {
            return;
        }

        const neighbors = requiresStrongLink
            ? this.getStrongNeighbors(scan.strongLinks, currentCell)
            : scan.context
                  .getPeers(currentCell)
                  .filter(cell => scan.context.getCandidates(cell).includes(scan.value))
                  .sort(compareCells);

        for (const neighbor of neighbors) {
            if ((scan.target && scan.results.length > scan.resultsAtStart) || scan.linkVisits >= X_CHAIN_MAX_VISITS_PER_ROOT) {
                return;
            }

            if (!path.some(cell => isSameCell(cell, neighbor))) {
                scan.linkVisits += 1;
                const nextPath = [...path, neighbor];

                if (requiresStrongLink && nextPath.length >= X_CHAIN_MIN_CELLS) {
                    this.addEndpointResults(scan, nextPath);
                }

                this.collectAlternatingPaths(scan, nextPath, !requiresStrongLink);
            }
        }
    }

    private addEndpointResults(scan: XChainScanStateInterface, path: CellInterface[]): void {
        const eliminations = getChainEndpointEliminations(scan.context, path, scan.value, scan.target);

        scan.results.push(...createEliminationResults(this.technique, eliminations, path));
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

    private getStrongNeighbors(strongLinks: StrongLinkType[], cell: CellInterface): CellInterface[] {
        const neighbors: CellInterface[] = [];

        for (const [firstCell, secondCell] of strongLinks) {
            if (isSameCell(firstCell, cell)) {
                neighbors.push(secondCell);
            }

            if (isSameCell(secondCell, cell)) {
                neighbors.push(firstCell);
            }
        }

        return getUniqueCells(neighbors).sort(compareCells);
    }
}
