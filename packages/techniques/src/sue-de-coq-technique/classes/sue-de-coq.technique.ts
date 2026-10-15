import { isNotEmptyArray } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { getValueBit } from '../../@generic/utils/get-value-bit.util';
import { hasMaskValue } from '../../@generic/utils/has-mask-value.util';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { CandidateEliminationInterface } from '../../@generic/interfaces/candidate-elimination.interface';
import type { CandidateUnitInterface } from '../../@generic/interfaces/candidate-unit.interface';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';
import type { CellInterface } from '@suuudokuuu/generator';

interface CellSubsetInterface {
    readonly cells: readonly CellInterface[];
    readonly valueMask: number;
}

interface IntersectionInterface {
    readonly lineCells: readonly CellInterface[];
    readonly boxCells: readonly CellInterface[];
    readonly core: CellSubsetInterface;
}

const minimumCoreSize = 2;
const minimumCoreExtraValues = 2;

const addValues = (valueMask: number, values: readonly number[]): number =>
    values.reduce((mask, value) => (hasMaskValue(mask, value) ? mask : mask + getValueBit(value)), valueMask);

const getValues = (valueMask: number, excludedMask = 0): number[] => {
    const values: number[] = [];

    for (let value = 1; getValueBit(value) <= valueMask; value += 1) {
        if (hasMaskValue(valueMask, value) && !hasMaskValue(excludedMask, value)) {
            values.push(value);
        }
    }

    return values;
};

const sharesValue = (firstMask: number, secondMask: number): boolean => getValues(firstMask).some(value => hasMaskValue(secondMask, value));

const getCellSubsets = (context: CandidateContext, cells: readonly CellInterface[], minimumSize: number): CellSubsetInterface[] => {
    const subsets: CellSubsetInterface[] = [];
    const visit = (startPosition: number, subsetCells: readonly CellInterface[], valueMask: number): void => {
        for (let position = startPosition; position < cells.length; position += 1) {
            const subset = {
                cells: [...subsetCells, cells[position]],
                valueMask: addValues(valueMask, context.getCandidates(cells[position]))
            };

            if (subset.cells.length >= minimumSize) {
                subsets.push(subset);
            }

            visit(position + 1, subset.cells, subset.valueMask);
        }
    };

    visit(0, [], 0);

    return subsets.sort((first, second) => first.cells.length - second.cells.length);
};

const getRemainingEliminations = (
    context: CandidateContext,
    unitCells: readonly CellInterface[],
    patternCells: readonly CellInterface[],
    values: readonly number[]
): CandidateEliminationInterface[] =>
    unitCells
        .filter(cell => !patternCells.includes(cell))
        .flatMap(cell =>
            context
                .getCandidates(cell)
                .filter(value => values.includes(value))
                .map(value => ({ cell, value }))
        );

const getUniqueEliminations = (eliminations: readonly CandidateEliminationInterface[]): CandidateEliminationInterface[] =>
    eliminations.filter(
        (elimination, position) =>
            eliminations.findIndex(other => other.cell === elimination.cell && other.value === elimination.value) === position
    );

export class SueDeCoqTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.SueDeCoq;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const units = context
            .getUnits()
            .map(unit => ({ ...unit, cells: unit.cells.filter(cell => isNotEmptyArray(context.getCandidates(cell))) }));
        const results: TechniqueResultInterface[] = [];

        for (const box of units.filter(unit => unit.type === 'group')) {
            for (const line of units.filter(unit => unit.type !== 'group')) {
                results.push(...this.findIntersectionResults(context, box, line));
            }
        }

        return results;
    }

    private findIntersectionResults(
        context: CandidateContext,
        box: CandidateUnitInterface,
        line: CandidateUnitInterface
    ): TechniqueResultInterface[] {
        const cores = getCellSubsets(
            context,
            line.cells.filter(cell => box.cells.includes(cell)),
            minimumCoreSize
        ).filter(core => getValues(core.valueMask).length >= core.cells.length + minimumCoreExtraValues);

        if (cores.length === 0) {
            return [];
        }

        const lineArms = getCellSubsets(
            context,
            line.cells.filter(cell => !box.cells.includes(cell)),
            1
        );
        const boxArms = getCellSubsets(
            context,
            box.cells.filter(cell => !line.cells.includes(cell)),
            1
        );

        return cores.flatMap(core =>
            this.findCoreResults(context, { lineCells: line.cells, boxCells: box.cells, core }, lineArms, boxArms)
        );
    }

    private findCoreResults(
        context: CandidateContext,
        intersection: IntersectionInterface,
        lineArms: readonly CellSubsetInterface[],
        boxArms: readonly CellSubsetInterface[]
    ): TechniqueResultInterface[] {
        const { core } = intersection;
        const getSlack = (arm: CellSubsetInterface): number => arm.cells.length - getValues(arm.valueMask, core.valueMask).length;
        const isConnectedArm = (arm: CellSubsetInterface): boolean => sharesValue(arm.valueMask, core.valueMask);
        const boxArmsBySlack = new Map<number, CellSubsetInterface[]>();

        for (const boxArm of boxArms.filter(isConnectedArm)) {
            const slack = getSlack(boxArm);

            boxArmsBySlack.set(slack, [...(boxArmsBySlack.get(slack) ?? []), boxArm]);
        }

        const results: TechniqueResultInterface[] = [];

        for (const lineArm of lineArms.filter(isConnectedArm)) {
            const requiredBoxSlack = getValues(core.valueMask).length - core.cells.length - getSlack(lineArm);

            for (const boxArm of boxArmsBySlack.get(requiredBoxSlack) ?? []) {
                if (!sharesValue(lineArm.valueMask, boxArm.valueMask)) {
                    results.push(...this.createResults(context, intersection, lineArm, boxArm));
                }
            }
        }

        return results;
    }

    private createResults(
        context: CandidateContext,
        { boxCells, core, lineCells }: IntersectionInterface,
        lineArm: CellSubsetInterface,
        boxArm: CellSubsetInterface
    ): TechniqueResultInterface[] {
        const patternCells = [...core.cells, ...lineArm.cells, ...boxArm.cells];
        const eliminations = getUniqueEliminations([
            ...getRemainingEliminations(
                context,
                lineCells,
                [...core.cells, ...lineArm.cells],
                [...getValues(lineArm.valueMask), ...getValues(core.valueMask, boxArm.valueMask)]
            ),
            ...getRemainingEliminations(
                context,
                boxCells,
                [...core.cells, ...boxArm.cells],
                [...getValues(boxArm.valueMask), ...getValues(core.valueMask, lineArm.valueMask)]
            )
        ]);

        return createEliminationResults(this.technique, eliminations, patternCells).map(result => ({
            ...result,
            patternCandidates: patternCells.flatMap(cell => context.getCandidates(cell).map(value => ({ cell, value })))
        }));
    }
}
