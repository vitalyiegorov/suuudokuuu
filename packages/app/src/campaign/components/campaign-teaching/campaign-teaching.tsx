import { Trans, useLingui } from '@lingui/react/macro';
import { FieldEngine, findStepScript } from '@suuudokuuu/field-core';
import { useFieldSnapshot } from '@suuudokuuu/field-core/react';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { CampaignService } from '@suuudokuuu/progress';
import { createTechniqueStrategies } from '@suuudokuuu/techniques';
import { AppButton } from '@suuudokuuu/ui';
import * as Effect from 'effect/Effect';
import { useState } from 'react';

import { emptyFn, isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { appRuntime } from '../../../@generic/runtime/app.runtime';
import { gameGetStepNarration } from '../../../game/utils/game-get-step-narration.util';
import { CampaignSelectors } from '../../campaign.selectors';
import { CampaignBoard } from '../campaign-board/campaign-board';

import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

interface Props {
    readonly technique: SolutionTechniqueEnum;
    readonly board: string;
}

export const CampaignTeaching = ({ technique, board }: Props) => {
    const { i18n, t } = useLingui();
    const [engine] = useState(() => new FieldEngine({ sudokuString: board, difficulty: DifficultyEnum.Newbie, showAutoCandidates: true }));
    const [script] = useState(() =>
        findStepScript(
            engine.Sudoku,
            createTechniqueStrategies().filter(strategy => strategy.technique === technique)
        )
    );
    const [feedback, setFeedback] = useState('');
    const snapshot = useFieldSnapshot(engine);
    const handleNext = () => engine.stepScriptNext();
    const handleError = () => void setFeedback(t`Teaching progress could not be saved.`);
    const handleTeach = () => {
        if (!isDefined(script)) {
            return;
        }
        engine.startStepScript(script);
        void appRuntime
            .runPromise(Effect.flatMap(CampaignService, service => service.observeLesson(technique)).pipe(Effect.tapCause(Effect.logError)))
            .then(emptyFn, handleError);
    };
    if (!isDefined(script)) {
        return (
            <BlackText>
                <Trans>This lesson is unavailable.</Trans>
            </BlackText>
        );
    }
    const currentStep = snapshot.stepScript?.steps[snapshot.stepIndex];
    const techniqueName = i18n._(techniqueLabelsConstant[technique]);
    const isNextDisabled = snapshot.stepIndex >= script.steps.length - 1;

    return (
        <CampaignBoard engine={engine}>
            <AppButton onPress={handleTeach} testID={CampaignSelectors.TEACH} text={t`Show teaching example`} variant="secondary" />
            {isDefined(currentStep) ? (
                <>
                    <BlackText>{i18n._(gameGetStepNarration(currentStep, techniqueName))}</BlackText>
                    <AppButton
                        disabled={isNextDisabled}
                        onPress={handleNext}
                        testID={CampaignSelectors.NEXT}
                        text={t`Next`}
                        variant="secondary"
                    />
                </>
            ) : null}
            <BlackText testID={CampaignSelectors.FEEDBACK}>{feedback}</BlackText>
        </CampaignBoard>
    );
};
