import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';

import { BaseTechnique } from './base-technique';

import type { CellInterface } from '../../interfaces/cell.interface';
import type { FieldInterface } from '../../interfaces/field.interface';
import type { TechniqueResultInterface } from '../../interfaces/technique-strategy.interface';

const hiddenTripleDifficulty = 7;

export class HiddenTripleTechnique extends BaseTechnique {
    readonly type = SolutionTechniqueEnum.HiddenTriple;
    readonly difficulty = hiddenTripleDifficulty;

    canApply(field: FieldInterface, cell: CellInterface, value: number, candidates: number[]): boolean {
        if (!candidates.includes(value)) {
            return false;
        }

        const rowCells = this.getRowCells(field, cell.y);
        const colCells = this.getColCells(field, cell.x);
        const groupCells = this.getGroupCells(field, cell);

        return (
            this.hasHiddenTripleInUnit(field, rowCells, value, cell) ||
            this.hasHiddenTripleInUnit(field, colCells, value, cell) ||
            this.hasHiddenTripleInUnit(field, groupCells, value, cell)
        );
    }

    findAll(field: FieldInterface): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const emptyCells = this.getEmptyCells(field);

        for (const cell of emptyCells) {
            const candidates = this.getCellCandidates(field, cell);

            for (const value of candidates) {
                if (this.canApply(field, cell, value, candidates)) {
                    results.push({ technique: this.type, cell, value });
                }
            }
        }

        return results;
    }

    private hasHiddenTripleInUnit(
        field: FieldInterface,
        unitCells: CellInterface[],
        value: number,
        _currentCell: CellInterface
    ): boolean {
        const valueCandidateCells: CellInterface[] = [];

        for (const unitCell of unitCells) {
            if (unitCell.value === 0) {
                const candidates = this.getCellCandidates(field, unitCell);

                if (candidates.includes(value)) {
                    valueCandidateCells.push(unitCell);
                }
            }
        }

        if (valueCandidateCells.length !== 3) {
            return false;
        }

        const allCandidates = new Set<number>();
        
        for (const cell of valueCandidateCells) {
            const cellCandidates = this.getCellCandidates(field, cell);
            
            cellCandidates.forEach((candidate) => allCandidates.add(candidate));
        }

        const sharedValues: number[] = [];
        
        for (const candidate of allCandidates) {
            let count = 0;
            
            for (const cell of valueCandidateCells) {
                const cellCandidates = this.getCellCandidates(field, cell);
                
                if (cellCandidates.includes(candidate)) {
                    count += 1;
                }
            }
            
            if (count === 3) {
                sharedValues.push(candidate);
            }
        }

        return sharedValues.length === 3 && sharedValues.includes(value);
    }
}
