import type { ComfortScaleStepInterface } from '../interfaces/comfort-scale-step.interface';

export const COMFORT_SCALE_STORAGE_KEY = 'suuudokuuu-landing-comfort-scale';

export const COMFORT_SCALE_CSS_PROPERTY = '--landing-scale';

export const COMFORT_SCALE_STEPS: readonly ComfortScaleStepInterface[] = [
    { id: 'default', label: 'Default text size', symbol: 'A', scale: 1 },
    { id: 'large', label: 'Large text size', symbol: 'A+', scale: 1.15 },
    { id: 'largest', label: 'Largest text size', symbol: 'A++', scale: 1.3 }
];

const [DEFAULT_COMFORT_SCALE_STEP] = COMFORT_SCALE_STEPS;

export { DEFAULT_COMFORT_SCALE_STEP };
