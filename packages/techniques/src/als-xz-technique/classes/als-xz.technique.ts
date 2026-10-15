import { isNotEmptyArray } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { canSee } from '../../@generic/utils/can-see.util';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';
import type { CellInterface } from '@suuudokuuu/generator';

interface AlmostLockedSetInterface {
    readonly cells: readonly CellInterface[];
    readonly values: readonly number[];
    readonly cellsByValue: readonly (readonly CellInterface[])[];
}

const getCellsKey = (cells: readonly CellInterface[]): string => cells.map(cell => `${cell.y}:${cell.x}`).join(',');

const createAlmostLockedSet = (context: CandidateContext, cells: readonly CellInterface[]): AlmostLockedSetInterface => {
    const cellsByValue: CellInterface[][] = Array.from({ length: context.getValues().length + 1 }, () => []);

    for (const cell of cells) {
        for (const value of context.getCandidates(cell)) {
            cellsByValue[value].push(cell);
        }
    }

    return { cells: [...cells], values: context.getValues().filter(value => isNotEmptyArray(cellsByValue[value])), cellsByValue };
};

const candidateKeyRowMultiplier = 256;
const candidateKeyColumnMultiplier = 16;

const getCandidateKey = (cell: CellInterface, value: number): number =>
    cell.y * candidateKeyRowMultiplier + cell.x * candidateKeyColumnMultiplier + value;

const getValueSeers = (context: CandidateContext, valueCells: readonly CellInterface[], value: number): CellInterface[] =>
    context
        .getPeers(valueCells[0])
        .filter(cell => context.getCandidates(cell).includes(value) && valueCells.every(valueCell => canSee(cell, valueCell)));

const indexByCandidate = (almostLockedSets: readonly AlmostLockedSetInterface[]): Map<number, number[]> => {
    const setPositionsByCandidate = new Map<number, number[]>();

    almostLockedSets.forEach((almostLockedSet, setPosition) => {
        for (const value of almostLockedSet.values) {
            for (const cell of almostLockedSet.cellsByValue[value]) {
                const key = getCandidateKey(cell, value);

                setPositionsByCandidate.set(key, [...(setPositionsByCandidate.get(key) ?? []), setPosition]);
            }
        }
    });

    return setPositionsByCandidate;
};

export class ALSXZTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.ALSXZ;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const almostLockedSets = this.findAlmostLockedSets(context);
        const setPositionsByCandidate = indexByCandidate(almostLockedSets);
        const results: TechniqueResultInterface[] = [];

        const linkCounts = new Array<number>(almostLockedSets.length).fill(0);

        almostLockedSets.forEach((first, firstPosition) => {
            for (const restrictedValue of first.values) {
                const linkedPositions: number[] = [];

                for (const seer of getValueSeers(context, first.cellsByValue[restrictedValue], restrictedValue)) {
                    const setPositions = setPositionsByCandidate.get(getCandidateKey(seer, restrictedValue)) ?? [];

                    for (let index = setPositions.length - 1; index >= 0 && setPositions[index] > firstPosition; index -= 1) {
                        linkedPositions.push(setPositions[index]);
                        linkCounts[setPositions[index]] += 1;
                    }
                }

                for (const secondPosition of linkedPositions) {
                    const second = almostLockedSets[secondPosition];

                    if (linkCounts[secondPosition] === second.cellsByValue[restrictedValue].length) {
                        results.push(...this.createResults(context, [first, second], restrictedValue));
                    }

                    linkCounts[secondPosition] = 0;
                }
            }
        });

        return results;
    }

    private findAlmostLockedSets(context: CandidateContext): AlmostLockedSetInterface[] {
        const almostLockedSets = new Map<string, AlmostLockedSetInterface>();
        const valueCounts = new Array<number>(context.getValues().length + 1).fill(0);
        const chosenCells: CellInterface[] = [];

        for (const unit of context.getUnits()) {
            const unitCells = unit.cells.filter(cell => context.getCandidates(cell).length > 1);
            const visit = (startPosition: number, distinctValueCount: number): void => {
                for (let position = startPosition; position < unitCells.length; position += 1) {
                    const cellCandidates = context.getCandidates(unitCells[position]);
                    const addedValueCount = cellCandidates.filter(value => valueCounts[value] === 0).length;

                    cellCandidates.forEach(value => void (valueCounts[value] += 1));
                    chosenCells.push(unitCells[position]);

                    if (distinctValueCount + addedValueCount === chosenCells.length + 1 && chosenCells.length < unitCells.length) {
                        almostLockedSets.set(getCellsKey(chosenCells), createAlmostLockedSet(context, chosenCells));
                    }

                    visit(position + 1, distinctValueCount + addedValueCount);
                    chosenCells.pop();
                    cellCandidates.forEach(value => void (valueCounts[value] -= 1));
                }
            };

            visit(0, 0);
        }

        return [...almostLockedSets.values()];
    }

    private createResults(
        context: CandidateContext,
        [first, second]: readonly AlmostLockedSetInterface[],
        restrictedValue: number
    ): TechniqueResultInterface[] {
        if (first.cells.some(cell => second.cells.includes(cell))) {
            return [];
        }

        const patternCells = [...first.cells, ...second.cells];
        const eliminations = first.values
            .filter(value => value !== restrictedValue && isNotEmptyArray(second.cellsByValue[value]))
            .flatMap(value =>
                getValueSeers(context, [...first.cellsByValue[value], ...second.cellsByValue[value]], value).map(cell => ({ cell, value }))
            );
        const patternValues = [restrictedValue, ...eliminations.map(elimination => elimination.value)];

        return createEliminationResults(this.technique, eliminations, patternCells).map(result => ({
            ...result,
            patternCandidates: patternCells.flatMap(cell =>
                context
                    .getCandidates(cell)
                    .filter(value => patternValues.includes(value))
                    .map(value => ({ cell, value }))
            )
        }));
    }
}
