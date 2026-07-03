import { isDefined } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';

import { AbstractTechniqueScanner } from './abstract-technique.scanner';

import type { TechniqueResultInterface } from '../../../interfaces/technique-result.interface';
import type { TechniqueScannerInterface } from '../../../interfaces/technique-scanner.interface';
import type { CandidateContext } from '../candidate-context/candidate-context';

export class PlacementTechniqueScanner extends AbstractTechniqueScanner implements TechniqueScannerInterface {
    find(context: CandidateContext): TechniqueResultInterface[] {
        return [...this.findFullHouses(context), ...this.findNakedSingles(context), ...this.findHiddenSingles(context)];
    }

    private findFullHouses(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const unit of context.getUnits()) {
            const blankCells = unit.cells.filter(cell => context.isBlankCell(cell));
            const [targetCell] = blankCells;

            if (blankCells.length === 1 && isDefined(targetCell)) {
                const candidates = context.getCandidates(targetCell);
                const [value] = candidates;

                if (candidates.length === 1 && isDefined(value)) {
                    results.push(this.createPlacement(SolutionTechniqueEnum.FullHouse, targetCell, value, unit.cells));
                }
            }
        }

        return results;
    }

    private findNakedSingles(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const cell of context.getBlankCells()) {
            const candidates = context.getCandidates(cell);
            const [value] = candidates;

            if (candidates.length === 1 && isDefined(value)) {
                results.push(this.createPlacement(SolutionTechniqueEnum.NakedSingle, cell, value, [cell]));
            }
        }

        return results;
    }

    private findHiddenSingles(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const unit of context.getUnits()) {
            for (const value of context.getValues()) {
                const cellsWithCandidate = unit.cells.filter(cell => context.getCandidates(cell).includes(value));
                const [targetCell] = cellsWithCandidate;

                if (cellsWithCandidate.length === 1 && isDefined(targetCell) && context.getCandidates(targetCell).length > 1) {
                    results.push(this.createPlacement(SolutionTechniqueEnum.HiddenSingle, targetCell, value, unit.cells));
                }
            }
        }

        return results;
    }
}
