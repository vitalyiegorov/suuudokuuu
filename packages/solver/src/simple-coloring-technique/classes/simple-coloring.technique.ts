import { isDefined } from '@rnw-community/shared';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';

import type { CandidateEliminationInterface } from '../../@generic/interfaces/candidate-elimination.interface';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';
import type { ColoredComponentInterface } from '../interfaces/colored-component.interface';
import type { ColoringScanInterface } from '../interfaces/coloring-scan.interface';
import type { ColorType } from '../types/color.type';
import type { CellInterface } from '@suuudokuuu/generator';

export class SimpleColoringTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.SimpleColoring;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const value of context.getValues()) {
            for (const component of this.getColoredComponents(context, value)) {
                const reasonCells = [...component.cellsByKey.values()];
                const wrapEliminations = this.getColorWrapEliminations(context, value, component);
                const trapEliminations = this.getColorTrapEliminations(context, value, component);

                results.push(...createEliminationResults(context, this.technique, wrapEliminations, reasonCells));
                results.push(...createEliminationResults(context, this.technique, trapEliminations, reasonCells));
            }
        }

        return results;
    }

    private getColoredComponents(context: CandidateContext, value: number): ColoredComponentInterface[] {
        const adjacencyByKey = new Map<string, Set<string>>();
        const cellsByKey = new Map<string, CellInterface>();

        for (const unit of context.getUnits()) {
            const candidateCells = unit.cells.filter(cell => context.getCandidates(cell).includes(value));
            const [firstCell, secondCell] = candidateCells;

            if (candidateCells.length === 2 && isDefined(firstCell) && isDefined(secondCell)) {
                this.addEdge(adjacencyByKey, cellsByKey, firstCell, secondCell);
            }
        }

        return this.colorComponents(adjacencyByKey, cellsByKey);
    }

    private addEdge(
        adjacencyByKey: Map<string, Set<string>>,
        cellsByKey: Map<string, CellInterface>,
        firstCell: CellInterface,
        secondCell: CellInterface
    ): void {
        const firstKey = CandidateContext.getCellKey(firstCell);
        const secondKey = CandidateContext.getCellKey(secondCell);
        const firstNeighbors = adjacencyByKey.get(firstKey) ?? new Set<string>();
        const secondNeighbors = adjacencyByKey.get(secondKey) ?? new Set<string>();

        firstNeighbors.add(secondKey);
        secondNeighbors.add(firstKey);
        adjacencyByKey.set(firstKey, firstNeighbors);
        adjacencyByKey.set(secondKey, secondNeighbors);
        cellsByKey.set(firstKey, firstCell);
        cellsByKey.set(secondKey, secondCell);
    }

    private colorComponents(
        adjacencyByKey: Map<string, Set<string>>,
        allCellsByKey: Map<string, CellInterface>
    ): ColoredComponentInterface[] {
        const components: ColoredComponentInterface[] = [];
        const visitedKeys = new Set<string>();

        for (const startKey of adjacencyByKey.keys()) {
            if (!visitedKeys.has(startKey)) {
                components.push(this.colorComponent(startKey, adjacencyByKey, allCellsByKey, visitedKeys));
            }
        }

        return components;
    }

    private colorComponent(
        startKey: string,
        adjacencyByKey: Map<string, Set<string>>,
        allCellsByKey: Map<string, CellInterface>,
        visitedKeys: Set<string>
    ): ColoredComponentInterface {
        const scan: ColoringScanInterface = {
            adjacencyByKey,
            allCellsByKey,
            cellsByKey: new Map<string, CellInterface>(),
            colorsByKey: new Map<string, ColorType>([[startKey, 0]]),
            pendingKeys: [startKey],
            visitedKeys
        };

        visitedKeys.add(startKey);

        for (let pendingIndex = 0; pendingIndex < scan.pendingKeys.length; pendingIndex += 1) {
            this.colorPendingCell(scan, pendingIndex);
        }

        return { colorsByKey: scan.colorsByKey, cellsByKey: scan.cellsByKey };
    }

    private colorPendingCell(scan: ColoringScanInterface, pendingIndex: number): void {
        const currentKey = scan.pendingKeys[pendingIndex];
        const currentColor = scan.colorsByKey.get(currentKey);
        const currentCell = scan.allCellsByKey.get(currentKey);

        if (isDefined(currentKey) && isDefined(currentColor) && isDefined(currentCell)) {
            scan.cellsByKey.set(currentKey, currentCell);

            for (const neighborKey of scan.adjacencyByKey.get(currentKey) ?? []) {
                if (!scan.colorsByKey.has(neighborKey)) {
                    scan.colorsByKey.set(neighborKey, this.getOppositeColor(currentColor));
                    scan.visitedKeys.add(neighborKey);
                    scan.pendingKeys.push(neighborKey);
                }
            }
        }
    }

    private getColorWrapEliminations(
        context: CandidateContext,
        value: number,
        component: ColoredComponentInterface
    ): CandidateEliminationInterface[] {
        const invalidColors = new Set<ColorType>();
        const componentCells = [...component.cellsByKey.values()];

        for (const cell of componentCells) {
            const cellKey = CandidateContext.getCellKey(cell);
            const color = component.colorsByKey.get(cellKey);

            if (isDefined(color)) {
                const hasSameColorPeer = context.getPeers(cell).some(peer => {
                    const peerColor = component.colorsByKey.get(CandidateContext.getCellKey(peer));

                    return peerColor === color;
                });

                if (hasSameColorPeer) {
                    invalidColors.add(color);
                }
            }
        }

        return componentCells
            .filter(cell => {
                const color = component.colorsByKey.get(CandidateContext.getCellKey(cell));

                return isDefined(color) && invalidColors.has(color);
            })
            .map(cell => ({ cell, value }));
    }

    private getColorTrapEliminations(
        context: CandidateContext,
        value: number,
        component: ColoredComponentInterface
    ): CandidateEliminationInterface[] {
        const coloredCellsByColor = this.getCellsByColor(component);

        return context
            .getBlankCells()
            .filter(cell => context.getCandidates(cell).includes(value))
            .filter(cell => !component.colorsByKey.has(CandidateContext.getCellKey(cell)))
            .filter(cell => {
                const peerKeys = new Set(context.getPeers(cell).map(peer => CandidateContext.getCellKey(peer)));
                const seesFirstColor = coloredCellsByColor[0].some(coloredCell => peerKeys.has(CandidateContext.getCellKey(coloredCell)));
                const seesSecondColor = coloredCellsByColor[1].some(coloredCell => peerKeys.has(CandidateContext.getCellKey(coloredCell)));

                return seesFirstColor && seesSecondColor;
            })
            .map(cell => ({ cell, value }));
    }

    private getCellsByColor(component: ColoredComponentInterface): [CellInterface[], CellInterface[]] {
        const firstColorCells: CellInterface[] = [];
        const secondColorCells: CellInterface[] = [];

        for (const [key, color] of component.colorsByKey) {
            const cell = component.cellsByKey.get(key);

            if (isDefined(cell)) {
                if (color === 0) {
                    firstColorCells.push(cell);
                } else {
                    secondColorCells.push(cell);
                }
            }
        }

        return [firstColorCells, secondColorCells];
    }

    private getOppositeColor(color: ColorType): ColorType {
        if (color === 0) {
            return 1;
        }

        return 0;
    }
}
