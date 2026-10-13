import { isDefined, isNotEmptyArray } from '@rnw-community/shared';

import { CandidateContext } from '../classes/candidate-context/candidate-context';
import {
    PLACEMENT_CHAIN_DEFAULT_SCAN_COST,
    PLACEMENT_CHAIN_DIFFICULTIES,
    PLACEMENT_CHAIN_DIFFICULTY_TOLERANCE,
    PLACEMENT_CHAIN_MAX_STEPS,
    PLACEMENT_CHAIN_SCAN_COSTS,
    PLACEMENT_CHAIN_WORK_BUDGET
} from '../constants/placement-chain.constant';
import { SolutionTechniqueEnum } from '../enums/solution-technique.enum';

import { applyTechniqueStep } from './apply-technique-step.util';
import { createTechniqueStrategies } from './create-technique-strategies.util';
import { findProgressingStep } from './find-progressing-step.util';
import { isProgressingResult } from './is-progressing-result.util';
import { isSameCell } from './is-same-cell.util';

import type { CandidateEliminationInterface } from '../interfaces/candidate-elimination.interface';
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

const getBranchPathLength = (result: TechniqueResultInterface): number =>
    (result.branches ?? []).reduce((pathLength, branch) => pathLength + 1 + branch.implications.length, 0);

const createBudgetedStrategies = (unbudgetedStrategies: TechniqueStrategyInterface[]): TechniqueStrategyInterface[] => {
    let spentWork = 0;

    return unbudgetedStrategies.map(strategy => ({
        technique: strategy.technique,
        find: (context, target) => {
            if (spentWork >= PLACEMENT_CHAIN_WORK_BUDGET) {
                return [];
            }

            spentWork += PLACEMENT_CHAIN_SCAN_COSTS[strategy.technique] ?? PLACEMENT_CHAIN_DEFAULT_SCAN_COST;

            return [...strategy.find(context, target)].sort(
                (firstResult, secondResult) => getBranchPathLength(firstResult) - getBranchPathLength(secondResult)
            );
        }
    }));
};

const singleTechniques = new Set([SolutionTechniqueEnum.FullHouse, SolutionTechniqueEnum.NakedSingle, SolutionTechniqueEnum.HiddenSingle]);

const findShortPlacementRoute = (
    strategies: TechniqueStrategyInterface[],
    singleStrategies: TechniqueStrategyInterface[],
    context: CandidateContext
): TechniqueResultInterface[] => {
    for (const strategy of strategies) {
        for (const result of strategy.find(context).filter(candidate => isProgressingResult(context, candidate))) {
            if (result.kind === 'placement') {
                return [result];
            }

            const enabledPlacement = findProgressingStep(applyTechniqueStep(context, result), singleStrategies);

            if (isDefined(enabledPlacement)) {
                return [result, enabledPlacement];
            }
        }
    }

    return [];
};

const findGreedyPlacementChain = (
    strategies: TechniqueStrategyInterface[],
    startContext: CandidateContext,
    firstStep: TechniqueResultInterface,
    contexts: CandidateContext[]
): TechniqueResultInterface[] => {
    const steps: TechniqueResultInterface[] = [];

    let context = startContext;
    let step: TechniqueResultInterface | null = firstStep;

    while (isDefined(step)) {
        steps.push(step);
        contexts.push(context);

        if (step.kind === 'placement') {
            return pruneChain(strategies, steps, contexts);
        }

        context = applyTechniqueStep(context, step);

        if (steps.length >= PLACEMENT_CHAIN_MAX_STEPS) {
            contexts.push(context);

            return steps;
        }

        step = findProgressingStep(context, strategies);
    }

    return steps;
};

const findPlacementRoute = (
    unbudgetedStrategies: TechniqueStrategyInterface[],
    strategies: TechniqueStrategyInterface[],
    startContext: CandidateContext,
    firstStep: TechniqueResultInterface
): TechniqueResultInterface[] => {
    const contexts: CandidateContext[] = [];
    const steps = findGreedyPlacementChain(strategies, startContext, firstStep, contexts);

    if (steps.at(-1)?.kind === 'placement') {
        return steps;
    }

    const shortRouteStrategies = createBudgetedStrategies(unbudgetedStrategies);
    const singleStrategies = unbudgetedStrategies.filter(strategy => singleTechniques.has(strategy.technique));

    for (const [contextIndex, routeContext] of contexts.entries()) {
        const shortRoute = findShortPlacementRoute(shortRouteStrategies, singleStrategies, routeContext);

        if (isNotEmptyArray(shortRoute)) {
            return pruneChain(shortRouteStrategies, [...steps.slice(0, contextIndex), ...shortRoute], contexts.slice(0, contextIndex + 1));
        }
    }

    return [];
};

export const findPlacementChain = (
    sudoku: Sudoku,
    unbudgetedStrategies = createTechniqueStrategies(),
    previousEliminations: CandidateEliminationInterface[] = [],
    includeFirstStepOnExhaustion = false
): TechniqueResultInterface[] => {
    const strategies = createBudgetedStrategies(unbudgetedStrategies);
    const sudokuContext = CandidateContext.fromSudoku(sudoku);
    const context = previousEliminations.length > 0 ? sudokuContext.withEliminations(previousEliminations) : sudokuContext;
    const firstStep = findProgressingStep(context, strategies);

    if (!isDefined(firstStep)) {
        return [];
    }

    const difficultyLimit = PLACEMENT_CHAIN_DIFFICULTIES[firstStep.technique] + PLACEMENT_CHAIN_DIFFICULTY_TOLERANCE;
    const isWithinDifficulty = (strategy: TechniqueStrategyInterface): boolean =>
        PLACEMENT_CHAIN_DIFFICULTIES[strategy.technique] <= difficultyLimit;
    const route = findPlacementRoute(
        unbudgetedStrategies.filter(isWithinDifficulty),
        strategies.filter(isWithinDifficulty),
        context,
        firstStep
    );

    if (isNotEmptyArray(route) || !includeFirstStepOnExhaustion) {
        return route;
    }

    return [firstStep];
};
