import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { isDefined, isNotEmptyArray } from '@rnw-community/shared';

import { PLACEMENT_TECHNIQUES } from '../../constants/placement-techniques.constant';
import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';
import { createTechniqueStrategies } from '../../utils/create-technique-strategies.util';
import { CandidateContext } from '../candidate-context/candidate-context';

import type { LogicalSolveResultInterface } from '../../interfaces/logical-solve-result.interface';
import type { TechniqueResultInterface } from '../../interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../interfaces/technique-strategy.interface';

interface LogicalStepInterface {
    technique: SolutionTechniqueEnum;
    placements: TechniqueResultInterface[];
}

export class LogicalSolver {
    private readonly strategies: TechniqueStrategyInterface[];
    private readonly placementStrategies: TechniqueStrategyInterface[];

    constructor(strategies: TechniqueStrategyInterface[] = createTechniqueStrategies()) {
        this.strategies = strategies;
        this.placementStrategies = strategies.filter(strategy => PLACEMENT_TECHNIQUES.includes(strategy.technique));
    }

    solve(puzzleString: string): LogicalSolveResultInterface {
        const sudoku = Sudoku.fromString(puzzleString, defaultSudokuConfig);
        const usedTechniques = new Set<SolutionTechniqueEnum>();

        while (this.hasBlankCells(sudoku)) {
            const step = this.findStep(sudoku);

            if (!isDefined(step)) {
                break;
            }

            usedTechniques.add(step.technique);
            this.applyPlacements(sudoku, step.placements);
        }

        const requiredTechniques = this.strategies.map(strategy => strategy.technique).filter(technique => usedTechniques.has(technique));

        return {
            isSolved: !this.hasBlankCells(sudoku),
            requiredTechniques,
            hardestTechnique: requiredTechniques.at(-1) ?? SolutionTechniqueEnum.Guess
        };
    }

    private hasBlankCells(sudoku: Sudoku): boolean {
        return sudoku.Field.some(row => row.some(cell => sudoku.isBlankCell(cell)));
    }

    private findStep(sudoku: Sudoku): LogicalStepInterface | null {
        let context = CandidateContext.fromSudoku(sudoku);

        for (const [index, strategy] of this.strategies.entries()) {
            const results = strategy.find(context);

            if (isNotEmptyArray(results)) {
                const placements = this.getPlacements(results);

                if (isNotEmptyArray(placements)) {
                    return { technique: strategy.technique, placements };
                }

                context = context.withEliminations(results.flatMap(result => result.eliminations));

                const enabledPlacements = this.findEnabledPlacements(context, index);

                if (isNotEmptyArray(enabledPlacements)) {
                    return { technique: strategy.technique, placements: enabledPlacements };
                }
            }
        }

        return null;
    }

    private findEnabledPlacements(context: CandidateContext, limitIndex: number): TechniqueResultInterface[] {
        const reachableStrategies = this.placementStrategies.filter(strategy => this.strategies.indexOf(strategy) < limitIndex);

        for (const strategy of reachableStrategies) {
            const placements = this.getPlacements(strategy.find(context));

            if (isNotEmptyArray(placements)) {
                return placements;
            }
        }

        return [];
    }

    private getPlacements(results: TechniqueResultInterface[]): TechniqueResultInterface[] {
        return results.filter(result => result.kind === 'placement');
    }

    private applyPlacements(sudoku: Sudoku, placements: TechniqueResultInterface[]): void {
        for (const placement of placements) {
            if (sudoku.isBlankCell(placement.cell)) {
                sudoku.setCellValue({ ...placement.cell, value: placement.value });
            }
        }
    }
}
