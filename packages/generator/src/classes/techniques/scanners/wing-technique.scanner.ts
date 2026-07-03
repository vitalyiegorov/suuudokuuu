import { isDefined } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';

import { AbstractTechniqueScanner } from './abstract-technique.scanner';

import type { CandidateEliminationInterface } from '../../../interfaces/candidate-elimination.interface';
import type { CellInterface } from '../../../interfaces/cell.interface';
import type { TechniqueResultInterface } from '../../../interfaces/technique-result.interface';
import type { TechniqueScannerInterface } from '../../../interfaces/technique-scanner.interface';
import type { CandidateContext } from '../candidate-context/candidate-context';

export class WingTechniqueScanner extends AbstractTechniqueScanner implements TechniqueScannerInterface {
    find(context: CandidateContext): TechniqueResultInterface[] {
        return [...this.findXYWings(context), ...this.findXYZWings(context), ...this.findWWings(context)];
    }

    private findXYWings(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const pivot of context.getBlankCells().filter(cell => context.getCandidates(cell).length === 2)) {
            const pincers = context.getPeers(pivot).filter(cell => context.getCandidates(cell).length === 2);

            for (const [firstPincer, secondPincer] of this.getCombinations(pincers, 2)) {
                const eliminationValue = this.getXYWingEliminationValue(context, pivot, firstPincer, secondPincer);

                if (isDefined(eliminationValue)) {
                    const eliminations = this.getCommonPeerEliminations(context, [firstPincer, secondPincer], eliminationValue, [
                        pivot,
                        firstPincer,
                        secondPincer
                    ]);

                    results.push(
                        ...this.createEliminationResults(context, SolutionTechniqueEnum.XYWing, eliminations, [
                            pivot,
                            firstPincer,
                            secondPincer
                        ])
                    );
                }
            }
        }

        return results;
    }

    private findXYZWings(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const pivot of context.getBlankCells().filter(cell => context.getCandidates(cell).length === 3)) {
            const pivotCandidates = context.getCandidates(pivot);
            const pincers = context
                .getPeers(pivot)
                .filter(cell => context.getCandidates(cell).length === 2)
                .filter(cell => context.getCandidates(cell).every(candidate => pivotCandidates.includes(candidate)));

            for (const [firstPincer, secondPincer] of this.getCombinations(pincers, 2)) {
                const pincerCandidates = this.getUniqueValues([
                    ...context.getCandidates(firstPincer),
                    ...context.getCandidates(secondPincer)
                ]);
                const sharedCandidates = context
                    .getCandidates(firstPincer)
                    .filter(candidate => context.getCandidates(secondPincer).includes(candidate));
                const [eliminationValue] = sharedCandidates;

                if (pincerCandidates.length === 3 && sharedCandidates.length === 1 && isDefined(eliminationValue)) {
                    const eliminations = this.getCommonPeerEliminations(context, [pivot, firstPincer, secondPincer], eliminationValue, [
                        pivot,
                        firstPincer,
                        secondPincer
                    ]);

                    results.push(
                        ...this.createEliminationResults(context, SolutionTechniqueEnum.XYZWing, eliminations, [
                            pivot,
                            firstPincer,
                            secondPincer
                        ])
                    );
                }
            }
        }

        return results;
    }

    private findWWings(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const bivalueCells = context.getBlankCells().filter(cell => context.getCandidates(cell).length === 2);

        for (const [firstCell, secondCell] of this.getCombinations(bivalueCells, 2)) {
            const firstCandidates = context.getCandidates(firstCell);
            const secondCandidates = context.getCandidates(secondCell);

            if (this.hasSameCandidates(firstCandidates, secondCandidates) && !this.canSee(context, firstCell, secondCell)) {
                for (const strongValue of firstCandidates) {
                    const otherValue = firstCandidates.find(candidate => candidate !== strongValue);

                    if (isDefined(otherValue) && this.hasStrongLinkBetween(context, firstCell, secondCell, strongValue)) {
                        const eliminations = this.getCommonPeerEliminations(context, [firstCell, secondCell], otherValue, [
                            firstCell,
                            secondCell
                        ]);

                        results.push(
                            ...this.createEliminationResults(context, SolutionTechniqueEnum.WWing, eliminations, [firstCell, secondCell])
                        );
                    }
                }
            }
        }

        return results;
    }

    private getXYWingEliminationValue(
        context: CandidateContext,
        pivot: CellInterface,
        firstPincer: CellInterface,
        secondPincer: CellInterface
    ): number | null {
        const pivotCandidates = context.getCandidates(pivot);
        const firstCandidates = context.getCandidates(firstPincer);
        const secondCandidates = context.getCandidates(secondPincer);
        const sharedByPincers = firstCandidates.filter(candidate => secondCandidates.includes(candidate));
        const eliminationValue = sharedByPincers.find(candidate => !pivotCandidates.includes(candidate));
        const firstPivotValues = firstCandidates.filter(candidate => pivotCandidates.includes(candidate));
        const secondPivotValues = secondCandidates.filter(candidate => pivotCandidates.includes(candidate));

        if (
            firstPivotValues.length === 1 &&
            secondPivotValues.length === 1 &&
            firstPivotValues[0] !== secondPivotValues[0] &&
            isDefined(eliminationValue)
        ) {
            return eliminationValue;
        }

        return null;
    }

    private getCommonPeerEliminations(
        context: CandidateContext,
        cells: CellInterface[],
        value: number,
        reasonCells: CellInterface[]
    ): CandidateEliminationInterface[] {
        return context
            .getCommonPeers(cells)
            .filter(cell => !reasonCells.some(reasonCell => reasonCell.x === cell.x && reasonCell.y === cell.y))
            .filter(cell => context.getCandidates(cell).includes(value))
            .map(cell => ({ cell, value }));
    }

    private hasSameCandidates(firstCandidates: number[], secondCandidates: number[]): boolean {
        return (
            firstCandidates.length === secondCandidates.length && firstCandidates.every(candidate => secondCandidates.includes(candidate))
        );
    }

    private hasStrongLinkBetween(context: CandidateContext, firstCell: CellInterface, secondCell: CellInterface, value: number): boolean {
        for (const unit of context.getUnits()) {
            const cells = unit.cells.filter(cell => context.getCandidates(cell).includes(value));
            const [firstLinkCell, secondLinkCell] = cells;

            if (
                cells.length === 2 &&
                isDefined(firstLinkCell) &&
                isDefined(secondLinkCell) &&
                this.canSee(context, firstCell, firstLinkCell) &&
                this.canSee(context, secondCell, secondLinkCell)
            ) {
                return true;
            }

            if (
                cells.length === 2 &&
                isDefined(firstLinkCell) &&
                isDefined(secondLinkCell) &&
                this.canSee(context, firstCell, secondLinkCell) &&
                this.canSee(context, secondCell, firstLinkCell)
            ) {
                return true;
            }
        }

        return false;
    }

    private canSee(context: CandidateContext, cell: CellInterface, otherCell: CellInterface): boolean {
        return context.getPeers(cell).some(peer => peer.x === otherCell.x && peer.y === otherCell.y);
    }
}
