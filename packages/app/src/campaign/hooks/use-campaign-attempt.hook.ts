import { useLingui } from '@lingui/react/macro';
import { FieldEngine, findStepScript } from '@suuudokuuu/field-core';
import { useFieldSnapshot } from '@suuudokuuu/field-core/react';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { CampaignService } from '@suuudokuuu/progress';
import { createTechniqueStrategies } from '@suuudokuuu/techniques';
import * as Effect from 'effect/Effect';
import * as Fiber from 'effect/Fiber';
import { useEffect, useRef, useState } from 'react';

import { isDefined } from '@rnw-community/shared';

import { appRuntime, type AppServices } from '../../@generic/runtime/app.runtime';

import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export const useCampaignAttempt = (technique: SolutionTechniqueEnum, board: string, completed: boolean, practiceId?: string) => {
    const { t } = useLingui();
    const [engine] = useState(() => new FieldEngine({ sudokuString: board, difficulty: DifficultyEnum.Newbie, showAutoCandidates: true }));
    const [script] = useState(() => {
        const deduction = findStepScript(
            engine.Sudoku,
            createTechniqueStrategies().filter(strategy => strategy.technique === technique)
        );
        engine.selectCell(deduction?.placement?.cell ?? deduction?.eliminations[0]?.cell);

        return deduction;
    });
    const [isComplete, setIsComplete] = useState(completed);
    const [isSaving, setIsSaving] = useState(false);
    const [feedback, setFeedback] = useState('');
    const snapshot = useFieldSnapshot(engine);
    const pendingCommand = useRef<Fiber.Fiber<void> | null>(null);
    const isCommandPending = () => isDefined(pendingCommand.current) && !isDefined(pendingCommand.current.pollUnsafe());
    const runCommand = (command: Effect.Effect<void, never, AppServices>) => {
        if (isCommandPending()) {
            return;
        }
        setIsSaving(true);
        pendingCommand.current = appRuntime.runFork(
            command.pipe(
                Effect.ensuring(Effect.sync(() => void setIsSaving(false))),
                Effect.catchCause(cause =>
                    Effect.logError(cause).pipe(Effect.andThen(Effect.sync(() => void setFeedback(t`This lesson is unavailable.`))))
                )
            )
        );
    };
    const handleTeach = () => {
        if (isDefined(script) && !isSaving) {
            runCommand(
                Effect.flatMap(CampaignService, service => service.recordSeen(technique)).pipe(
                    Effect.tap(() => Effect.sync(() => void engine.startStepScript(script)))
                )
            );
        }
    };
    const handleInput = (value: number) => {
        const selected = snapshot.selectedCell;
        if (isCommandPending() || isSaving || isComplete || !isDefined(script) || !isDefined(selected) || !isDefined(practiceId)) {
            return;
        }
        const target = script.placement ?? script.eliminations[0];
        if (!isDefined(target) || target.value !== value) {
            setFeedback(t`That deduction does not match this technique. Try another digit.`);

            return;
        }
        if (isDefined(script.placement)) {
            engine.placeValue(selected, value);
        } else {
            engine.removeCandidate(selected, value);
        }
        setFeedback('');
        runCommand(
            Effect.flatMap(CampaignService, service => service.completePractice(technique, practiceId, false)).pipe(
                Effect.tap(saved =>
                    Effect.sync(() => {
                        if (saved) {
                            setIsComplete(true);
                        } else {
                            setFeedback(t`This lesson is unavailable.`);
                        }
                    })
                ),
                Effect.asVoid
            )
        );
    };

    useEffect(
        () => () => {
            if (isDefined(pendingCommand.current)) {
                appRuntime.runFork(Fiber.interrupt(pendingCommand.current));
            }
        },
        []
    );

    return { engine, script, isComplete, isSaving, feedback, snapshot, handleTeach, handleInput };
};
