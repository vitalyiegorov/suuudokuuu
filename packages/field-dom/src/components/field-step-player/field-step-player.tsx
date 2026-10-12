'use client';

import { useFieldSnapshot } from '@suuudokuuu/field-core/react';

import { isDefined } from '@rnw-community/shared';

import { getFieldStepDotState } from '../../utils/get-field-step-dot-state.util';

import type { FieldStepPlayerLabelsInterface } from '../../interfaces/field-step-player-labels.interface';
import type { FieldNarrationRendererType } from '../../types/field-narration-renderer.type';
import type { FieldEngine } from '@suuudokuuu/field-core';

const maxProgressDots = 9;

interface Props {
    readonly engine: FieldEngine;
    readonly labels: FieldStepPlayerLabelsInterface;
    readonly narrationRenderer: FieldNarrationRendererType;
}

export const FieldStepPlayer = ({ engine, labels, narrationRenderer }: Props) => {
    const snapshot = useFieldSnapshot(engine);
    const { stepIndex, stepScript } = snapshot;

    const hasStepScript = isDefined(stepScript);
    const steps = stepScript?.steps ?? [];
    const currentStep = steps.at(stepIndex);
    const narration = isDefined(currentStep) ? narrationRenderer(currentStep) : null;
    const progressLabel = hasStepScript ? labels.stepProgress(stepIndex + 1, steps.length) : '';
    const isFirstStep = stepIndex === 0;
    const isLastStep = stepIndex >= steps.length - 1;
    const hasProgressCount = steps.length > maxProgressDots;

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
        <div aria-label={labels.stepPlayer} className="field-step-player" data-active={hasStepScript} role="group">
            {hasStepScript &&
                (hasProgressCount ? (
                    <span className="field-step-player__progress-count">{progressLabel}</span>
                ) : (
                    <ol aria-label={progressLabel} className="field-step-player__progress">
                        {steps.map((_step, dotIndex) => (
                            <li className="field-step-player__dot" data-state={getFieldStepDotState(dotIndex, stepIndex)} key={dotIndex} />
                        ))}
                    </ol>
                ))}
            <p aria-live="polite" className="field-step-player__narration">
                {narration}
            </p>
            {hasStepScript && (
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
            )}
        </div>
    );
};
