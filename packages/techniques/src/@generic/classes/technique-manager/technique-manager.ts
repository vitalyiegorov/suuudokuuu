import { isDefined, isNotEmptyArray } from '@rnw-community/shared';

import { GuessTechnique } from '../../../guess-technique/classes/guess.technique';
import { canSee } from '../../utils/can-see.util';
import { wasContextSearchCapped } from '../../utils/context-scan-state.util';
import { createTechniqueStrategies } from '../../utils/create-technique-strategies.util';
import { isForcedPlacement } from '../../utils/is-forced-placement.util';
import { isSameCell } from '../../utils/is-same-cell.util';
import { CandidateContext } from '../candidate-context/candidate-context';

import type { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';
import type { LogicalSolveResultInterface } from '../../interfaces/logical-solve-result.interface';
import type { MoveClassificationInterface } from '../../interfaces/move-classification.interface';
import type { TechniqueResultInterface } from '../../interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../interfaces/technique-strategy.interface';
import type { LogicalSolveOutcomeType } from '../../types/logical-solve-outcome.type';
import type { CellInterface, Sudoku } from '@suuudokuuu/generator';

export class TechniqueManager {
    private readonly strategies: TechniqueStrategyInterface[];
    private readonly guessTechnique: GuessTechnique;

    constructor(
        private readonly sudoku: Sudoku,
        strategies: TechniqueStrategyInterface[] = createTechniqueStrategies()
    ) {
        this.strategies = strategies;
        this.guessTechnique = new GuessTechnique(sudoku);
    }

    findNextStep(): TechniqueResultInterface | null {
        const context = CandidateContext.fromSudoku(this.sudoku);

        for (const strategy of this.strategies) {
            const [result] = strategy.find(context);

            if (isDefined(result)) {
                return result;
            }
        }

        const [blankCell] = context.getBlankCells();

        return isDefined(blankCell) ? this.guessTechnique.findForCell(blankCell) : null;
    }

    solveLogically(techniqueOrder?: readonly SolutionTechniqueEnum[]): LogicalSolveResultInterface {
        const orderedStrategies = this.getOrderedStrategies(techniqueOrder);
        const steps: TechniqueResultInterface[] = [];
        const stepLimit = this.getStepLimit();

        let context = CandidateContext.fromSudoku(this.sudoku);
        let step = this.findProgressingStep(context, orderedStrategies);
        let wasSearchCapped = wasContextSearchCapped(context);

        while (isDefined(step) && steps.length < stepLimit) {
            steps.push(step);
            context = this.applyStep(context, step);
            step = this.findProgressingStep(context, orderedStrategies);
            wasSearchCapped ||= wasContextSearchCapped(context);
        }

        return { outcome: this.getSolveOutcome(context), steps, wasSearchCapped };
    }

    identifyMove(cell: CellInterface, techniqueOrder?: readonly SolutionTechniqueEnum[]): MoveClassificationInterface {
        const context = CandidateContext.fromSudoku(this.sudoku);
        const orderedStrategies = this.getOrderedStrategies(techniqueOrder);
        const targetValue = this.getTargetValue(cell);
        const technique =
            this.findDirectTechnique(context, orderedStrategies, cell, targetValue) ??
            this.findEnablingTechnique(context, orderedStrategies, cell, targetValue) ??
            this.findComposedTechnique(context, orderedStrategies, cell, targetValue);

        return { technique: technique ?? this.guessTechnique.technique, value: targetValue };
    }

    private getOrderedStrategies(techniqueOrder?: readonly SolutionTechniqueEnum[]): TechniqueStrategyInterface[] {
        if (!isDefined(techniqueOrder)) {
            return this.strategies;
        }

        return techniqueOrder.map(technique => this.strategies.find(strategy => strategy.technique === technique)).filter(isDefined);
    }

    private getStepLimit(): number {
        const { fieldSize } = this.sudoku.Config;

        return fieldSize * fieldSize * (fieldSize + 1);
    }

    private findProgressingStep(context: CandidateContext, strategies: TechniqueStrategyInterface[]): TechniqueResultInterface | null {
        if (context.hasContradiction() || context.isSolved()) {
            return null;
        }

        for (const strategy of strategies) {
            const result = strategy.find(context).find(candidate => this.isProgressingResult(context, candidate));

            if (isDefined(result)) {
                return result;
            }
        }

        return null;
    }

    private isProgressingResult(context: CandidateContext, result: TechniqueResultInterface): boolean {
        if (result.kind === 'placement') {
            return isNotEmptyArray(context.getCandidates(result.cell));
        }

        return result.eliminations.some(elimination => context.getCandidates(elimination.cell).includes(elimination.value));
    }

    private applyStep(context: CandidateContext, step: TechniqueResultInterface): CandidateContext {
        const eliminatedContext = context.withEliminations(step.eliminations);

        return step.kind === 'placement' ? eliminatedContext.withPlacement(step.cell, step.value) : eliminatedContext;
    }

    private getSolveOutcome(context: CandidateContext): LogicalSolveOutcomeType {
        if (context.hasContradiction()) {
            return 'contradiction';
        }

        return context.isSolved() ? 'solved' : 'stuck';
    }

    private findDirectTechnique(
        context: CandidateContext,
        strategies: TechniqueStrategyInterface[],
        cell: CellInterface,
        value: number
    ): SolutionTechniqueEnum | null {
        for (const strategy of strategies) {
            const results = strategy.find(context, { cell, value, intent: 'direct' });
            const result = results.find(candidate => this.isDirectResult(context, candidate, cell, value));

            if (isDefined(result)) {
                return result.technique;
            }
        }

        return null;
    }

    private findEnablingTechnique(
        context: CandidateContext,
        strategies: TechniqueStrategyInterface[],
        cell: CellInterface,
        value: number
    ): SolutionTechniqueEnum | null {
        if (isForcedPlacement(context, cell, value)) {
            return null;
        }

        for (const strategy of strategies) {
            const results = strategy.find(context, { cell, value, intent: 'enabling' });
            const result = results.find(candidate => this.isEnablingResult(context, candidate, cell, value));

            if (isDefined(result)) {
                return result.technique;
            }
        }

        return null;
    }

    private isEnablingResult(context: CandidateContext, result: TechniqueResultInterface, cell: CellInterface, value: number): boolean {
        const clearsPeerCandidate = result.eliminations.some(
            elimination => elimination.value === value && canSee(context, elimination.cell, cell)
        );

        return clearsPeerCandidate && isForcedPlacement(context.withEliminations(result.eliminations), cell, value);
    }

    private findComposedTechnique(
        context: CandidateContext,
        orderedStrategies: TechniqueStrategyInterface[],
        cell: CellInterface,
        value: number
    ): SolutionTechniqueEnum | null {
        if (isForcedPlacement(context, cell, value)) {
            return null;
        }

        let composedContext = context;
        let hardestStrategyIndex = -1;

        for (let stepCount = 0; stepCount < this.getStepLimit(); stepCount += 1) {
            const step = this.findProgressingStep(composedContext, orderedStrategies);

            if (!isDefined(step)) {
                return null;
            }

            hardestStrategyIndex = Math.max(
                hardestStrategyIndex,
                orderedStrategies.findIndex(strategy => strategy.technique === step.technique)
            );
            composedContext = this.applyStep(composedContext, step);

            const isPlayedByThisStep = step.kind === 'placement' && isSameCell(step.cell, cell) && step.value === value;

            if (isPlayedByThisStep || isForcedPlacement(composedContext, cell, value)) {
                return orderedStrategies[hardestStrategyIndex]?.technique ?? null;
            }
        }

        return null;
    }

    private getTargetValue(cell: CellInterface): number {
        return cell.value === this.sudoku.Config.blankCellValue ? this.sudoku.getCorrectValue(cell) : cell.value;
    }

    private isDirectResult(context: CandidateContext, result: TechniqueResultInterface, cell: CellInterface, value: number): boolean {
        if (result.kind === 'placement') {
            return isSameCell(result.cell, cell) && result.value === value;
        }

        const targetsCell = result.eliminations.some(elimination => isSameCell(elimination.cell, cell));

        if (!targetsCell) {
            return false;
        }

        const remainingCandidates = context
            .getCandidates(cell)
            .filter(
                candidate => !result.eliminations.some(elimination => isSameCell(elimination.cell, cell) && elimination.value === candidate)
            );
        const [remainingValue] = remainingCandidates;

        return remainingCandidates.length === 1 && remainingValue === value;
    }
}
