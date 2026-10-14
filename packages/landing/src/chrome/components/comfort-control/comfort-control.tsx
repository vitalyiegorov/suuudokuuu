'use client';

import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { track } from '@vercel/analytics';
import { useSyncExternalStore } from 'react';

import { isDefined } from '@rnw-community/shared';

import {
    COMFORT_SCALE_CSS_PROPERTY,
    COMFORT_SCALE_STEPS,
    COMFORT_SCALE_STORAGE_KEY,
    DEFAULT_COMFORT_SCALE_STEP
} from '../../constants/comfort-scale.constant';
import { ComfortScaleStepEnum } from '../../enums/comfort-scale-step.enum';

import type { ComfortScaleStepInterface } from '../../interfaces/comfort-scale-step.interface';
import type { MessageDescriptor } from '@lingui/core';

const COMFORT_SCALE_STEP_LABELS: Readonly<Record<ComfortScaleStepEnum, MessageDescriptor>> = {
    [ComfortScaleStepEnum.DEFAULT]: msg`Default text size`,
    [ComfortScaleStepEnum.LARGE]: msg`Large text size`,
    [ComfortScaleStepEnum.LARGEST]: msg`Largest text size`
};

const activeStepListeners = new Set<() => void>();

const subscribeToActiveStep = (onActiveStepChange: () => void) => {
    activeStepListeners.add(onActiveStepChange);

    return () => {
        activeStepListeners.delete(onActiveStepChange);
    };
};

const notifyActiveStepListeners = () => {
    activeStepListeners.forEach(listener => void listener());
};

const getServerActiveStepId = (): ComfortScaleStepEnum => DEFAULT_COMFORT_SCALE_STEP.id;

const getClientActiveStepId = (): ComfortScaleStepEnum => {
    const currentScale = document.documentElement.style.getPropertyValue(COMFORT_SCALE_CSS_PROPERTY);
    const currentStep = COMFORT_SCALE_STEPS.find(step => String(step.scale) === currentScale);

    return isDefined(currentStep) ? currentStep.id : DEFAULT_COMFORT_SCALE_STEP.id;
};

const applyComfortScaleStep = (step: ComfortScaleStepInterface) => {
    document.documentElement.style.setProperty(COMFORT_SCALE_CSS_PROPERTY, String(step.scale));
    try {
        window.localStorage.setItem(COMFORT_SCALE_STORAGE_KEY, step.id);
    } catch {
        notifyActiveStepListeners();

        return;
    }
    notifyActiveStepListeners();
};

export const ComfortControl = () => {
    const { i18n, t } = useLingui();
    const activeStepId = useSyncExternalStore(subscribeToActiveStep, getClientActiveStepId, getServerActiveStepId);

    const handleSelectStep = (step: ComfortScaleStepInterface) => () => {
        track('comfort_scale_set', { step: step.id });
        applyComfortScaleStep(step);
    };

    return (
        <div aria-label={t`Text size`} className="comfort-control" role="group">
            {COMFORT_SCALE_STEPS.map(step => (
                <button
                    aria-label={i18n._(COMFORT_SCALE_STEP_LABELS[step.id])}
                    aria-pressed={step.id === activeStepId}
                    className="comfort-control__step"
                    key={step.id}
                    onClick={handleSelectStep(step)}
                    type="button"
                >
                    {step.symbol}
                </button>
            ))}
        </div>
    );
};
