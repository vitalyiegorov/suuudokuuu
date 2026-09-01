import { isDefined } from '@rnw-community/shared';

import { AbstractSizedTechnique } from '../../@generic/classes/abstract-sized-technique';
import { getContextUnitValueIndex } from '../../@generic/utils/context-scan-state.util';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { getCombinations } from '../../@generic/utils/get-combinations.util';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { UnitValueIndex } from '../../@generic/classes/unit-value-index/unit-value-index';
import type { CandidateEliminationInterface } from '../../@generic/interfaces/candidate-elimination.interface';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export class HiddenSubsetTechnique extends AbstractSizedTechnique {
    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const index = getContextUnitValueIndex(context);
        const valueCombinations = getCombinations(context.getValues(), this.size);

        for (let unitPosition = 0; unitPosition < index.units.length; unitPosition += 1) {
            const unitCells = index.units[unitPosition].cells;

            for (const values of valueCombinations) {
                const positions = this.getHiddenSubsetPositions(index, unitPosition, values);

                if (isDefined(positions)) {
                    const cells = positions.map(position => unitCells[position]);
                    const eliminations = this.getHiddenEliminations(context, cells, values);

                    results.push(...createEliminationResults(this.technique, eliminations, cells));
                }
            }
        }

        return results;
    }

    private getHiddenSubsetPositions(index: UnitValueIndex, unitPosition: number, values: readonly number[]): number[] | null {
        for (const value of values) {
            const valuePositionCount = index.getUnitValueEntry(unitPosition, value).positions.length;

            if (valuePositionCount === 0 || valuePositionCount > this.size) {
                return null;
            }
        }

        const positions: number[] = [];

        for (const value of values) {
            for (const position of index.getUnitValueEntry(unitPosition, value).positions) {
                if (!positions.includes(position)) {
                    if (positions.length === this.size) {
                        return null;
                    }

                    positions.push(position);
                }
            }
        }

        return positions.length === this.size ? positions.sort((firstPosition, secondPosition) => firstPosition - secondPosition) : null;
    }

    private getHiddenEliminations(context: CandidateContext, cells: CellInterface[], values: number[]): CandidateEliminationInterface[] {
        const eliminations: CandidateEliminationInterface[] = [];

        for (const cell of cells) {
            for (const candidate of context.getCandidates(cell)) {
                if (!values.includes(candidate)) {
                    eliminations.push({ cell, value: candidate });
                }
            }
        }

        return eliminations;
    }
}
