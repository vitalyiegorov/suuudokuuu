import { isDefined } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { CandidateContext } from '../candidate-context/candidate-context';

import { AbstractTechniqueScanner } from './abstract-technique.scanner';

import type { CandidateEliminationInterface } from '../../../interfaces/candidate-elimination.interface';
import type { TechniqueResultInterface } from '../../../interfaces/technique-result.interface';
import type { TechniqueScannerInterface } from '../../../interfaces/technique-scanner.interface';
import type { CandidateContext as CandidateContextType } from '../candidate-context/candidate-context';
import type { CellInterface } from '@suuudokuuu/generator';

export class ChainTechniqueScanner extends AbstractTechniqueScanner implements TechniqueScannerInterface {
    find(context: CandidateContextType): TechniqueResultInterface[] {
        return [...this.findXYChains(context), ...this.findXChains(context)];
    }

    private findXYChains(context: CandidateContextType): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const bivalueCells = context.getBlankCells().filter(cell => context.getCandidates(cell).length === 2);

        for (const middleCell of bivalueCells) {
            const peerBivalueCells = context.getPeers(middleCell).filter(cell => context.getCandidates(cell).length === 2);

            for (const [firstCell, secondCell] of this.getCombinations(peerBivalueCells, 2)) {
                const eliminationValue = this.getXYChainEliminationValue(context, firstCell, middleCell, secondCell);

                if (isDefined(eliminationValue)) {
                    const eliminations = this.getCommonPeerEliminations(context, [firstCell, secondCell], eliminationValue, [
                        firstCell,
                        middleCell,
                        secondCell
                    ]);

                    results.push(
                        ...this.createEliminationResults(context, SolutionTechniqueEnum.XYChain, eliminations, [
                            firstCell,
                            middleCell,
                            secondCell
                        ])
                    );
                }
            }
        }

        return results;
    }

    private findXChains(context: CandidateContextType): TechniqueResultInterface[] {
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
                    results.push(...this.createEliminationResults(context, SolutionTechniqueEnum.SimpleColoring, eliminations, path));
                    results.push(...this.createEliminationResults(context, SolutionTechniqueEnum.AIC, eliminations, path));
                }
            }
        }

        return results;
    }

    private getXYChainEliminationValue(
        context: CandidateContextType,
        firstCell: CellInterface,
        middleCell: CellInterface,
        secondCell: CellInterface
    ): number | null {
        const firstCandidates = context.getCandidates(firstCell);
        const middleCandidates = context.getCandidates(middleCell);
        const secondCandidates = context.getCandidates(secondCell);
        const firstMiddleShared = firstCandidates.filter(candidate => middleCandidates.includes(candidate));
        const secondMiddleShared = secondCandidates.filter(candidate => middleCandidates.includes(candidate));
        const endpointShared = firstCandidates.filter(candidate => secondCandidates.includes(candidate));
        const [eliminationValue] = endpointShared;

        if (
            firstMiddleShared.length === 1 &&
            secondMiddleShared.length === 1 &&
            endpointShared.length === 1 &&
            firstMiddleShared[0] !== secondMiddleShared[0] &&
            isDefined(eliminationValue)
        ) {
            return eliminationValue;
        }

        return null;
    }

    private getStrongLinks(context: CandidateContextType, value: number): [CellInterface, CellInterface][] {
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

        if (path.length >= 4) {
            paths.push(path);

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
        context: CandidateContextType,
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
