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

const getServerActiveStepId = (): string => DEFAULT_COMFORT_SCALE_STEP.id;

const getClientActiveStepId = (): string => {
    const storedStepId = window.localStorage.getItem(COMFORT_SCALE_STORAGE_KEY);
    const storedStep = COMFORT_SCALE_STEPS.find(step => step.id === storedStepId);

    return isDefined(storedStep) ? storedStep.id : DEFAULT_COMFORT_SCALE_STEP.id;
};

const applyComfortScaleStep = (step: ComfortScaleStepInterface) => {
    document.documentElement.style.setProperty(COMFORT_SCALE_CSS_PROPERTY, String(step.scale));
    window.localStorage.setItem(COMFORT_SCALE_STORAGE_KEY, step.id);
    notifyActiveStepListeners();
};

export const ComfortControl = () => {
    const activeStepId = useSyncExternalStore(subscribeToActiveStep, getClientActiveStepId, getServerActiveStepId);

    const handleSelectStep = (step: ComfortScaleStepInterface) => () => {
        track('comfort_scale_set', { step: step.id });
        applyComfortScaleStep(step);
    };

    return (
        <div aria-label="Text size" className="comfort-control" role="group">
            {COMFORT_SCALE_STEPS.map(step => (
                <button
                    aria-label={step.label}
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
