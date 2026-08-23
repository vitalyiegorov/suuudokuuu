import { COMFORT_SCALE_CSS_PROPERTY, COMFORT_SCALE_STEPS, COMFORT_SCALE_STORAGE_KEY } from '../constants/comfort-scale.constant';

export const buildComfortScaleInitScript = (): string => {
    const scaleByStepId = JSON.stringify(Object.fromEntries(COMFORT_SCALE_STEPS.map(step => [step.id, step.scale])));

    return `(function () {
    try {
        var scaleByStepId = ${scaleByStepId};
        var storedStepId = window.localStorage.getItem('${COMFORT_SCALE_STORAGE_KEY}');
        var scale = storedStepId ? scaleByStepId[storedStepId] : undefined;

        if (scale) {
            document.documentElement.style.setProperty('${COMFORT_SCALE_CSS_PROPERTY}', String(scale));
        }
    } catch (error) {}
})();`;
};
