import { useLingui } from '@lingui/react/macro';
import { FieldEngine, findStepScript } from '@suuudokuuu/field-core';
import { useFieldSnapshot } from '@suuudokuuu/field-core/react';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { CampaignService } from '@suuudokuuu/progress';
import { CandidateContext, createTechniqueStrategies } from '@suuudokuuu/techniques';
import * as Effect from 'effect/Effect';
import { useState } from 'react';

import { isDefined } from '@rnw-community/shared';

import { appRuntime } from '../../@generic/runtime/app.runtime';

import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export const useCampaignPractice = (technique: SolutionTechniqueEnum, board: string, practiceId: string, completed: boolean) => {
    const { t } = useLingui();
    const [engine] = useState(() => new FieldEngine({ sudokuString: board, difficulty: DifficultyEnum.Newbie, showAutoCandidates: true }));
    const [script] = useState(() =>
        findStepScript(
            engine.Sudoku,
            createTechniqueStrategies().filter(strategy => strategy.technique === technique)
        )
    );
    const [deductions] = useState(() => {
        const context = CandidateContext.fromSudoku(engine.Sudoku);

        return createTechniqueStrategies()
            .filter(strategy => strategy.technique === technique)
            .flatMap(strategy => strategy.find(context));
    });
    const [isComplete, setIsComplete] = useState(completed);
    const [isSaving, setIsSaving] = useState(false);
    const [assisted, setAssisted] = useState(false);
    const [feedback, setFeedback] = useState('');
    const snapshot = useFieldSnapshot(engine);
    const handleError = () => {
        setIsSaving(false);
        setFeedback(t`Practice progress could not be saved. Try again.`);
    };
    const handleSuccess = (saved: boolean) => {
        setIsSaving(false);
        if (saved) {
            setIsComplete(true);
        } else {
            setFeedback(t`This lesson is unavailable.`);
        }
    };
    const saveCompletion = () => {
        setFeedback('');
        setIsSaving(true);
        void appRuntime
            .runPromise(
                Effect.flatMap(CampaignService, service => service.completePractice(technique, practiceId, assisted)).pipe(
                    Effect.tapCause(Effect.logError)
                )
            )
            .then(handleSuccess, handleError);
    };
    const handleInput = (value: number) => {
        const selected = snapshot.selectedCell;
        if (isSaving || isComplete || !isDefined(script) || !isDefined(selected)) {
            return;
        }
        const placement = deductions.find(
            result => result.kind === 'placement' && result.value === value && result.cell.x === selected.x && result.cell.y === selected.y
        );
        const isValidElimination = deductions.some(result =>
            result.eliminations.some(
                elimination => elimination.value === value && elimination.cell.x === selected.x && elimination.cell.y === selected.y
            )
        );
        if (!isDefined(placement) && !isValidElimination) {
            setAssisted(true);
            setFeedback(
                t`That deduction does not match this technique. This attempt counts as assisted. Retry for an unassisted completion.`
            );

            return;
        }
        if (isDefined(placement)) {
            engine.placeValue(selected, value);
        } else {
            engine.removeCandidate(selected, value);
        }
        saveCompletion();
    };

    return { engine, script, isComplete, isSaving, assisted, feedback, handleInput };
};
