import { isNotEmptyArray } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { forEachCombination } from '../../@generic/utils/get-combinations.util';
import { getUniqueValues } from '../../@generic/utils/get-unique-values.util';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { CandidateEliminationInterface } from '../../@generic/interfaces/candidate-elimination.interface';
import type { CandidateUnitInterface } from '../../@generic/interfaces/candidate-unit.interface';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';
import type { CellInterface } from '@suuudokuuu/generator';

interface CellSubsetInterface {
    readonly cells: readonly CellInterface[];
    readonly values: readonly number[];
}

interface IntersectionInterface {
    readonly lineCells: readonly CellInterface[];
    readonly boxCells: readonly CellInterface[];
    readonly core: CellSubsetInterface;
}

const minimumCoreSize = 2;
const minimumCoreExtraValues = 2;

const getCellSubsets = (context: CandidateContext, cells: readonly CellInterface[], minimumSize: number): CellSubsetInterface[] => {
    const subsets: CellSubsetInterface[] = [];

    for (let size = minimumSize; size <= cells.length; size += 1) {
        forEachCombination(cells, size, subsetCells => {
            subsets.push({ cells: [...subsetCells], values: getUniqueValues(subsetCells.flatMap(cell => context.getCandidates(cell))) });
        });
    }

    return subsets;
};

const getValuesOutside = (values: readonly number[], excludedValues: readonly number[]): number[] =>
    values.filter(value => !excludedValues.includes(value));

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
        ).filter(core => core.values.length >= core.cells.length + minimumCoreExtraValues);

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
        const getSlack = (arm: CellSubsetInterface): number => arm.cells.length - getValuesOutside(arm.values, core.values).length;
        const isConnectedArm = (arm: CellSubsetInterface): boolean => arm.values.some(value => core.values.includes(value));
        const boxArmsBySlack = new Map<number, CellSubsetInterface[]>();

        for (const boxArm of boxArms.filter(isConnectedArm)) {
            boxArmsBySlack.set(getSlack(boxArm), [...(boxArmsBySlack.get(getSlack(boxArm)) ?? []), boxArm]);
        }

        const results: TechniqueResultInterface[] = [];

        for (const lineArm of lineArms.filter(isConnectedArm)) {
            const requiredBoxSlack = core.values.length - core.cells.length - getSlack(lineArm);

            for (const boxArm of boxArmsBySlack.get(requiredBoxSlack) ?? []) {
                if (!lineArm.values.some(value => boxArm.values.includes(value))) {
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
                [...lineArm.values, ...getValuesOutside(core.values, boxArm.values)]
            ),
            ...getRemainingEliminations(
                context,
                boxCells,
                [...core.cells, ...boxArm.cells],
                [...boxArm.values, ...getValuesOutside(core.values, lineArm.values)]
            )
        ]);

        return createEliminationResults(this.technique, eliminations, patternCells).map(result => ({
            ...result,
            patternCandidates: patternCells.flatMap(cell => context.getCandidates(cell).map(value => ({ cell, value })))
        }));
    }
}
