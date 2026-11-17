import { useAtomValue } from '@effect/atom-react/Hooks';
import { ImportedPuzzleAssessmentKindEnum } from '@suuudokuuu/puzzle-forge';
import * as Effect from 'effect/Effect';
import * as AsyncResult from 'effect/reactivity/AsyncResult';
import { NotificationFeedbackType } from 'expo-haptics';
import { useState, useEffect, useEffectEvent } from 'react';

import { isDefined } from '@rnw-community/shared';

import { useVibration } from '../../../../@generic/hooks/use-vibration.hook';
import { appAtomRuntime } from '../../../../@generic/runtime/app.runtime';
import { GameEmptySudokuStringConstant } from '../../../../game/constant/empty-sudoku-string.constant';
import { LoaderPaintDelayMillisecondsConstant } from '../../../../game/constant/loader-paint-delay.constant';
import { PuzzleGenerationService } from '../../../../game/service/puzzle-generation.service';

import type * as Atom from 'effect/reactivity/Atom';

export const useImportAssessment = (puzzleAtom: Atom.Atom<string>, puzzleString: string) => {
    const [hapticNotification] = useVibration();
    const [assessmentAtom] = useState(() =>
        appAtomRuntime.atom(get => {
            const assessedPuzzleString = get(puzzleAtom);

            return Effect.sleep(LoaderPaintDelayMillisecondsConstant).pipe(
                Effect.andThen(Effect.flatMap(PuzzleGenerationService, service => service.assess(assessedPuzzleString))),
                Effect.map(assessment => ({ assessment, puzzleString: assessedPuzzleString }))
            );
        })
    );
    const assessmentResult = useAtomValue(assessmentAtom);
    const hasDigits = puzzleString !== GameEmptySudokuStringConstant;
    const assessed = AsyncResult.isSuccess(assessmentResult) ? assessmentResult.value : null;
    const isAssessedCurrent = isDefined(assessed) && assessed.puzzleString === puzzleString;

    const settledAssessed = assessmentResult.waiting ? null : assessed;
    const isCheckFailed = AsyncResult.isFailure(assessmentResult) && !assessmentResult.waiting;
    const boardAssessed = hasDigits && assessed?.puzzleString !== GameEmptySudokuStringConstant ? assessed : null;
    const uniqueAssessment =
        isAssessedCurrent && assessed.assessment.kind === ImportedPuzzleAssessmentKindEnum.UNIQUE ? assessed.assessment : null;
    const conflictCellIndexes =
        boardAssessed?.assessment.kind === ImportedPuzzleAssessmentKindEnum.CONFLICT
            ? boardAssessed.assessment.cellIndexes.filter(cellIndex => puzzleString[cellIndex] === boardAssessed.puzzleString[cellIndex])
            : [];
    const onAssessmentSettled = useEffectEvent(hapticNotification);
    useEffect(() => {
        const settledKind = settledAssessed?.assessment.kind;

        if (settledKind === ImportedPuzzleAssessmentKindEnum.CONFLICT) {
            onAssessmentSettled(NotificationFeedbackType.Warning);
        } else if (settledKind === ImportedPuzzleAssessmentKindEnum.UNIQUE) {
            onAssessmentSettled(NotificationFeedbackType.Success);
        }
    }, [settledAssessed]);

    return { hasDigits, boardAssessed, uniqueAssessment, isCheckFailed, conflictCellIndexes };
};
