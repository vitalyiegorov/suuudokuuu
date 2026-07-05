import { isDefined } from '@rnw-community/shared';

import { AbstractChainTechnique } from '../../@generic/classes/abstract-chain-technique';
import { X_CHAIN_MAX_CELLS, X_CHAIN_MIN_CELLS } from '../../@generic/constants/chain-scan.constant';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { CellInterface } from '@suuudokuuu/generator';

type StrongLinkType = [CellInterface, CellInterface];

export class XChainTechnique extends AbstractChainTechnique {
    readonly technique = SolutionTechniqueEnum.XChain;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const value of context.getValues()) {
            const edges = this.getStrongLinks(context, value);
            const paths = this.getStrongPaths(edges);

            for (const path of paths) {
                const [firstCell] = path;
                const [lastCell] = path.slice(-1);

                if (isDefined(firstCell) && isDefined(lastCell)) {
                    const eliminations = this.getCommonPeerEliminations(context, [firstCell, lastCell], value, path);

                    results.push(...this.createEliminationResults(context, this.technique, eliminations, path));
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

    private getStrongPaths(edges: StrongLinkType[]): CellInterface[][] {
        const paths: CellInterface[][] = [];
        const cells = this.getUniqueCells(edges.flatMap(edge => edge));

        for (const cell of cells) {
            this.collectStrongPaths(edges, [cell], paths);
        }

        return paths;
    }

    private collectStrongPaths(edges: StrongLinkType[], path: CellInterface[], paths: CellInterface[][]): void {
        const currentCell = path[path.length - 1];

        if (!isDefined(currentCell)) {
            return;
        }

        if (path.length >= X_CHAIN_MIN_CELLS && path.length % 2 === 0) {
            paths.push([...path]);
        }

        if (path.length >= X_CHAIN_MAX_CELLS) {
            return;
        }

        for (const neighbor of this.getNeighbors(edges, currentCell)) {
            if (!path.some(cell => this.isSameCell(cell, neighbor))) {
                this.collectStrongPaths(edges, [...path, neighbor], paths);
            }
        }
    }

    private getNeighbors(edges: StrongLinkType[], cell: CellInterface): CellInterface[] {
        const neighbors: CellInterface[] = [];

        for (const [firstCell, secondCell] of edges) {
            if (this.isSameCell(firstCell, cell)) {
                neighbors.push(secondCell);
            }

            if (this.isSameCell(secondCell, cell)) {
                neighbors.push(firstCell);
            }
        }

        return this.getUniqueCells(neighbors);
    }
}
