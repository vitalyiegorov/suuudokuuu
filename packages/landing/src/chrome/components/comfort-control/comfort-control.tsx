'use client';

import { track } from '@vercel/analytics';
import { useSyncExternalStore } from 'react';

import { isDefined } from '@rnw-community/shared';

import {
    COMFORT_SCALE_CSS_PROPERTY,
    COMFORT_SCALE_STEPS,
    COMFORT_SCALE_STORAGE_KEY,
    DEFAULT_COMFORT_SCALE_STEP
} from '../../constants/comfort-scale.constant';

import type { ComfortScaleStepEnum } from '../../enums/comfort-scale-step.enum';
import type { ComfortScaleStepInterface } from '../../interfaces/comfort-scale-step.interface';

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

interface Props {
    label: string;
    stepLabels: Readonly<Record<ComfortScaleStepEnum, string>>;
}

export const ComfortControl = ({ label, stepLabels }: Props) => {
    const activeStepId = useSyncExternalStore(subscribeToActiveStep, getClientActiveStepId, getServerActiveStepId);

    const handleSelectStep = (step: ComfortScaleStepInterface) => () => {
        track('comfort_scale_set', { step: step.id });
        applyComfortScaleStep(step);
    };

    return (
        <div aria-label={label} className="comfort-control" role="group">
            {COMFORT_SCALE_STEPS.map(step => (
                <button
                    aria-label={stepLabels[step.id]}
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
