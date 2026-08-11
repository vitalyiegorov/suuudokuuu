'use client';

import { useFieldSnapshot } from '@suuudokuuu/field-core/react';

import { isDefined } from '@rnw-community/shared';

import { getFieldClassName } from '../../utils/get-field-class-name.util';
import { getFieldStepDotState } from '../../utils/get-field-step-dot-state.util';

import type { FieldStepPlayerLabelsInterface } from '../../interfaces/field-step-player-labels.interface';
import type { FieldNarrationRendererType } from '../../types/field-narration-renderer.type';
import type { FieldEngine } from '@suuudokuuu/field-core';

interface Props {
    engine: FieldEngine;
    labels: FieldStepPlayerLabelsInterface;
    narrationRenderer: FieldNarrationRendererType;
    className?: string;
}

export const FieldStepPlayer = ({ className, engine, labels, narrationRenderer }: Props) => {
    const snapshot = useFieldSnapshot(engine);
    const { stepIndex, stepScript } = snapshot;

    if (!isDefined(stepScript)) {
        return null;
    }

    const { steps } = stepScript;
    const currentStep = steps.at(stepIndex);
    const narration = isDefined(currentStep) ? narrationRenderer(currentStep) : null;
    const progressLabel = labels.stepProgress(stepIndex + 1, steps.length);
    const isFirstStep = stepIndex === 0;
    const isLastStep = stepIndex >= steps.length - 1;

    const handleBack = () => {
        engine.stepScriptBack();
    };

    const handleNext = () => {
        engine.stepScriptNext();
    };

    const handleReset = () => {
        engine.stepScriptReset();
    };

    const handleApply = () => {
        engine.applyStepScript();
    };

    return (
        <div aria-label={labels.stepPlayer} className={getFieldClassName('field-step-player', className)} role="group">
            <ol aria-label={progressLabel} className="field-step-player__progress">
                {steps.map((_step, dotIndex) => (
                    <li className="field-step-player__dot" data-state={getFieldStepDotState(dotIndex, stepIndex)} key={dotIndex} />
                ))}
            </ol>
            <p aria-live="polite" className="field-step-player__narration">
                {narration}
            </p>
            <div className="field-step-player__controls">
                <button className="field-step-player__control" disabled={isFirstStep} onClick={handleBack} type="button">
                    {labels.previousStep}
                </button>
                <button className="field-step-player__control" disabled={isLastStep} onClick={handleNext} type="button">
                    {labels.nextStep}
                </button>
                <button className="field-step-player__control" onClick={handleReset} type="button">
                    {labels.resetSteps}
                </button>
                <button className="field-step-player__control" onClick={handleApply} type="button">
                    {labels.applySteps}
                </button>
            </div>
        </div>
    );
};
