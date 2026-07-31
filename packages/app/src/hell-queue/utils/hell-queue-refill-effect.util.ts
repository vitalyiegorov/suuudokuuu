import { HellGenerator } from '@suuudokuuu/generator';
import { BitmaskSolver } from '@suuudokuuu/solver-bitmask';
import { AppState } from 'react-native';

import { getErrorMessage } from '@rnw-community/shared';

import { appRootStore } from '../../@generic/app-root.store';
import {
    HellQueueCapacity,
    HellQueueGeneratorMaximumGivens,
    HellQueueGeneratorMinimumGivens,
    HellQueueGeneratorTabuCapacity,
    HellQueueGeneratorVersion
} from '../constants/hell-queue.constant';
import { HellQueueEntrySchemaVersion } from '../schema/hell-queue-entry.schema';
import { hellQueueEnqueueAction } from '../store/hell-queue.actions';
import { hellQueueCountSelector, hellQueueEntriesSelector } from '../store/hell-queue.selectors';

import { createHellCandidateGate } from './hell-candidate-gate.util';
import { runHellRefill } from './hell-refill-scheduler.util';

import type { HellQueueRefillDependenciesInterface } from '../interfaces/hell-queue-refill-dependencies.interface';

const isBelowHellQueueCapacity = (): boolean => hellQueueCountSelector(appRootStore.getState()) < HellQueueCapacity;

const attemptHellQueueRefillRun = (dependencies: HellQueueRefillDependenciesInterface): void => {
    const { dispatch, isCancelledRef, isRunningRef } = dependencies;

    if (isRunningRef.current || !isBelowHellQueueCapacity()) {
        return;
    }

    isRunningRef.current = true;

    const generator = new HellGenerator(new BitmaskSolver(), {
        candidateGate: createHellCandidateGate(),
        maxGivens: HellQueueGeneratorMaximumGivens,
        minGivens: HellQueueGeneratorMinimumGivens,
        randomSeed: Date.now(),
        tabuCapacity: HellQueueGeneratorTabuCapacity
    });

    generator.seedWith(hellQueueEntriesSelector(appRootStore.getState()).map(entry => entry.puzzle));

    const finishRun = (): void => {
        isRunningRef.current = false;
    };

    const handleRunError = (error: unknown): void => {
        finishRun();
        getErrorMessage(error);
    };

    runHellRefill({
        advance: budgetMilliseconds => generator.advance(budgetMilliseconds),
        onCandidate: candidate => {
            dispatch(
                hellQueueEnqueueAction({
                    createdAt: Date.now(),
                    generatorVersion: HellQueueGeneratorVersion,
                    givensCount: candidate.givensCount,
                    id: candidate.puzzle,
                    puzzle: candidate.puzzle,
                    schemaVersion: HellQueueEntrySchemaVersion,
                    solution: candidate.solution
                })
            );
        },
        shouldContinue: () => !isCancelledRef.current && isBelowHellQueueCapacity()
    })
        .then(finishRun)
        .catch(handleRunError);
};

export const hellQueueRunRefillEffect = (dependencies: HellQueueRefillDependenciesInterface): (() => void) => {
    const { isCancelledRef } = dependencies;

    isCancelledRef.current = false;
    attemptHellQueueRefillRun(dependencies);

    const handleAppStateChange = (nextAppState: string): void => {
        if (nextAppState === 'active') {
            isCancelledRef.current = false;
            attemptHellQueueRefillRun(dependencies);

            return;
        }

        isCancelledRef.current = true;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
        isCancelledRef.current = true;
        subscription.remove();
    };
};
