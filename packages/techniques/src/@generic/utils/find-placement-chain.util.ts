import { isDefined } from '@rnw-community/shared';

import { CandidateContext } from '../classes/candidate-context/candidate-context';
import { PLACEMENT_CHAIN_MAX_STEPS } from '../constants/placement-chain.constant';

import { applyTechniqueStep } from './apply-technique-step.util';
import { createTechniqueStrategies } from './create-technique-strategies.util';
import { findProgressingStep } from './find-progressing-step.util';
import { isProgressingResult } from './is-progressing-result.util';
import { isSameCell } from './is-same-cell.util';

import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../interfaces/technique-strategy.interface';
import type { Sudoku } from '@suuudokuuu/generator';

const isSingleValueElimination = (step: TechniqueResultInterface): boolean =>
    step.kind === 'elimination' && step.eliminations.every(elimination => elimination.value === step.value);

const coversElimination = (context: CandidateContext, result: TechniqueResultInterface, step: TechniqueResultInterface): boolean =>
    step.eliminations.every(
        elimination =>
            !context.getCandidates(elimination.cell).includes(elimination.value) ||
            result.eliminations.some(
                resultElimination => isSameCell(resultElimination.cell, elimination.cell) && resultElimination.value === elimination.value
            )
    );

const isSameDeduction = (context: CandidateContext, result: TechniqueResultInterface, step: TechniqueResultInterface): boolean => {
    if (result.kind !== step.kind) {
        return false;
    }

    if (step.kind === 'placement') {
        return isSameCell(result.cell, step.cell) && result.value === step.value;
    }

    return isProgressingResult(context, result) && coversElimination(context, result, step);
};

const rederiveStep = (
    strategies: TechniqueStrategyInterface[],
    context: CandidateContext,
    step: TechniqueResultInterface
): TechniqueResultInterface | undefined => {
    const strategy = strategies.find(candidate => candidate.technique === step.technique);
    const results = isSingleValueElimination(step)
        ? strategy?.find(context, { cell: step.cell, value: step.value, intent: 'enabling' })
        : strategy?.find(context);

    return results?.find(result => isSameDeduction(context, result, step));
};

const replayChain = (
    strategies: TechniqueStrategyInterface[],
    startContext: CandidateContext,
    steps: TechniqueResultInterface[]
): TechniqueResultInterface[] | null => {
    const replayedSteps: TechniqueResultInterface[] = [];

    let context = startContext;

    for (const step of steps) {
        if (isProgressingResult(context, step)) {
            const replayedStep = rederiveStep(strategies, context, step);

            if (!isDefined(replayedStep)) {
                return null;
            }

            replayedSteps.push(replayedStep);
            context = applyTechniqueStep(context, replayedStep);
        }
    }

    return replayedSteps;
};

const pruneChain = (
    strategies: TechniqueStrategyInterface[],
    steps: TechniqueResultInterface[],
    contexts: CandidateContext[]
): TechniqueResultInterface[] => {
    let keptSteps = steps.slice(-1);

    for (let stepIndex = steps.length - 2; stepIndex >= 0; stepIndex -= 1) {
        keptSteps = replayChain(strategies, contexts[stepIndex], keptSteps) ?? [steps[stepIndex], ...keptSteps];
    }

    return keptSteps;
};

export const findPlacementChain = (sudoku: Sudoku, strategies = createTechniqueStrategies()): TechniqueResultInterface[] => {
    const steps: TechniqueResultInterface[] = [];
    const contexts: CandidateContext[] = [];

    let context = CandidateContext.fromSudoku(sudoku);
    let step = findProgressingStep(context, strategies);

    while (isDefined(step)) {
        steps.push(step);
        contexts.push(context);

        if (step.kind === 'placement') {
            return pruneChain(strategies, steps, contexts);
        }

        if (steps.length >= PLACEMENT_CHAIN_MAX_STEPS) {
            return [];
        }

        context = applyTechniqueStep(context, step);
        step = findProgressingStep(context, strategies);
    }

    return [];
};
