import { isDefined } from '@rnw-community/shared';

import { XY_CHAIN_MAX_CELLS, XY_CHAIN_MIN_CELLS, X_CHAIN_MAX_CELLS, X_CHAIN_MIN_CELLS } from '../../../constants/chain-scan.constant';
import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { CandidateContext } from '../candidate-context/candidate-context';

import { AbstractTechniqueScanner } from './abstract-technique.scanner';

import type { CandidateEliminationInterface } from '../../../interfaces/candidate-elimination.interface';
import type { TechniqueResultInterface } from '../../../interfaces/technique-result.interface';
import type { TechniqueScannerInterface } from '../../../interfaces/technique-scanner.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export class ChainTechniqueScanner extends AbstractTechniqueScanner implements TechniqueScannerInterface {
    find(context: CandidateContext): TechniqueResultInterface[] {
        return [...this.findXYChains(context), ...this.findXChains(context)];
    }

    private findXYChains(context: CandidateContext): TechniqueResultInterface[] {
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

                    results.push(...this.createEliminationResults(context, SolutionTechniqueEnum.XYChain, eliminations, nextPath));
                }

                results.push(...this.collectXYChainResults(context, nextPath, nextLinkValue, eliminationValue));
            }
        }

        return results;
    }

    private findXChains(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const value of context.getValues()) {
            const edges = this.getStrongLinks(context, value);
            const paths = this.getStrongPaths(edges);

            for (const path of paths) {
                const [firstCell] = path;
                const [lastCell] = path.slice(-1);

                if (isDefined(firstCell) && isDefined(lastCell)) {
                    const eliminations = this.getCommonPeerEliminations(context, [firstCell, lastCell], value, path);

                    results.push(...this.createEliminationResults(context, SolutionTechniqueEnum.XChain, eliminations, path));
                }
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

    private getBivalueCells(context: CandidateContext): CellInterface[] {
        return context.getBlankCells().filter(cell => this.isBivalueCell(context, cell));
    }

    private isBivalueCell(context: CandidateContext, cell: CellInterface): boolean {
        return context.getCandidates(cell).length === 2;
    }

    private getStrongLinks(context: CandidateContext, value: number): [CellInterface, CellInterface][] {
        const links: [CellInterface, CellInterface][] = [];

        for (const unit of context.getUnits()) {
            const cells = unit.cells.filter(cell => context.getCandidates(cell).includes(value));
            const [firstCell, secondCell] = cells;

            if (cells.length === 2 && isDefined(firstCell) && isDefined(secondCell)) {
                links.push([firstCell, secondCell]);
            }
        }

        return links;
    }

    private getStrongPaths(edges: [CellInterface, CellInterface][]): CellInterface[][] {
        const paths: CellInterface[][] = [];
        const cells = this.getUniqueCells(edges.flatMap(edge => edge));

        for (const cell of cells) {
            this.collectStrongPaths(edges, [cell], paths);
        }

        return paths;
    }

    private collectStrongPaths(edges: [CellInterface, CellInterface][], path: CellInterface[], paths: CellInterface[][]): void {
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

    private getNeighbors(edges: [CellInterface, CellInterface][], cell: CellInterface): CellInterface[] {
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

    private getCommonPeerEliminations(
        context: CandidateContext,
        cells: CellInterface[],
        value: number,
        reasonCells: CellInterface[]
    ): CandidateEliminationInterface[] {
        return context
            .getCommonPeers(cells)
            .filter(cell => !reasonCells.some(reasonCell => this.isSameCell(reasonCell, cell)))
            .filter(cell => context.getCandidates(cell).includes(value))
            .map(cell => ({ cell, value }));
    }

    private getUniqueCells(cells: CellInterface[]): CellInterface[] {
        const cellMap: Record<string, CellInterface> = {};

        for (const cell of cells) {
            cellMap[CandidateContext.getCellKey(cell)] = cell;
        }

        return Object.values(cellMap);
    }

    private isSameCell(cell: CellInterface, otherCell: CellInterface): boolean {
        return cell.x === otherCell.x && cell.y === otherCell.y;
    }
}
